# Introduction to Java

Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. This topic will introduce you to Java's history, features, and core philosophy: "Write Once, Run Anywhere" (WORA).

## Overview

Java was created by James Gosling at Sun Microsystems and released in 1995. Its main goal was to allow application developers to write code that could run on any device supporting a Java Virtual Machine (JVM) without needing to be recompiled for each platform. Today, it is widely used for building enterprise-scale web applications, Android applications, and cloud-native microservices.

## Key Features

- **Object-Oriented**: Focuses on objects and classes rather than procedures.
- **Platform Independent**: Java code is compiled into bytecode, which runs on any JVM.
- **Robust and Secure**: Strong memory management, automatic garbage collection, and exception handling.
- **Multi-threaded**: Built-in support for executing multiple tasks concurrently.

### The WORA Philosophy

The "Write Once, Run Anywhere" philosophy is achieved through the JVM. When you compile Java code, it doesn't compile to machine code specific to your OS (like Windows or macOS). Instead, it compiles to intermediate **Bytecode** (.class files). The JVM on each machine reads and interprets this bytecode into native machine instructions at runtime.

### Simple Code Example

Here is a classic hello-world program in Java:

```java
public class HelloWorld {
    public static void main(String[] args) {
        // Output greeting to the console
        System.out.println("Hello, Fullstack Java Developer!");
    }
}
```

### JDK vs JRE vs JVM

Understanding the difference between the Java Development Kit (JDK), Java Runtime Environment (JRE), and Java Virtual Machine (JVM) is essential for every developer:

| Component | Purpose | What it contains |
| :--- | :--- | :--- |
| **JVM** | Executes bytecode | Interpreter, JIT Compiler, Garbage Collector |
| **JRE** | Runs Java applications | JVM + Core libraries |
| **JDK** | Develops Java applications | JRE + Development Tools (compiler, debugger) |

## Try it

To practice what you have learned:
1. Identify the command used to compile a Java file (e.g. `javac HelloWorld.java`).
2. Identify the command used to run the compiled bytecode (e.g. `java HelloWorld`).
3. Explain in your own words how the JVM enables cross-platform compatibility.
