# Exception Handling in Java

In the real world, programs encounter unexpected situations — a file that doesn't exist, a network connection that drops, a user entering text where a number is expected. Java provides a robust **exception handling** mechanism that lets you detect, describe, and recover from these error conditions in a structured way. Rather than crashing silently or returning magic error codes, Java uses **exception objects** — which carry full type information, a message, and a stack trace — to propagate errors up the call stack until they are caught and handled. Understanding exception handling is essential to writing reliable, production-quality Java code.

---

## What Are Exceptions?

An **exception** is an event that disrupts the normal flow of program execution. In Java, every exception is an object — an instance of a class that inherits from `java.lang.Throwable`. When an error occurs, Java creates an exception object and **throws** it; the runtime then searches up the call stack for a matching **catch** block.

### The Exception Class Hierarchy

```
java.lang.Throwable
├── java.lang.Error                    (serious system failures — do NOT catch)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── VirtualMachineError
└── java.lang.Exception                (program-level exceptions)
    ├── IOException                    (checked)
    ├── SQLException                   (checked)
    ├── ClassNotFoundException         (checked)
    └── java.lang.RuntimeException     (unchecked)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── ClassCastException
        ├── NumberFormatException
        ├── IllegalArgumentException
        └── ArithmeticException
```

---

## Checked vs Unchecked Exceptions

Java divides exceptions into two major categories based on whether the compiler enforces handling.

| Feature | Checked Exceptions | Unchecked Exceptions |
|---|---|---|
| Superclass | `Exception` (not RuntimeException) | `RuntimeException` or `Error` |
| Compiler check | **Mandatory** — must catch or declare | Not required |
| Declaration | Must use `throws` or `try/catch` | Optional |
| Typically represent | External failures (I/O, network, DB) | Programming bugs (null, bad index) |
| Examples | `IOException`, `SQLException`, `ClassNotFoundException` | `NullPointerException`, `ArrayIndexOutOfBoundsException` |
| Recovery expectation | Usually recoverable | Often indicates a bug |

```java
import java.io.*;

public class ExceptionTypeDemo {

    // CHECKED — must declare or handle
    public void readFile(String path) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(path));
        String line = reader.readLine();
        reader.close();
    }

    // UNCHECKED — no requirement to declare
    public int divide(int a, int b) {
        return a / b;   // throws ArithmeticException if b == 0
    }
}
```

---

## try / catch / finally Blocks

The `try` block wraps code that might throw an exception. One or more `catch` blocks handle specific exceptions. The `finally` block runs **always** — whether or not an exception was thrown — making it ideal for cleanup.

```java
public class TryCatchDemo {

    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        try {
            System.out.println("Attempting division...");
            int result = numbers[1] / 0;   // throws ArithmeticException
            System.out.println("Result: " + result);   // never reached
        } catch (ArithmeticException e) {
            System.out.println("Math error: " + e.getMessage());
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array error: " + e.getMessage());
        } finally {
            System.out.println("Finally block — always runs.");
        }

        System.out.println("Program continues normally.");
    }
}
// Output:
// Attempting division...
// Math error: / by zero
// Finally block — always runs.
// Program continues normally.
```

### Catch Block Ordering

Catch blocks are checked top-to-bottom. Always catch **more specific** exceptions before more general ones.

```java
try {
    // ... risky code
} catch (FileNotFoundException e) {      // more specific first ✅
    System.out.println("File not found: " + e.getMessage());
} catch (IOException e) {                // more general second ✅
    System.out.println("I/O error: " + e.getMessage());
} catch (Exception e) {                  // catch-all last ✅
    System.out.println("Unexpected: " + e.getMessage());
}

// This would FAIL to compile:
// } catch (Exception e) { ... }
// } catch (IOException e) { ... }   // ❌ Unreachable catch block
```

---

## Multi-Catch (Java 7+)

Java 7 introduced the **multi-catch** syntax, allowing a single catch block to handle multiple unrelated exception types. This eliminates duplicate handling code.

```java
import java.io.*;
import java.sql.*;

public class MultiCatchDemo {

    public void process(String input) {
        try {
            int value = Integer.parseInt(input);     // NumberFormatException?
            String text = null;
            System.out.println(text.length());       // NullPointerException?
            // imaginary DB call:
            // ResultSet rs = stmt.executeQuery(...); // SQLException?
        } catch (NumberFormatException | NullPointerException e) {
            // Handle both the same way
            System.out.println("Input or null error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("General error: " + e.getMessage());
        }
    }
}
```

> **Note:** In a multi-catch, the variable `e` is implicitly `final` — you cannot reassign it inside the block.

---

## try-with-resources (Java 7+)

The **try-with-resources** statement automatically closes resources that implement the `AutoCloseable` interface (or `Closeable` which extends it). This eliminates the need for a `finally` block to close streams and connections.

```java
import java.io.*;

public class TryWithResourcesDemo {

    // OLD way — manual cleanup in finally
    public void readFileOld(String path) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try { reader.close(); } catch (IOException ex) { ex.printStackTrace(); }
            }
        }
    }

    // NEW way — resource closed automatically
    public void readFileNew(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // reader.close() is called automatically here — even if exception occurs!
    }

    // Multiple resources — closed in reverse order of declaration
    public void copyFile(String src, String dest) throws IOException {
        try (
            BufferedReader reader = new BufferedReader(new FileReader(src));
            BufferedWriter writer = new BufferedWriter(new FileWriter(dest))
        ) {
            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
        }
        // writer closed first, then reader
    }
}
```

### Implementing AutoCloseable

```java
public class DatabaseConnection implements AutoCloseable {
    private String url;

    public DatabaseConnection(String url) {
        this.url = url;
        System.out.println("Connecting to: " + url);
    }

    public void query(String sql) {
        System.out.println("Executing: " + sql);
    }

    @Override
    public void close() {
        System.out.println("Connection to " + url + " closed.");
    }
}

// Usage:
try (DatabaseConnection conn = new DatabaseConnection("jdbc:mysql://localhost/mydb")) {
    conn.query("SELECT * FROM users");
}
// Output:
// Connecting to: jdbc:mysql://localhost/mydb
// Executing: SELECT * FROM users
// Connection to jdbc:mysql://localhost/mydb closed.
```

---

## The `throws` Declaration

A method that may throw a **checked** exception and does not handle it internally must declare it using `throws`. This signals callers that they must handle or propagate the exception.

```java
import java.io.*;

public class ThrowsDemo {

    // Declares it may throw IOException
    public String readFirstLine(String filename) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            return br.readLine();
        }
    }

    // Caller must handle it
    public void run() {
        try {
            String line = readFirstLine("data.txt");
            System.out.println("First line: " + line);
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
    }

    // OR propagate further up
    public void runAndPropagate() throws IOException {
        String line = readFirstLine("data.txt");
        System.out.println("First line: " + line);
    }
}
```

---

## The `throw` Keyword

The `throw` keyword is used to **explicitly throw** an exception — either a new one or one you caught.

```java
public class AgeValidator {

    public void validateAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative: " + age);
        }
        if (age > 150) {
            throw new IllegalArgumentException("Age seems unrealistic: " + age);
        }
        System.out.println("Valid age: " + age);
    }

    // Re-throwing an exception
    public void process(String input) throws Exception {
        try {
            int value = Integer.parseInt(input);
            validateAge(value);
        } catch (NumberFormatException e) {
            System.out.println("Logging: bad input format");
            throw new Exception("Invalid input: " + input, e);  // wrap original
        }
    }
}
```

---

## Creating Custom Exceptions

You can create custom exception classes by extending `Exception` (for checked) or `RuntimeException` (for unchecked). Custom exceptions make error handling more descriptive and domain-specific.

```java
// Checked custom exception
public class InsufficientFundsException extends Exception {
    private double amount;
    private double balance;

    public InsufficientFundsException(double amount, double balance) {
        super(String.format(
            "Cannot withdraw %.2f. Current balance: %.2f", amount, balance));
        this.amount = amount;
        this.balance = balance;
    }

    public double getAmount()  { return amount; }
    public double getBalance() { return balance; }
}

// Unchecked custom exception
public class InvalidAccountException extends RuntimeException {
    private String accountId;

    public InvalidAccountException(String accountId) {
        super("No account found with ID: " + accountId);
        this.accountId = accountId;
    }

    public String getAccountId() { return accountId; }
}

// Using custom exceptions
public class BankAccount {
    private String id;
    private double balance;

    public BankAccount(String id, double balance) {
        this.id = id;
        this.balance = balance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount, balance);
        }
        balance -= amount;
        System.out.printf("Withdrew %.2f. New balance: %.2f%n", amount, balance);
    }

    public static BankAccount findById(String id) {
        // Simulated lookup failure
        if (!id.startsWith("ACC")) {
            throw new InvalidAccountException(id);   // unchecked — no throws needed
        }
        return new BankAccount(id, 1000.0);
    }
}

public class Main {
    public static void main(String[] args) {
        try {
            BankAccount account = BankAccount.findById("ACC-001");
            account.withdraw(1500.00);
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction failed: " + e.getMessage());
            System.out.printf("Shortfall: %.2f%n", e.getAmount() - e.getBalance());
        } catch (InvalidAccountException e) {
            System.out.println("Account error: " + e.getMessage());
        }
    }
}
```

---

## Common Runtime Exceptions

```java
public class CommonExceptions {

    // 1. NullPointerException — accessing a member on a null reference
    public void nullPointerDemo() {
        String s = null;
        // s.length();   // ❌ NullPointerException
        System.out.println(s != null ? s.length() : "null string");   // ✅ safe
    }

    // 2. ArrayIndexOutOfBoundsException — accessing invalid array index
    public void arrayBoundsDemo() {
        int[] arr = {1, 2, 3};
        // arr[5] = 10;   // ❌ ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
        for (int i = 0; i < arr.length; i++) {   // ✅ always use arr.length
            System.out.println(arr[i]);
        }
    }

    // 3. ClassCastException — illegal downcast
    public void classCastDemo() {
        Object obj = "Hello";
        // Integer num = (Integer) obj;   // ❌ ClassCastException
        if (obj instanceof Integer num) {
            System.out.println("Integer: " + num);   // ✅ safe pattern match
        } else {
            System.out.println("Not an Integer: " + obj);
        }
    }

    // 4. NumberFormatException — invalid string-to-number conversion
    public void numberFormatDemo() {
        String input = "abc";
        try {
            int num = Integer.parseInt(input);   // ❌ NumberFormatException
        } catch (NumberFormatException e) {
            System.out.println("Invalid number: " + input);   // ✅ handled
        }
    }

    // 5. ArithmeticException — division by zero
    public void arithmeticDemo(int b) {
        try {
            int result = 100 / b;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero.");   // ✅
        }
    }

    // 6. StackOverflowError — infinite recursion (Error, not Exception)
    public void recursionDemo() {
        // recursionDemo();  // ❌ StackOverflowError
    }
}
```

---

## Exception Handling Best Practices

- **Be specific** — catch the most specific exception type you expect. Avoid `catch (Exception e)` as a default.
- **Never swallow exceptions** — an empty catch block hides bugs and makes debugging impossible.
- **Always log** — at minimum, print the stack trace or log with a proper logging framework.
- **Use custom exceptions** — domain-specific exceptions make error messages meaningful.
- **Prefer unchecked for programming errors** — don't force callers to handle bugs they can't fix.
- **Clean up with try-with-resources** — always use it for `AutoCloseable` resources.
- **Don't use exceptions for control flow** — exceptions are for exceptional situations, not if/else logic.
- **Preserve the original cause** — when wrapping, pass the original exception to the new one's constructor.

```java
// ❌ BAD — swallowing exception
try {
    riskyOperation();
} catch (Exception e) {
    // nothing here — bugs will be invisible
}

// ❌ BAD — overly broad catch
try {
    processData(input);
} catch (Exception e) {
    System.out.println("Something went wrong");   // useless message
}

// ✅ GOOD — specific, logged, meaningful
try {
    processData(input);
} catch (IllegalArgumentException e) {
    logger.error("Invalid input data: {}", input, e);
    throw new DataProcessingException("Failed to process: " + input, e);
}
```

---

## Key Concepts Summary

- **Exceptions** are objects that represent error conditions; they propagate up the call stack until caught.
- The hierarchy is `Throwable → Error / Exception → RuntimeException`.
- **Checked exceptions** must be declared with `throws` or handled; **unchecked** need not be.
- `try/catch/finally` — try wraps risky code, catch handles errors, finally always runs.
- **Multi-catch** (Java 7+) handles multiple exception types with one catch block.
- **try-with-resources** (Java 7+) auto-closes `AutoCloseable` resources.
- `throws` declares what a method may throw; `throw` explicitly throws an exception.
- **Custom exceptions** extend `Exception` (checked) or `RuntimeException` (unchecked).
- Never swallow exceptions; always log and handle meaningfully.

---

## Try it

Practice these exercises to solidify your exception handling skills:

1. **Safe Division Calculator** — Write a `safeDiv(int a, int b)` method that catches `ArithmeticException` and returns `Optional<Integer>` (empty if division by zero). Test with multiple inputs.

2. **File Line Counter** — Using try-with-resources, write a method that counts and returns the number of lines in a given file. Handle `FileNotFoundException` and `IOException` separately.

3. **Custom Exception Chain** — Create a `UserService` with a `getUserById(int id)` method. If id ≤ 0, throw a custom `InvalidUserIdException`. If the user isn't found, throw `UserNotFoundException`. In `main`, catch each specifically with meaningful messages.

4. **Multi-Catch Logger** — Write a method that parses an integer from user input, divides 100 by it, and accesses an array at that index. Use a single multi-catch block for `NumberFormatException`, `ArithmeticException`, and `ArrayIndexOutOfBoundsException`.

5. **AutoCloseable Resource** — Create a class `LogFile` that implements `AutoCloseable`. Its constructor prints "Opening log", `write(String msg)` prints the message, and `close()` prints "Closing log". Use it in try-with-resources.

6. **Exception Wrapping** — Write a `DataParser` class that wraps low-level `IOException` in a custom `ParseException` (checked). In `main`, catch `ParseException` and use `getCause()` to print the original error.
