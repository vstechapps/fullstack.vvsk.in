# Java Syntax Fundamentals

Every Java program follows a precise structural contract — from how the file is named to how statements are terminated. Understanding Java's syntax rules is the foundation upon which all other Java knowledge is built. This topic dissects the anatomy of a Java program, explains naming conventions, covers every type of comment, and shows how scope and blocks govern where variables live.

---

## Structure of a Java Program

A complete Java source file has several layers, each nested inside the next:

```java
// 1. Package declaration (optional but recommended)
package com.example.myapp;

// 2. Import statements
import java.util.Scanner;
import java.util.List;

// 3. Class declaration
public class MyProgram {

    // 4. Fields (class-level variables)
    private String name;

    // 5. Main method — entry point
    public static void main(String[] args) {

        // 6. Local variables and statements
        int age = 25;
        System.out.println("Hello from MyProgram!");
    }
}
```

### Package Declaration

```java
package com.example.myapp;
```

- Must be the **very first non-comment line** in the file.
- Uses **reverse-domain notation** as a naming convention (`com.companyname.project`).
- Groups related classes into namespaces; prevents name collisions.
- Optional — if omitted, the class belongs to the *default package* (discouraged in real projects).

### Import Statements

```java
import java.util.Scanner;     // imports one specific class
import java.util.List;        // imports another specific class
import java.util.*;            // wildcard — imports all classes in java.util (use sparingly)
```

- Imports tell the compiler where to find classes referenced in your code.
- `java.lang` (contains `String`, `System`, `Math`, etc.) is **automatically imported** — no import needed.
- Static imports allow using static members without the class prefix:

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double circumference = 2 * PI * 5.0;  // PI instead of Math.PI
double root = sqrt(16);               // sqrt instead of Math.sqrt
```

### Class Declaration

```java
public class MyProgram {
    // class body
}
```

- Every Java program must have at least one class.
- The **filename must match the public class name** exactly: `MyProgram.java` ↔ `public class MyProgram`.
- A file can contain multiple classes, but only one can be `public`.

### The `main` Method

```java
public static void main(String[] args) {
    // program starts here
}
```

| Part | Meaning |
|------|---------|
| `public` | JVM must be able to call it from outside the class |
| `static` | Called without creating an object |
| `void` | Returns nothing |
| `main` | Reserved name the JVM looks for as the entry point |
| `String[] args` | Array of command-line arguments |

---

## Identifiers and Naming Conventions

An **identifier** is any name you give to a class, method, variable, or package.

### Rules (enforced by compiler)

- Must begin with a **letter**, `_`, or `$` (digits are not allowed as the first character).
- Can contain letters, digits, `_`, and `$` after the first character.
- Cannot be a **Java keyword** (see below).
- Case-sensitive: `count`, `Count`, and `COUNT` are three different identifiers.

### Conventions (enforced by community style)

| Element | Convention | Examples |
|---------|-----------|---------|
| **Classes & Interfaces** | `PascalCase` | `BankAccount`, `UserService` |
| **Methods & Variables** | `camelCase` | `getUserName()`, `totalAmount` |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_SIZE`, `PI` |
| **Packages** | `lowercase.dot.separated` | `com.example.util` |
| **Type Parameters** | Single capital letter | `T`, `E`, `K`, `V` |

```java
package com.example.bank;          // package: lowercase

public class BankAccount {          // class: PascalCase
    private static final int MAX_OVERDRAFT = 500;  // constant: UPPER_SNAKE
    private double accountBalance;   // field: camelCase

    public double getAccountBalance() {   // method: camelCase
        return accountBalance;
    }
}
```

---

## Java Keywords

Java reserves 67 keywords (as of Java 21). These cannot be used as identifiers.

| Category | Keywords |
|----------|---------|
| **Access modifiers** | `public`, `private`, `protected` |
| **Class/object** | `class`, `interface`, `enum`, `record`, `extends`, `implements`, `new`, `this`, `super`, `instanceof` |
| **Primitives** | `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean` |
| **Control flow** | `if`, `else`, `switch`, `case`, `default`, `for`, `while`, `do`, `break`, `continue`, `return` |
| **Exception handling** | `try`, `catch`, `finally`, `throw`, `throws` |
| **Modifiers** | `static`, `final`, `abstract`, `synchronized`, `volatile`, `transient`, `native`, `strictfp` |
| **Package/import** | `package`, `import` |
| **Other** | `void`, `var`, `yield`, `sealed`, `permits`, `null`, `true`, `false` |

> `null`, `true`, and `false` are technically *literals*, not keywords, but cannot be used as identifiers.

---

## Primitive Literals

A **literal** is a fixed value written directly in source code.

### Integer Literals

```java
int decimal  = 42;           // base-10 (most common)
int hex      = 0x2A;         // hexadecimal (0x prefix)  → 42
int octal    = 052;          // octal (0 prefix)         → 42
int binary   = 0b00101010;   // binary (0b prefix, Java 7+) → 42
long bigNum  = 9_876_543_210L; // L suffix = long; _ separators for readability (Java 7+)
```

### Floating-Point Literals

```java
double d1 = 3.14;
double d2 = 3.14d;          // d/D suffix optional for double
float  f1 = 3.14f;          // f/F suffix REQUIRED for float
double sci = 1.5e10;        // scientific notation = 15,000,000,000
```

### Character Literals

```java
char letter    = 'A';
char digit     = '7';
char newline   = '\n';       // escape sequence
char tab       = '\t';
char unicode   = '\u0041';   // Unicode escape = 'A'
```

### Boolean Literals

```java
boolean isActive = true;
boolean isDeleted = false;
```

### String Literals

```java
String greeting = "Hello, World!";
String empty    = "";
String escape   = "Line1\nLine2\tTabbed";

// Text Blocks (Java 15+) — multi-line strings
String json = """
        {
            "name": "Alice",
            "age": 30
        }
        """;
```

---

## Statements and Expressions

- An **expression** produces a value: `5 + 3`, `name.length()`, `x > 0`
- A **statement** performs an action and ends with `;`: `int x = 5;`, `System.out.println(x);`
- A **block** is a group of statements enclosed in `{ }`.

```java
// Expression statement
int total = 10 + 20;

// Method call statement
System.out.println(total);

// Control flow statement (uses a block)
if (total > 20) {
    System.out.println("Large");
}
```

---

## Comments

Comments are ignored by the compiler and exist purely for human readers.

### Single-Line Comment

```java
// This is a single-line comment
int x = 42; // inline comment at the end of a statement
```

### Multi-Line Comment

```java
/*
 * This comment can span
 * multiple lines.
 * It starts with slash-star and ends with star-slash.
 */
int y = 100;
```

### Javadoc Comment

Javadoc comments generate HTML API documentation using the `javadoc` tool.

```java
/**
 * Calculates the area of a circle.
 *
 * @param radius the radius of the circle (must be positive)
 * @return the area of the circle as a double
 * @throws IllegalArgumentException if radius is negative
 */
public double circleArea(double radius) {
    if (radius < 0) throw new IllegalArgumentException("Radius cannot be negative");
    return Math.PI * radius * radius;
}
```

| Comment Type | Syntax | Used For |
|-------------|--------|---------|
| Single-line | `// text` | Quick notes, disabling a line |
| Multi-line | `/* text */` | Longer explanations, disabling blocks |
| Javadoc | `/** text */` | API documentation for classes/methods |

---

## Blocks and Scope

A **block** is delimited by `{ }`. Variables declared inside a block are only accessible within that block (and its nested blocks). This is called **lexical scope**.

```java
public class ScopeDemo {
    static int classField = 10;  // accessible in all methods

    public static void main(String[] args) {
        int outerVar = 20;        // accessible in main's block

        if (outerVar > 10) {
            int innerVar = 30;    // only accessible inside this if block
            System.out.println(outerVar + innerVar); // OK: 50
            System.out.println(classField);          // OK: 10
        }

        // System.out.println(innerVar); // ERROR: innerVar is out of scope
        System.out.println(outerVar);    // OK: 20
    }
}
```

### Scope Rules Summary

| Scope Level | Where Declared | Accessible In |
|------------|---------------|--------------|
| Class (field) | Inside class, outside methods | All methods in the class |
| Method (local) | Inside a method | That method only |
| Block (local) | Inside `{}` (if, for, etc.) | That block and nested blocks only |

---

## Semicolons

Every **statement** in Java must end with a semicolon `;`. Forgetting one is a compile-time error.

```java
int a = 5;             // ✅ correct
int b = 10             // ❌ compile error: ';' expected
System.out.println(a); // ✅ correct
```

Block-level constructs (`if`, `for`, `class`, method declarations) do **not** need a semicolon after the closing `}`.

---

## Java vs Python vs JavaScript — Syntax Comparison

| Feature | Java | Python | JavaScript |
|---------|------|--------|-----------|
| **Statement terminator** | `;` (required) | newline | `;` (optional) |
| **Block delimiter** | `{ }` | Indentation | `{ }` |
| **Variable declaration** | Type required (`int x = 5`) | No type (`x = 5`) | `let`/`const`/`var` |
| **Entry point** | `public static void main(...)` | `if __name__ == "__main__":` | Top-level or module |
| **String type** | `String` (capital S, class) | `str` | `string` (primitive) |
| **Null value** | `null` | `None` | `null` / `undefined` |
| **Boolean literals** | `true`, `false` | `True`, `False` | `true`, `false` |
| **Print to console** | `System.out.println()` | `print()` | `console.log()` |
| **Comments** | `//`, `/* */`, `/** */` | `#`, `""" """` | `//`, `/* */` |
| **Compilation** | Compiled to bytecode | Interpreted | Interpreted (JIT in V8) |
| **Type system** | Statically typed | Dynamically typed | Dynamically typed |

---

## A Complete Example

The following program demonstrates all the syntax elements covered in this topic:

```java
// File: SyntaxDemo.java
package com.example.demo;  // package declaration

import java.util.Scanner;  // import statement

/**
 * Demonstrates core Java syntax elements.
 * Javadoc comment for this class.
 */
public class SyntaxDemo {  // PascalCase class name

    // Constant: UPPER_SNAKE_CASE, final + static
    private static final double TAX_RATE = 0.18;

    /**
     * Entry point of the program.
     *
     * @param args command-line arguments (not used here)
     */
    public static void main(String[] args) {  // main method

        // --- Primitive literals ---
        int quantity = 5;        // integer literal
        double price = 199.99;   // double literal
        char currency = '₹';    // char literal
        boolean onSale = true;   // boolean literal
        String product = "Laptop";  // String literal

        /* Multi-line comment:
         * Calculate total cost including tax.
         */
        double subtotal = quantity * price;
        double tax = subtotal * TAX_RATE;
        double total = subtotal + tax;

        // Block demonstrating scope
        if (onSale) {
            double discount = total * 0.10;  // 'discount' lives only in this block
            total = total - discount;
            System.out.println("Discount applied: " + discount);
        }
        // 'discount' is NOT accessible here

        System.out.println("Product : " + product);
        System.out.println("Quantity: " + quantity);
        System.out.println("Total   : " + currency + total);
    }
}
```

**Output:**

```
Discount applied: 116.9946...
Product : Laptop
Quantity: 5
Total   : ₹1052.95...
```

---

## Try it

1. **Build a syntax-correct skeleton:** Create a file `MyApp.java` with a correct package declaration, one import, a class, and a `main` method that prints your name. Compile and run it.
2. **Scope experiment:** Declare a variable inside an `if` block, then try to print it outside the block. Observe the compile error. Move the declaration outside the block to fix it.
3. **Literals exploration:** Write a program that declares one of each primitive type using their literal syntax (including a binary, hex, and underscore-separated integer). Print all values.
4. **Naming convention practice:** Write a class `StudentRecord` with at least one constant (`MAX_STUDENTS`), two camelCase fields, and a `main` method that uses all of them.
5. **Javadoc:** Add a proper Javadoc comment to a method. Run `javadoc YourFile.java` in the terminal to generate HTML documentation and open it in a browser.
