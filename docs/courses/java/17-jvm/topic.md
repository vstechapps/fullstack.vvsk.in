# JVM Internals & Memory Management

The Java Virtual Machine (JVM) is the runtime engine that makes Java's "write once, run anywhere" promise a reality. It abstracts the underlying hardware and operating system, providing a managed execution environment with automatic memory management, dynamic class loading, and adaptive just-in-time compilation. Understanding JVM internals is essential for diagnosing performance problems, tuning production applications, and reasoning about memory usage and garbage collection behavior.

---

## JVM Architecture Overview

The JVM is composed of four major subsystems that work together to execute Java bytecode.

```
+----------------------------------------------------------+
|                    Java Application                       |
+----------------------------------------------------------+
|               Class Loader Subsystem                      |
|      (Bootstrap -> Extension -> Application)              |
+----------------------+-----------------------------------+
|   Runtime Data Areas |    Execution Engine               |
|  +----------------+  |  +--------------------------+     |
|  |  Method Area   |  |  |  Interpreter             |     |
|  |  Heap          |  |  |  JIT Compiler (HotSpot)  |     |
|  |  Java Stacks   |  |  |  Garbage Collector       |     |
|  |  PC Registers  |  |  +--------------------------+     |
|  |  Native Stack  |  |                                   |
|  +----------------+  |                                   |
+----------------------+-----------------------------------+
|          Native Method Interface (JNI)                    |
+----------------------------------------------------------+
|          Native Method Libraries (OS / C libs)            |
+----------------------------------------------------------+
```

### ClassLoader Subsystem
Responsible for loading `.class` files into memory, verifying bytecode, and preparing classes for execution.

### Runtime Memory Areas
Partitioned memory regions each serving a specific purpose for class metadata, objects, thread execution, and native calls.

### Execution Engine
Interprets bytecode or compiles hot methods to native machine code via JIT. Also drives garbage collection.

### Native Method Interface (JNI)
Enables Java code to call and be called by native code written in C, C++, or assembly.

---

## Class Loading Process

Java uses a **hierarchical delegation model** for class loading. When a class is requested, the classloader first delegates to its parent before attempting to load it itself.

```
Bootstrap ClassLoader
        ^
        |
Extension ClassLoader (Platform ClassLoader in Java 9+)
        ^
        |
Application ClassLoader (System ClassLoader)
        ^
        |
Custom ClassLoader (optional)
```

### The Three Standard ClassLoaders

| ClassLoader | Loads From | Implementation |
|---|---|---|
| Bootstrap | `$JAVA_HOME/lib` (rt.jar / core modules) | Native C++ code |
| Extension / Platform | `$JAVA_HOME/lib/ext` or named modules | `sun.misc.Launcher$ExtClassLoader` |
| Application | Classpath (`-cp` or `CLASSPATH` env var) | `sun.misc.Launcher$AppClassLoader` |

### Delegation Model in Code

```java
public class ClassLoaderDemo {
    public static void main(String[] args) {
        // Application classloader
        ClassLoader appLoader = ClassLoaderDemo.class.getClassLoader();
        System.out.println("App ClassLoader:       " + appLoader);

        // Extension / Platform classloader (parent)
        ClassLoader extLoader = appLoader.getParent();
        System.out.println("Extension ClassLoader: " + extLoader);

        // Bootstrap classloader (parent of ext) -- returns null in Java
        ClassLoader bootLoader = extLoader.getParent();
        System.out.println("Bootstrap ClassLoader: " + bootLoader); // null

        // String is loaded by bootstrap
        ClassLoader stringLoader = String.class.getClassLoader();
        System.out.println("String's ClassLoader:  " + stringLoader); // null
    }
}
```

### Class Loading Phases

1. **Loading** — Reads `.class` binary and creates a `Class` object in the Method Area.
2. **Linking**
   - *Verification* — Validates bytecode is structurally correct and safe.
   - *Preparation* — Allocates memory for static fields and sets default values.
   - *Resolution* — Replaces symbolic references with direct memory references.
3. **Initialization** — Executes static initializers and static field assignments.

### Custom ClassLoader Example

```java
import java.io.*;
import java.nio.file.*;

public class FileSystemClassLoader extends ClassLoader {

    private final String basePath;

    public FileSystemClassLoader(String basePath) {
        this.basePath = basePath;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        String filePath = basePath + File.separator
                + name.replace('.', File.separatorChar) + ".class";
        try {
            byte[] classBytes = Files.readAllBytes(Path.of(filePath));
            return defineClass(name, classBytes, 0, classBytes.length);
        } catch (IOException e) {
            throw new ClassNotFoundException("Could not load class: " + name, e);
        }
    }
}
```

---

## Runtime Memory Areas

### Heap

The heap is the largest JVM memory region, shared across all threads. All object instances and arrays live here.

```
Heap
+-- Young Generation
|   +-- Eden Space       <- new objects allocated here
|   +-- Survivor S0      <- objects that survived one GC cycle
|   +-- Survivor S1
+-- Old Generation (Tenured)
    +-- Long-lived objects promoted from Young Gen
```

- **Eden Space** — New objects are created here (fast bump-pointer allocation).
- **Survivor Spaces (S0/S1)** — Objects surviving a Minor GC are copied between S0 and S1.
- **Old Generation** — Objects that survive enough GC cycles are promoted here. Major GC (Full GC) collects this region.

### Metaspace (Java 8+)

Replaced the old PermGen. Stores class metadata, method bytecode, and constant pools. Lives in **native memory** (not the Java heap), and grows automatically by default.

```java
// Class metadata lives in Metaspace
public class MetaspaceDemo {
    // Static fields reference objects in heap; their descriptor is in Metaspace
    static final String CONSTANT = "Hello";

    public void method() {
        // Bytecode for this method is stored in Metaspace
    }
}
```

### Java Stack (Thread Stack)

Each thread has its own private stack. The stack holds **frames** — one per method call. Each frame contains:

- **Local variable array** — method parameters and local variables
- **Operand stack** — working area for bytecode instructions
- **Frame data** — reference to the runtime constant pool, return address

```java
public class StackDemo {
    public static void main(String[] args) {
        // Frame 1 pushed: main()
        int result = add(5, 3);  // Frame 2 pushed: add()
        System.out.println(result);
    } // Frame 1 popped

    static int add(int a, int b) {
        // Local vars: a=5, b=3, result computed on operand stack
        return a + b;
    } // Frame 2 popped
}
```

> `StackOverflowError` is thrown when the stack depth exceeds the configured limit (default ~512KB-1MB per thread).

### PC (Program Counter) Register

Each thread has its own PC register holding the address of the **currently executing bytecode instruction**. If the current method is native, the PC is undefined.

### Native Method Stack

Equivalent of the Java stack but for native (C/C++) methods invoked via JNI. On many JVMs (including HotSpot), the native method stack is merged with the C stack.

### Memory Areas Summary Table

| Area | Per Thread? | Contains | OOM Risk |
|---|---|---|---|
| Heap (Young + Old) | No (shared) | Object instances, arrays | `OutOfMemoryError: Java heap space` |
| Metaspace | No (shared) | Class metadata, bytecode | `OutOfMemoryError: Metaspace` |
| Java Stack | Yes | Frames, local vars, operand stack | `StackOverflowError` |
| PC Register | Yes | Current bytecode address | None |
| Native Method Stack | Yes | Native call frames | `StackOverflowError` |

---

## Garbage Collection

### The Mark-and-Sweep Algorithm

1. **Mark** — Starting from GC roots (stack variables, static fields, JNI refs), traverse the object graph and mark all reachable objects.
2. **Sweep** — Reclaim memory occupied by unmarked (unreachable) objects.
3. **Compact** (optional) — Move surviving objects together to eliminate fragmentation.

```java
public class GCDemo {
    public static void main(String[] args) {
        // obj1 is reachable via local variable
        Object obj1 = new Object();

        // obj2 is unreachable -- eligible for GC
        new Object(); // anonymous, no reference

        // Creating garbage to trigger GC
        for (int i = 0; i < 100_000; i++) {
            byte[] temp = new byte[1024]; // quickly becomes unreachable
        }

        // Suggest GC (not guaranteed)
        System.gc();

        System.out.println("obj1 is still reachable: " + obj1);
    }
}
```

### GC Roots

Objects are reachable if they are referenced (directly or transitively) from a GC root:
- Local variables and method parameters on thread stacks
- Static variables of loaded classes
- JNI local and global references
- Active threads

### Generational GC

Based on the *weak generational hypothesis*: most objects die young.

- **Minor GC** — Collects only the Young Generation; fast (stop-the-world pause is short).
- **Major GC** — Collects Old Generation; slower.
- **Full GC** — Collects both Heap and Metaspace; highest pause.

---

## GC Algorithms Comparison

| Algorithm | JVM Flag | Pause Type | Throughput | Latency | Best Use Case |
|---|---|---|---|---|---|
| **Serial GC** | `-XX:+UseSerialGC` | Stop-the-world | Low | High | Single-core, small heaps, CLIs |
| **Parallel GC** | `-XX:+UseParallelGC` | Stop-the-world | High | Medium | Batch jobs, throughput-first apps |
| **G1 GC** | `-XX:+UseG1GC` | Mostly concurrent | Medium-High | Low | General purpose (Java 9+ default) |
| **ZGC** | `-XX:+UseZGC` | Concurrent (<1ms) | Medium | Very Low | Large heaps (TB), ultra-low latency |
| **Shenandoah** | `-XX:+UseShenandoahGC` | Concurrent | Medium | Very Low | Large heaps, latency-sensitive apps |

### G1 GC — Region-Based Collection

G1 divides the heap into equal-sized **regions** (typically 1-32 MB each). It collects the regions with the most garbage first — hence "Garbage-First."

```
Heap with G1:
+---+---+---+---+---+---+---+---+
| E | E | S | O | O | H | E | O |
+---+---+---+---+---+---+---+---+
 E=Eden  S=Survivor  O=Old  H=Humongous (large objects)
```

---

## JIT Compilation

### Interpreted vs Compiled Execution

The JVM starts by **interpreting** bytecode instruction-by-instruction (slow but fast startup). HotSpot monitors execution frequency and identifies **hot methods** — methods called frequently. These are compiled to native machine code by the JIT compiler.

```
Bytecode -> Interpreter (counts calls) -> Threshold reached?
                                               |
                                               v Yes
                                         JIT Compiler
                                               |
                                               v
                                     Native Machine Code (cached)
```

### Compilation Tiers (Tiered Compilation)

Java 8+ uses **tiered compilation** by default:

| Tier | Description |
|---|---|
| 0 | Interpreter |
| 1 | C1 — simple compile, no profiling |
| 2 | C1 — limited profiling |
| 3 | C1 — full profiling |
| 4 | C2 — heavily optimized native code |

### JIT Optimizations

- **Inlining** — Replaces method calls with the method body directly.
- **Escape Analysis** — Detects objects that don't escape a method scope; allocates them on the stack.
- **Loop Unrolling** — Reduces loop overhead for short, hot loops.
- **Dead Code Elimination** — Removes code that never executes.

```java
public class JITDemo {
    // This simple hot loop will be JIT compiled after ~10,000 invocations
    public static long sumRange(int n) {
        long sum = 0;
        for (int i = 0; i <= n; i++) {
            sum += i;
        }
        return sum;
    }

    public static void main(String[] args) {
        // Warm up the JIT
        for (int i = 0; i < 20_000; i++) {
            sumRange(1000);
        }
        // Now sumRange runs as compiled native code
        long result = sumRange(1_000_000);
        System.out.println("Sum: " + result);
    }
}
```

---

## JVM Tuning Flags

### Memory Sizing

```bash
# Set initial and maximum heap size
java -Xms512m -Xmx2g MyApp

# Set thread stack size (affects max thread count)
java -Xss512k MyApp

# Limit Metaspace growth
java -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m MyApp
```

### GC Selection and Tuning

```bash
# Use G1 GC (default in Java 9+)
java -XX:+UseG1GC MyApp

# Use ZGC for ultra-low latency (Java 15+)
java -XX:+UseZGC MyApp

# Set G1 pause target (milliseconds)
java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 MyApp

# Log GC activity (Java 9+)
java -Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=10m MyApp
```

### Production-Ready JVM Flags

```bash
java \
  -Xms1g -Xmx1g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/heapdump.hprof \
  -XX:+ExitOnOutOfMemoryError \
  -XX:MaxRAMPercentage=75.0 \
  -Xlog:gc*:file=/var/log/gc.log:time,uptime \
  -jar myapp.jar
```

### JVM Flag Quick Reference

| Flag | Purpose | Example |
|---|---|---|
| `-Xms` | Initial heap size | `-Xms512m` |
| `-Xmx` | Maximum heap size | `-Xmx4g` |
| `-Xss` | Thread stack size | `-Xss256k` |
| `-XX:+UseG1GC` | Enable G1 collector | — |
| `-XX:+UseZGC` | Enable ZGC | — |
| `-XX:MaxRAMPercentage` | Heap % of container RAM | `-XX:MaxRAMPercentage=75` |
| `-XX:+HeapDumpOnOutOfMemoryError` | Dump heap on OOM | — |
| `-XX:MetaspaceSize` | Initial metaspace size | `-XX:MetaspaceSize=64m` |
| `-Xlog:gc*` | GC logging (Java 9+) | `-Xlog:gc*:file=gc.log` |

---

## Memory Leaks and How to Avoid Them

A memory leak in Java occurs when objects are still **referenced** (not eligible for GC) but are **no longer needed** by the application.

### Common Causes

```java
import java.util.*;

public class MemoryLeakExamples {

    // LEAK 1: Static collection that grows forever
    static List<byte[]> cache = new ArrayList<>();

    public void addToCache(byte[] data) {
        cache.add(data); // Never removed -- leak!
    }

    // LEAK 2: Forgotten listeners / callbacks
    static List<Runnable> listeners = new ArrayList<>();

    public void registerListener(Runnable r) {
        listeners.add(r); // Never deregistered -- leak!
    }
}
```

### Using WeakReference to Avoid Leaks

```java
import java.lang.ref.*;
import java.util.*;

public class WeakReferenceDemo {

    // WeakHashMap: entries are GC-able when key has no strong references
    private final Map<Object, String> cache = new WeakHashMap<>();

    public void store(Object key, String value) {
        cache.put(key, value);
    }

    public String retrieve(Object key) {
        return cache.get(key); // may return null after GC
    }

    public static void main(String[] args) throws InterruptedException {
        WeakReferenceDemo demo = new WeakReferenceDemo();
        Object key = new Object();
        demo.store(key, "some data");

        System.out.println("Before GC: " + demo.retrieve(key));

        key = null; // Remove strong reference
        System.gc();
        Thread.sleep(100);

        System.out.println("After GC:  " + demo.retrieve(key)); // null -- GC reclaimed
    }
}
```

### Prevention Strategies

- Use **`WeakHashMap`** or **`SoftReference`** for caches.
- Always **deregister listeners** in `close()` / `destroy()` methods.
- Prefer **try-with-resources** to ensure streams/connections are closed.
- Avoid holding **large objects in static fields**.
- Use **connection pool libraries** (HikariCP) rather than managing connections manually.

---

## JVM Diagnostic Tools

### Command-Line Tools

| Tool | Purpose | Example Command |
|---|---|---|
| `jps` | List running JVM processes | `jps -l` |
| `jstack` | Thread dump (deadlock detection) | `jstack <pid>` |
| `jmap` | Heap dump / histogram | `jmap -histo <pid>` |
| `jstat` | GC statistics in real time | `jstat -gcutil <pid> 1000` |
| `jcmd` | Multi-purpose JVM diagnostic | `jcmd <pid> VM.flags` |
| `jinfo` | JVM flags and properties | `jinfo -flags <pid>` |

### jstat GC Monitoring

```bash
# Print GC utilization every 1 second for PID 12345
jstat -gcutil 12345 1000

# Output columns:
# S0    S1    E     O     M     YGC   YGCT  FGC   FGCT  GCT
# 0.00  47.2  73.4  28.9  96.3  142   3.421  2     0.847  4.268
```

### Heap Dump Analysis with jmap

```bash
# Capture heap dump
jmap -dump:format=b,file=heapdump.hprof <pid>

# Print object histogram (top memory consumers)
jmap -histo:live <pid> | head -30
```

### Java Flight Recorder (JFR)

JFR is a low-overhead profiling and event collection framework built into the JDK (open-sourced in Java 11).

```bash
# Start JFR recording
jcmd <pid> JFR.start duration=60s filename=recording.jfr

# Dump in-progress recording
jcmd <pid> JFR.dump filename=recording.jfr

# Stop recording
jcmd <pid> JFR.stop
```

Open `.jfr` files in **JDK Mission Control (JMC)** for visualization.

### Programmatic JFR Events

```java
import jdk.jfr.*;

@Label("My Custom Event")
@Description("Tracks custom business logic performance")
public class MyEvent extends jdk.jfr.Event {
    @Label("Operation Name")
    String operationName;

    @Label("Duration Ms")
    long durationMs;
}

public class JFRDemo {
    public static void main(String[] args) {
        MyEvent event = new MyEvent();
        event.begin();

        // ... perform work ...
        event.operationName = "dataProcessing";
        event.durationMs = 42;

        event.commit(); // Published to JFR stream
    }
}
```

---

## Try it

### Exercise 1 — ClassLoader Inspection
Write a program that prints the ClassLoader chain for `ArrayList`, `String`, and your own class. Verify that `String`'s ClassLoader returns `null` (bootstrap).

### Exercise 2 — Heap Pressure Simulation

```java
import java.util.*;

public class HeapPressure {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        try {
            while (true) {
                list.add(new byte[1024 * 1024]); // 1 MB chunks
                System.out.println("Allocated: " + list.size() + " MB");
            }
        } catch (OutOfMemoryError e) {
            System.out.println("OOM after " + list.size() + " MB.");
        }
    }
}
```

Run it with different `-Xmx` values (e.g., `-Xmx64m`, `-Xmx256m`) and observe when OOM occurs.

### Exercise 3 — GC Logging Analysis
Run any Java program with GC logging enabled:
```bash
java -Xlog:gc*:file=gc.log:time,uptime -Xmx128m -jar myapp.jar
```
Open `gc.log` and identify Minor GC events vs Full GC events. Note the pause durations.

### Exercise 4 — JIT Warm-up Benchmark
Compare the execution time of the first 10 invocations vs the last 10 invocations of a computation-heavy method using `System.nanoTime()`. Observe how the JIT compiler reduces execution time as the method warms up.

### Exercise 5 — Memory Leak Detection
1. Create a static `List<Object>` that grows inside a loop without bound.
2. Run with `-XX:+HeapDumpOnOutOfMemoryError`.
3. Analyze the heap dump using VisualVM or Eclipse MAT to identify the largest retained objects.

### Challenge — Custom ClassLoader
Implement a `EncryptedClassLoader` that reads `.class` files XOR-encrypted with a secret key, decrypts them in memory, and loads the class using `defineClass`. Test it by loading and invoking a class entirely through this custom loader.
