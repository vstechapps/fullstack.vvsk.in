# Concurrency & Multithreading in Java

Modern applications are expected to perform multiple tasks simultaneously — handling requests, processing data, updating UIs, and communicating over networks — all at the same time. Java has first-class support for **concurrency** built directly into the language and standard library. Starting with basic `Thread` and `Runnable`, through the `synchronized` keyword, and up to the rich `java.util.concurrent` package introduced in Java 5, Java gives you every tool needed to write correct, efficient, and scalable concurrent programs. This topic covers the complete concurrency toolbox from fundamentals to production-ready patterns.

---

## Processes vs Threads

| Feature | Process | Thread |
|---|---|---|
| Definition | Independent program execution unit | Lightweight unit within a process |
| Memory | Own private memory space | Shares process memory |
| Communication | IPC (pipes, sockets, etc.) | Shared memory (direct) |
| Creation cost | High | Low |
| Isolation | Strong | Weak (shared state = risk) |
| Context switch | Expensive | Cheaper |
| Example | JVM itself is a process | Each `Thread` object |

A Java application runs inside a single JVM process but can spawn many threads. Every Java program starts with at least one thread: the **main thread**.

---

## Creating Threads

### Method 1: Extend `Thread`

```java
public class MyThread extends Thread {
    private final String taskName;

    public MyThread(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public void run() {
        System.out.println(taskName + " running on " + Thread.currentThread().getName());
    }
}

// Usage
MyThread t1 = new MyThread("DataLoader");
MyThread t2 = new MyThread("ReportGenerator");
t1.start(); // Starts a new thread — do NOT call run() directly
t2.start();
```

### Method 2: Implement `Runnable`

Preferred over extending `Thread` because Java supports single inheritance.

```java
public class PrintTask implements Runnable {
    private final String message;

    public PrintTask(String message) {
        this.message = message;
    }

    @Override
    public void run() {
        System.out.println(message + " — " + Thread.currentThread().getName());
    }
}

// Usage
Thread t = new Thread(new PrintTask("Hello from Runnable"));
t.start();
```

### Method 3: Lambda Expression

Since `Runnable` is a functional interface, a lambda is the cleanest option for short tasks.

```java
Thread t = new Thread(() -> {
    for (int i = 1; i <= 5; i++) {
        System.out.println("Count: " + i);
    }
});
t.setName("CounterThread");
t.start();
```

---

## Thread Lifecycle

A thread moves through several states during its lifetime:

| State | Description |
|---|---|
| `NEW` | Thread object created, `start()` not yet called |
| `RUNNABLE` | `start()` called; thread may be running or waiting for CPU |
| `BLOCKED` | Waiting to acquire an intrinsic lock (e.g. entering `synchronized`) |
| `WAITING` | Waiting indefinitely for another thread (`wait()`, `join()` with no timeout) |
| `TIMED_WAITING` | Waiting for a specified time (`sleep()`, `join(ms)`, `wait(ms)`) |
| `TERMINATED` | `run()` method has completed (normally or via exception) |

```java
Thread t = new Thread(() -> {
    try { Thread.sleep(2000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
});

System.out.println(t.getState()); // NEW
t.start();
System.out.println(t.getState()); // RUNNABLE or TIMED_WAITING
t.join();
System.out.println(t.getState()); // TERMINATED
```

---

## Thread Methods

### `start()` and `run()`

```java
Thread t = new Thread(() -> System.out.println("Task"));
t.start(); // Correct — launches new thread
// t.run(); // Wrong — executes on current thread, no concurrency
```

### `sleep()`

Pauses the current thread without releasing locks.

```java
try {
    System.out.println("Going to sleep...");
    Thread.sleep(1000); // 1 second
    System.out.println("Awake!");
} catch (InterruptedException e) {
    Thread.currentThread().interrupt(); // Restore interrupted status
}
```

### `join()`

Makes the calling thread wait until the target thread finishes.

```java
Thread worker = new Thread(() -> {
    System.out.println("Worker started");
    try { Thread.sleep(2000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    System.out.println("Worker done");
});

worker.start();
worker.join(); // Main thread blocks here until worker finishes
System.out.println("Main continues after worker");
```

### `interrupt()`

Signals a thread to stop what it's doing.

```java
Thread t = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        System.out.println("Working...");
        try { Thread.sleep(500); } 
        catch (InterruptedException e) {
            System.out.println("Interrupted!");
            Thread.currentThread().interrupt(); // Re-set flag
            break;
        }
    }
});
t.start();
Thread.sleep(1500);
t.interrupt(); // Signal to stop
```

---

## Race Conditions and Synchronization

A **race condition** occurs when two or more threads access shared mutable data concurrently and the final result depends on thread scheduling order.

```java
// BUG: Race condition — counter is not thread-safe
public class Counter {
    private int count = 0;

    public void increment() { count++; } // NOT atomic — 3 operations: read, add, write
    public int getCount()   { return count; }
}

Counter c = new Counter();
Thread t1 = new Thread(() -> { for (int i = 0; i < 10000; i++) c.increment(); });
Thread t2 = new Thread(() -> { for (int i = 0; i < 10000; i++) c.increment(); });
t1.start(); t2.start();
t1.join(); t2.join();
System.out.println(c.getCount()); // Likely NOT 20000 — race condition!
```

### `synchronized` — Method Level

```java
public class SafeCounter {
    private int count = 0;

    // Only one thread can execute this at a time per instance
    public synchronized void increment() { count++; }
    public synchronized int getCount()   { return count; }
}
```

### `synchronized` — Block Level

Finer-grained control: only the critical section is locked, improving throughput.

```java
public class SafeCounter {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        // Non-critical code can run outside the block
        synchronized (lock) {
            count++; // Only this critical section is locked
        }
    }
}
```

---

## `volatile` Keyword

`volatile` ensures that reads and writes to a variable go directly to main memory, making changes immediately visible to all threads. It solves the **visibility** problem but NOT atomicity.

```java
public class StatusFlag {
    private volatile boolean running = true;

    public void stop() { running = false; } // Written immediately to main memory

    public void work() {
        while (running) { // Always reads from main memory
            System.out.println("Working...");
        }
        System.out.println("Stopped.");
    }
}
```

---

## `java.util.concurrent` Package

The `java.util.concurrent` package provides high-level, production-ready concurrency utilities.

### `ExecutorService` and Thread Pools

Instead of creating raw threads, use an `ExecutorService` to manage a pool of reusable threads.

```java
import java.util.concurrent.*;

ExecutorService executor = Executors.newFixedThreadPool(4); // Pool of 4 threads

for (int i = 1; i <= 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.printf("Task %d on %s%n", taskId, Thread.currentThread().getName());
    });
}

executor.shutdown();                      // No new tasks accepted
executor.awaitTermination(10, TimeUnit.SECONDS); // Wait for completion
```

### `Callable<T>` and `Future<T>`

`Callable` is like `Runnable` but can return a result and throw checked exceptions. `Future` holds the eventual result.

```java
import java.util.concurrent.*;

ExecutorService exec = Executors.newSingleThreadExecutor();

Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42; // Return a result
};

Future<Integer> future = exec.submit(task);

System.out.println("Task submitted, doing other work...");
Integer result = future.get(); // Blocks until result is available
System.out.println("Result: " + result); // 42

exec.shutdown();
```

### `ThreadPoolExecutor` — Fine-Grained Control

```java
import java.util.concurrent.*;

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    2,                          // corePoolSize
    5,                          // maximumPoolSize
    60L, TimeUnit.SECONDS,      // keepAliveTime
    new LinkedBlockingQueue<>(100), // work queue
    new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy
);

executor.submit(() -> System.out.println("Custom pool task"));
executor.shutdown();
```

---

## `Lock` and `ReentrantLock`

`ReentrantLock` provides more flexibility than `synchronized`: try-lock with timeout, interruptible locking, and fairness policies.

```java
import java.util.concurrent.locks.*;

public class SafeCounter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // Always unlock in finally
        }
    }

    public boolean tryIncrement() {
        if (lock.tryLock()) { // Non-blocking attempt
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false; // Lock not available
    }
}
```

---

## Countdown and Synchronization Barriers

### `CountDownLatch`

Allows one or more threads to wait until a set of operations in other threads completes.

```java
import java.util.concurrent.*;

CountDownLatch latch = new CountDownLatch(3); // Wait for 3 signals

Runnable worker = () -> {
    System.out.println(Thread.currentThread().getName() + " done");
    latch.countDown(); // Decrement count
};

new Thread(worker, "Worker-1").start();
new Thread(worker, "Worker-2").start();
new Thread(worker, "Worker-3").start();

latch.await(); // Main thread waits until count reaches 0
System.out.println("All workers finished!");
```

### `CyclicBarrier`

Allows a set of threads to all wait for each other to reach a common barrier point — and can be reused (cyclic).

```java
import java.util.concurrent.*;

CyclicBarrier barrier = new CyclicBarrier(3, () -> 
    System.out.println("All threads reached barrier — proceeding!"));

Runnable task = () -> {
    System.out.println(Thread.currentThread().getName() + " waiting at barrier");
    try {
        barrier.await(); // Wait until all 3 arrive
        System.out.println(Thread.currentThread().getName() + " passed barrier");
    } catch (InterruptedException | BrokenBarrierException e) {
        Thread.currentThread().interrupt();
    }
};

new Thread(task, "T1").start();
new Thread(task, "T2").start();
new Thread(task, "T3").start();
```

---

## Concurrent Collections

Standard collections like `ArrayList` and `HashMap` are **not thread-safe**. Use these concurrent alternatives:

| Collection | Thread-Safe Alternative | Notes |
|---|---|---|
| `HashMap` | `ConcurrentHashMap` | Segment-level locking; high throughput |
| `ArrayList` | `CopyOnWriteArrayList` | Copies array on write; good for read-heavy |
| `LinkedList` (queue) | `LinkedBlockingQueue` | Blocking producer-consumer queue |
| `TreeMap` | `ConcurrentSkipListMap` | Sorted concurrent map |
| `HashSet` | `CopyOnWriteArraySet` | Set backed by `CopyOnWriteArrayList` |

```java
import java.util.concurrent.*;

// ConcurrentHashMap — safe for concurrent reads and writes
ConcurrentHashMap<String, Integer> wordCount = new ConcurrentHashMap<>();
wordCount.put("java", 1);
wordCount.merge("java", 1, Integer::sum); // Atomic read-modify-write
System.out.println(wordCount.get("java")); // 2

// CopyOnWriteArrayList — safe iteration without ConcurrentModificationException
CopyOnWriteArrayList<String> safeList = new CopyOnWriteArrayList<>();
safeList.add("Hello");
safeList.add("World");
for (String s : safeList) { // Safe even if other threads modify the list
    System.out.println(s);
}
```

---

## Common Pitfalls

### Deadlock

A deadlock occurs when two or more threads are each waiting for a lock held by the other, forming a cycle.

```java
Object lockA = new Object();
Object lockB = new Object();

Thread t1 = new Thread(() -> {
    synchronized (lockA) {
        System.out.println("T1 holds A, waiting for B");
        try { Thread.sleep(100); } catch (InterruptedException e) {}
        synchronized (lockB) { System.out.println("T1 holds both"); }
    }
});

Thread t2 = new Thread(() -> {
    synchronized (lockB) {  // T2 acquires B first (opposite order!)
        System.out.println("T2 holds B, waiting for A");
        synchronized (lockA) { System.out.println("T2 holds both"); }
    }
});

t1.start(); t2.start();
// DEADLOCK — t1 waits for B held by t2; t2 waits for A held by t1
```

**Fix:** Always acquire locks in a consistent, fixed order across all threads.

### Starvation

A thread is perpetually denied access to a shared resource because other threads are always given priority. Use fair locks (`new ReentrantLock(true)`) and avoid monopolizing locks for long periods.

---

## Key Concepts

- Threads within a process share memory; this shared state is the root of concurrency problems.
- Prefer **implementing `Runnable`** (or using lambdas) over extending `Thread`.
- `synchronized` provides **mutual exclusion** — only one thread at a time enters the block or method.
- `volatile` solves **visibility** but not atomicity; use `AtomicInteger` etc. for atomic compound operations.
- `ExecutorService` + thread pools are far superior to manually managing raw threads in production.
- `Callable` + `Future` allow tasks to return results and handle exceptions cleanly.
- `CountDownLatch` is one-shot; `CyclicBarrier` is reusable and fires an optional action at the barrier.
- Always use **concurrent collections** (`ConcurrentHashMap`, `CopyOnWriteArrayList`) instead of wrapping non-thread-safe ones with `Collections.synchronizedX()`.
- Avoid **deadlock** by consistently acquiring locks in the same order across all threads.
- Always call `executor.shutdown()` to release thread pool resources.

---

## Try it

1. **Race condition demo:** Create two threads that each increment a shared `int counter` 100,000 times. Run without synchronization and observe the incorrect result. Then fix it using `synchronized` and verify you always get 200,000.

2. **Thread lifecycle:** Create a thread that sleeps for 3 seconds. Print its `getState()` before `start()`, immediately after `start()`, during sleep, and after `join()`.

3. **Thread pool:** Submit 20 tasks to a `FixedThreadPool(4)`. Each task should print the task number and thread name, then sleep for 200ms. Observe that only 4 threads are used.

4. **Callable and Future:** Write a `Callable<Long>` that computes the sum of numbers from 1 to 10,000,000 (with a small sleep to simulate delay). Submit it to an `ExecutorService` and use `future.get(5, TimeUnit.SECONDS)` to retrieve the result with a timeout.

5. **CountDownLatch starter:** Simulate a race where 5 runners wait for a "starting gun." Create 5 threads blocked on a `CountDownLatch(1)`. The main thread calls `latch.countDown()` after a 1-second delay, releasing all runners simultaneously.

6. **Deadlock recreation and fix:** Recreate the deadlock example above. Then fix it by making both threads acquire `lockA` before `lockB`. Confirm it no longer deadlocks.

7. **ConcurrentHashMap word count:** Read a paragraph of text, split it into words, and use multiple threads to populate a `ConcurrentHashMap<String, Integer>` with word frequencies. Compare the result to a single-threaded version.
