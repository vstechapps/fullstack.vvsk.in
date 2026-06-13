# Java I/O & File Operations

Java's I/O system provides a comprehensive set of classes and APIs for reading from and writing to files, streams, and other data sources. The original **java.io** package, present since Java 1.0, models data movement as streams of bytes or characters. Java 1.4 introduced **java.nio** (New I/O) with buffers, channels, and non-blocking I/O, and Java 7's **NIO.2** (the `java.nio.file` package) added the modern `Path`, `Paths`, and `Files` API that greatly simplified common file operations. Understanding both the classic and modern approaches is essential for writing robust, resource-safe Java programs.

---

## Java I/O Streams Overview

All I/O in `java.io` flows through one of two hierarchies:

| Feature | Byte Streams | Character Streams |
|---|---|---|
| Base classes | `InputStream` / `OutputStream` | `Reader` / `Writer` |
| Unit of data | 8-bit byte | 16-bit Unicode character |
| Best for | Binary data (images, audio, zip) | Text data (CSV, JSON, log files) |
| Example classes | `FileInputStream`, `FileOutputStream` | `FileReader`, `FileWriter` |
| Buffered variants | `BufferedInputStream`, `BufferedOutputStream` | `BufferedReader`, `BufferedWriter` |
| Encoding handling | Manual | Automatic (charset aware) |

---

## Reading & Writing Files with Byte Streams

Use byte streams when working with binary files.

```java
import java.io.*;

// Writing bytes to a file
try (FileOutputStream fos = new FileOutputStream("output.bin")) {
    byte[] data = {72, 101, 108, 108, 111}; // "Hello" in ASCII
    fos.write(data);
    System.out.println("Bytes written successfully.");
} catch (IOException e) {
    e.printStackTrace();
}

// Reading bytes from a file
try (FileInputStream fis = new FileInputStream("output.bin")) {
    int byteRead;
    while ((byteRead = fis.read()) != -1) {
        System.out.print((char) byteRead);
    }
} catch (IOException e) {
    e.printStackTrace();
}
// Output: Hello
```

### Buffered Byte Streams

Wrapping streams in `Buffered` variants dramatically improves performance by reducing the number of actual I/O operations.

```java
import java.io.*;

// Buffered copy of a binary file
try (BufferedInputStream  in  = new BufferedInputStream(new FileInputStream("source.jpg"));
     BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream("copy.jpg"))) {
    byte[] buffer = new byte[8192]; // 8 KB buffer
    int bytesRead;
    while ((bytesRead = in.read(buffer)) != -1) {
        out.write(buffer, 0, bytesRead);
    }
    System.out.println("File copied successfully.");
} catch (IOException e) {
    e.printStackTrace();
}
```

---

## Reading & Writing Text Files

### `BufferedReader` and `BufferedWriter`

For text files, character streams with buffering are the standard approach.

```java
import java.io.*;

// Writing text
try (BufferedWriter writer = new BufferedWriter(new FileWriter("notes.txt"))) {
    writer.write("Line one");
    writer.newLine();
    writer.write("Line two");
    writer.newLine();
} catch (IOException e) {
    e.printStackTrace();
}

// Reading text line by line
try (BufferedReader reader = new BufferedReader(new FileReader("notes.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### Appending to an Existing File

```java
import java.io.*;

// The 'true' flag in FileWriter enables append mode
try (BufferedWriter writer = new BufferedWriter(new FileWriter("notes.txt", true))) {
    writer.write("Appended line");
    writer.newLine();
} catch (IOException e) {
    e.printStackTrace();
}
```

### `PrintWriter` for Formatted Output

`PrintWriter` wraps a `Writer` and provides `print`, `println`, and `printf` for convenience.

```java
import java.io.*;

try (PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter("report.txt")))) {
    pw.println("=== Sales Report ===");
    pw.printf("Total: $%,.2f%n", 125_430.75);
    pw.println("Status: Approved");
} catch (IOException e) {
    e.printStackTrace();
}
```

---

## Try-with-Resources

Java 7 introduced `try-with-resources` to guarantee that any `Closeable` resource is closed when the block exits — even if an exception is thrown. **Always use it with I/O classes.**

```java
import java.io.*;

// Automatically closes both streams on exit or exception
try (FileReader fr = new FileReader("data.txt");
     BufferedReader br = new BufferedReader(fr)) {

    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
    // br.close() and fr.close() called automatically here
} catch (FileNotFoundException e) {
    System.err.println("File not found: " + e.getMessage());
} catch (IOException e) {
    System.err.println("I/O error: " + e.getMessage());
}
```

---

## Java NIO — Modern File Operations

The `java.nio.file` package (NIO.2, Java 7+) provides a higher-level, more powerful API.

### `Path` and `Paths`

```java
import java.nio.file.*;

Path absolute = Paths.get("C:/Users/HP/Documents/notes.txt");
Path relative = Paths.get("docs", "readme.txt");

System.out.println(absolute.getFileName());  // notes.txt
System.out.println(absolute.getParent());    // C:\Users\HP\Documents
System.out.println(relative.toAbsolutePath());

// Resolve and relativize
Path base = Paths.get("/app");
Path full = base.resolve("config/settings.json");
System.out.println(full); // /app/config/settings.json
```

### `Files` Utility Class

The `Files` class offers static methods for nearly every common file operation.

#### Read All Lines

```java
import java.nio.file.*;
import java.util.List;
import java.nio.charset.StandardCharsets;

List<String> lines = Files.readAllLines(
    Paths.get("notes.txt"), StandardCharsets.UTF_8);
lines.forEach(System.out::println);
```

#### Write a String (Java 11+)

```java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

Files.writeString(Paths.get("output.txt"),
    "Hello from NIO.2!\n",
    StandardCharsets.UTF_8,
    StandardOpenOption.CREATE,
    StandardOpenOption.APPEND);
```

#### Copy and Move

```java
import java.nio.file.*;

Path src  = Paths.get("source.txt");
Path dest = Paths.get("destination.txt");

// Copy — REPLACE_EXISTING overwrites if destination exists
Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);

// Move (rename)
Files.move(src, Paths.get("renamed.txt"), StandardCopyOption.REPLACE_EXISTING);
```

#### List Directory Contents with `Files.walk`

```java
import java.nio.file.*;
import java.io.IOException;

// Walk the entire directory tree
try (var stream = Files.walk(Paths.get("src"))) {
    stream.filter(Files::isRegularFile)
          .filter(p -> p.toString().endsWith(".java"))
          .forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}

// List only immediate children (depth 1)
try (var entries = Files.list(Paths.get("."))) {
    entries.forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}
```

#### Delete, Create, and Check

```java
import java.nio.file.*;

Path file = Paths.get("temp.txt");

// Create
Files.createFile(file);                          // file
Files.createDirectories(Paths.get("a/b/c"));     // nested dirs

// Check
System.out.println(Files.exists(file));          // true
System.out.println(Files.isDirectory(file));     // false
System.out.println(Files.size(file));            // 0 (empty)

// Delete
Files.deleteIfExists(file);                      // no exception if missing
```

---

## Reading Classpath Resources

When bundling resources inside a JAR, use `Class.getResourceAsStream()` instead of `FileInputStream`.

```java
import java.io.*;
import java.nio.charset.StandardCharsets;

// Reads "config.properties" from the root of the classpath
try (InputStream is = MyClass.class.getResourceAsStream("/config.properties");
     BufferedReader reader = new BufferedReader(
         new InputStreamReader(is, StandardCharsets.UTF_8))) {

    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException | NullPointerException e) {
    System.err.println("Resource not found: " + e.getMessage());
}
```

---

## Serialization

Java serialization converts an object into a byte stream so it can be persisted or transmitted, and deserialized back into an object later.

### Making a Class Serializable

```java
import java.io.Serializable;

public class Employee implements Serializable {
    // Good practice: define a fixed serialVersionUID to control versioning
    private static final long serialVersionUID = 1L;

    private String name;
    private int    age;
    private transient String password; // 'transient' fields are NOT serialized

    public Employee(String name, int age, String password) {
        this.name     = name;
        this.age      = age;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Employee{name='" + name + "', age=" + age + ", password=" + password + "}";
    }
}
```

### Writing and Reading Objects

```java
import java.io.*;

// Serialize
try (ObjectOutputStream oos = new ObjectOutputStream(
        new BufferedOutputStream(new FileOutputStream("employee.ser")))) {
    Employee emp = new Employee("Alice", 30, "secret123");
    oos.writeObject(emp);
    System.out.println("Serialized: " + emp);
} catch (IOException e) {
    e.printStackTrace();
}

// Deserialize
try (ObjectInputStream ois = new ObjectInputStream(
        new BufferedInputStream(new FileInputStream("employee.ser")))) {
    Employee emp = (Employee) ois.readObject();
    System.out.println("Deserialized: " + emp);
    // password will be null — it was transient
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```

### Serialization Key Points

- The class **and all its non-transient fields** must be `Serializable`.
- `transient` fields are excluded from serialization.
- `serialVersionUID` is used to verify compatibility between serialized data and the current class definition — always declare it explicitly.
- If `serialVersionUID` in the serialized form doesn't match the class's current UID, an `InvalidClassException` is thrown during deserialization.

---

## Common File Operations Summary

```java
import java.nio.file.*;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.io.IOException;

public class FileOperationsDemo {
    static final Path FILE = Paths.get("demo.txt");

    public static void main(String[] args) throws IOException {
        // 1. Write (create or overwrite)
        Files.writeString(FILE, "Hello\nWorld\n");

        // 2. Read all lines
        List<String> lines = Files.readAllLines(FILE);
        System.out.println("Lines: " + lines);

        // 3. Append
        Files.writeString(FILE, "Appended!\n",
            StandardOpenOption.APPEND);

        // 4. Read entire file as string (Java 11+)
        String content = Files.readString(FILE);
        System.out.println("Content:\n" + content);

        // 5. Copy
        Files.copy(FILE, Paths.get("demo_backup.txt"),
            StandardCopyOption.REPLACE_EXISTING);

        // 6. List directory
        System.out.println("Current dir files:");
        try (var stream = Files.list(Paths.get("."))) {
            stream.filter(Files::isRegularFile).forEach(System.out::println);
        }

        // 7. Delete
        Files.deleteIfExists(FILE);
        Files.deleteIfExists(Paths.get("demo_backup.txt"));
        System.out.println("Files deleted.");
    }
}
```

---

## Key Concepts

- Java I/O has two hierarchies: **byte streams** (`InputStream`/`OutputStream`) and **character streams** (`Reader`/`Writer`).
- Always wrap streams with **Buffered** variants for better performance.
- **Try-with-resources** guarantees stream closure — prefer it over manual `finally` blocks.
- **Java NIO.2** (`java.nio.file`) provides the `Path`, `Paths`, and `Files` API — cleaner and more feature-rich than classic `java.io` for most use cases.
- `Files.readAllLines`, `Files.readString`, `Files.writeString`, `Files.walk` cover the majority of text file needs.
- Use `Class.getResourceAsStream()` to read files bundled inside JAR archives.
- **Serialization** lets you persist Java objects to byte streams; always declare `serialVersionUID` and mark sensitive fields as `transient`.
- `StandardOpenOption` constants (`CREATE`, `APPEND`, `TRUNCATE_EXISTING`) give fine-grained control over write behavior.

---

## Try it

1. **Read and count words:** Read a text file line by line using `BufferedReader`. Count the total number of words (split each line on whitespace) and print the count.

2. **NIO copy utility:** Write a method `copyFile(String src, String dest)` using `Files.copy` that overwrites the destination if it exists, and prints the number of bytes copied using `Files.size`.

3. **Directory report:** Use `Files.walk` to list all `.txt` files under a given directory, printing each file's name and size in bytes.

4. **Serialization round-trip:** Create a `Student` class (name, grade, `transient` password) that implements `Serializable`. Serialize a list of students to a file, then deserialize and print them. Verify that `password` is `null` after deserialization.

5. **Classpath resource:** Add a `data.csv` file to your project's `src/main/resources` folder. Use `getResourceAsStream` to read and print its contents.

6. **Append log:** Write a `Logger` class with a method `log(String message)` that appends a timestamped line to `app.log` using `Files.writeString` with `StandardOpenOption.APPEND`. Call it 5 times and inspect the output file.

7. **Exception handling:** Modify your file-reading code to distinguish between `FileNotFoundException` (file doesn't exist) and other `IOException` types, printing a user-friendly message for each case.
