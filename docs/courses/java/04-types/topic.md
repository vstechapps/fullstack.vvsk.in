# Data Types & Variables in Java

Java is a **statically typed** language, which means every variable must have a declared type that is fixed at compile time. This gives Java its predictability, safety, and performance advantages over dynamically typed languages. This topic covers the two fundamental categories of types — primitives and references — along with variable declaration, type conversion, autoboxing, the `var` keyword, constants, and the special nature of `String`.

---

## The Two Type Categories

```
Java Types
├── Primitive Types (8 built-in, value stored directly in memory)
│    ├── Integer family:   byte, short, int, long
│    ├── Floating-point:   float, double
│    ├── Character:        char
│    └── Boolean:          boolean
└── Reference Types (variable holds a memory address / reference)
     ├── String
     ├── Arrays
     ├── Classes (user-defined and library)
     └── Interfaces, Enums, Records, etc.
```

---

## Primitive Types

Java has exactly **8 primitive types**. They are not objects — they hold raw values directly in stack memory, which makes them fast and memory-efficient.

| Type | Size | Default | Min Value | Max Value | Example Literal |
|------|------|---------|-----------|-----------|-----------------|
| `byte` | 8 bits (1 byte) | `0` | −128 | 127 | `byte b = 100;` |
| `short` | 16 bits (2 bytes) | `0` | −32,768 | 32,767 | `short s = 30000;` |
| `int` | 32 bits (4 bytes) | `0` | −2,147,483,648 | 2,147,483,647 | `int i = 42;` |
| `long` | 64 bits (8 bytes) | `0L` | −9.2 × 10¹⁸ | 9.2 × 10¹⁸ | `long l = 9876543210L;` |
| `float` | 32 bits (4 bytes) | `0.0f` | ~1.4 × 10⁻⁴⁵ | ~3.4 × 10³⁸ | `float f = 3.14f;` |
| `double` | 64 bits (8 bytes) | `0.0d` | ~5.0 × 10⁻³²⁴ | ~1.8 × 10³⁰⁸ | `double d = 3.14;` |
| `char` | 16 bits (2 bytes) | `'\u0000'` | `'\u0000'` (0) | `'\uFFFF'` (65535) | `char c = 'A';` |
| `boolean` | JVM-dependent (~1 bit) | `false` | — | — | `boolean flag = true;` |

> **Key rule:** `int` is the default integer type; `double` is the default floating-point type. Use `L` for `long` literals and `f` for `float` literals.

```java
public class PrimitiveDemo {
    public static void main(String[] args) {
        byte  population = 127;
        short year       = 2024;
        int   distance   = 384_400;          // km to moon, underscore for readability
        long  fileSize   = 9_000_000_000L;   // 9 GB in bytes — needs L suffix
        float pi         = 3.14159f;          // needs f suffix
        double precise   = 3.141592653589793; // more precision than float
        char  grade      = 'A';
        boolean passing  = true;

        System.out.println("Year: " + year);
        System.out.println("Distance to Moon: " + distance + " km");
        System.out.println("Grade: " + grade + " | Passing: " + passing);
    }
}
```

### Integer Overflow

When a value exceeds a type's range, it **wraps around** (no runtime error):

```java
byte b = 127;
b++;           // wraps to -128!
System.out.println(b); // -128
```

---

## Reference Types

Reference types store a **memory address** (reference) in the variable, which points to an object in **heap memory**.

### String

```java
String name = "Alice";               // String literal — stored in the String pool
String greeting = new String("Hi!"); // explicit object on heap (rarely used)
```

### Arrays

```java
int[] scores = {95, 87, 76, 100};   // array of 4 ints
String[] days = new String[7];       // array of 7 Strings (all null initially)
days[0] = "Monday";
```

### Objects

```java
// Using the Scanner class from java.util
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);  // scanner is a reference to a Scanner object
```

---

## Variable Declaration and Initialization

### Declaration

Declares a variable — reserves storage and associates a name and type:

```java
int age;          // declared but NOT yet initialized
String city;
```

### Initialization

Assigns the first value to a variable:

```java
age = 25;
city = "Hyderabad";
```

### Declaration + Initialization (most common)

```java
int age = 25;
String city = "Hyderabad";
double salary = 75_000.50;
```

### Multiple Declarations

```java
int x = 1, y = 2, z = 3;  // legal, but avoid for clarity
```

### Default Values

Instance fields (in a class) get defaults. Local variables (in methods) do **not** — you must initialize them before use.

```java
public class DefaultValues {
    int count;        // default: 0
    double rate;      // default: 0.0
    boolean active;   // default: false
    String name;      // default: null

    public void show() {
        // int local; System.out.println(local); // COMPILE ERROR: not initialized
        System.out.println(count + " " + rate + " " + active + " " + name);
    }
}
```

---

## Type Casting

### Widening Conversion (Implicit)

Automatically done by the compiler when converting to a larger type — **no data loss**:

```
byte → short → int → long → float → double
```

```java
int i = 100;
long l = i;         // automatic widening
double d = l;       // automatic widening
float f = i;        // automatic widening

System.out.println(d); // 100.0
```

### Narrowing Conversion (Explicit Cast)

Must be done manually — **possible data loss**, so you must explicitly tell the compiler you accept the risk:

```java
double d = 9.99;
int i = (int) d;       // explicit cast — truncates decimal part
System.out.println(i); // 9 (NOT rounded — truncated)

long bigNum = 1_234_567_890_123L;
int truncated = (int) bigNum;  // data loss! only lower 32 bits kept
System.out.println(truncated); // some unexpected value

double price = 19.99;
int intPrice = (int) price;    // 19 (not 20)
```

### String Conversions

```java
// Primitive → String
int num = 42;
String s1 = String.valueOf(num);  // "42"
String s2 = Integer.toString(num); // "42"
String s3 = "" + num;              // "42" (string concatenation trick)

// String → Primitive
String input = "123";
int parsed = Integer.parseInt(input);       // 123
double parsedD = Double.parseDouble("3.14"); // 3.14
boolean parsedB = Boolean.parseBoolean("true"); // true
```

---

## Autoboxing and Unboxing

Java has **wrapper classes** — object equivalents for each primitive type — that allow primitives to be used where objects are required (e.g., in collections).

| Primitive | Wrapper Class |
|-----------|---------------|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

### Autoboxing — primitive → wrapper (automatic)

```java
int primitiveInt = 42;
Integer boxedInt = primitiveInt;   // autoboxing — compiler wraps it automatically

// Equivalent to:
Integer boxedInt2 = Integer.valueOf(42);
```

### Unboxing — wrapper → primitive (automatic)

```java
Integer boxed = Integer.valueOf(100);
int primitive = boxed;   // unboxing — compiler extracts the value automatically

// Equivalent to:
int primitive2 = boxed.intValue();
```

### Practical Example with Collections

```java
import java.util.ArrayList;
import java.util.List;

List<Integer> numbers = new ArrayList<>();  // only accepts objects, not primitives
numbers.add(10);  // autoboxing: int 10 → Integer(10)
numbers.add(20);
numbers.add(30);

int sum = 0;
for (int n : numbers) {  // unboxing: Integer → int on each iteration
    sum += n;
}
System.out.println("Sum: " + sum); // 60
```

### Wrapper Class Utility Methods

```java
int max = Integer.MAX_VALUE;       // 2147483647
int min = Integer.MIN_VALUE;       // -2147483648
int parsed = Integer.parseInt("255");
String binary = Integer.toBinaryString(42);  // "101010"
String hex = Integer.toHexString(255);       // "ff"
```

---

## The `var` Keyword (Java 10+)

`var` enables **local variable type inference** — the compiler infers the type from the right-hand side. The type is still fixed at compile time; this is **not** dynamic typing.

```java
var message = "Hello";          // inferred as String
var count = 42;                 // inferred as int
var price = 19.99;              // inferred as double
var items = new ArrayList<>();  // inferred as ArrayList

// Still statically typed — this would be a compile error:
var x = 5;
// x = "hello"; // ERROR: incompatible types: String cannot be converted to int
```

### `var` Rules and Limitations

```java
// ✅ Allowed: local variables with initializer
var name = "Alice";

// ✅ Allowed: in for loops
for (var i = 0; i < 10; i++) { /* ... */ }

// ✅ Allowed: enhanced for loop
var list = List.of(1, 2, 3);
for (var item : list) { /* ... */ }

// ❌ Not allowed: class fields
// var fieldName = 10;  // compile error

// ❌ Not allowed: method parameters
// public void process(var input) {}  // compile error

// ❌ Not allowed: without initializer
// var x;  // compile error — no type to infer from
```

| | `var` | Explicit type |
|--|-------|--------------|
| Type safety | ✅ Same (compile-time) | ✅ Same |
| Readability | ✅ Less boilerplate | ✅ More explicit |
| Where usable | Local variables only | Anywhere |
| IDE support | ✅ Full | ✅ Full |

---

## Final Variables and Constants

The `final` keyword makes a variable **immutable** — its value cannot be changed after assignment.

```java
final int MAX_SIZE = 100;
// MAX_SIZE = 200; // COMPILE ERROR: cannot assign a value to final variable

final double PI = 3.141592653589793;
```

### Class-Level Constants

By convention, constants are `static final` and use `UPPER_SNAKE_CASE`:

```java
public class MathConstants {
    public static final double PI      = 3.141592653589793;
    public static final double E       = 2.718281828459045;
    public static final int    MAX_INT = Integer.MAX_VALUE;
}
```

Accessing them:

```java
double area = MathConstants.PI * radius * radius;
```

---

## String Immutability and the String Pool

`String` in Java is **immutable** — once created, its content cannot be changed. Any operation that appears to modify a String actually creates a **new String object**.

```java
String s = "Hello";
s = s + " World";  // creates a new String — "Hello" still exists in memory
System.out.println(s); // "Hello World"
```

### The String Pool

String literals are stored in a special area of heap memory called the **String pool** (also called String intern pool). When you create a string literal, Java first checks if an identical string already exists in the pool.

```java
String a = "Java";   // added to the pool
String b = "Java";   // reuses the same object from the pool
String c = new String("Java"); // forces a new heap object — bypasses pool

System.out.println(a == b);       // true  (same reference from pool)
System.out.println(a == c);       // false (c is a different heap object)
System.out.println(a.equals(c));  // true  (same content)
```

> **Rule:** Always use `.equals()` to compare String content. Use `==` only to compare if two references point to the same object.

### String is Immutable — Performance Tip

For many concatenations in a loop, use `StringBuilder` instead:

```java
// Slow: creates a new String object on every iteration
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;  // inefficient!
}

// Fast: StringBuilder mutates in place
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result2 = sb.toString(); // convert once at the end
```

---

## The `null` Reference

`null` is a special literal that means "this reference variable points to no object."

```java
String name = null;         // name does not point to any String object
System.out.println(name);   // prints "null" (special handling in println)

// name.length();           // NullPointerException at runtime!

// Safe null check:
if (name != null) {
    System.out.println(name.length());
}

// Java 14+ helpful NullPointerException messages tell you which variable was null
```

- Only **reference types** can be `null`. Primitives cannot be `null`.
- Attempting to call a method on a `null` reference throws `NullPointerException` (NPE).

---

## Quick Reference — Choosing a Type

| Situation | Use |
|-----------|-----|
| Whole numbers (general) | `int` |
| Very large whole numbers | `long` |
| Decimal numbers (general) | `double` |
| Memory-critical decimals | `float` |
| True/false logic | `boolean` |
| Single character | `char` |
| Text | `String` |
| Type not needing repetition | `var` (local only) |
| Immutable value / constant | `final` modifier |

---

## Try it

1. **Overflow exploration:** Declare a `byte` with value `127`. Increment it in a loop 5 times, printing the value each time. Observe the wraparound behavior.
2. **Casting practice:** Declare a `double` with value `9.7`. Cast it to `int` and print both. Then declare a `long` value larger than `Integer.MAX_VALUE`, cast it to `int`, and print the result to see data loss.
3. **Autoboxing in action:** Create an `ArrayList<Double>` (import `java.util.ArrayList`). Add five `double` values to it using `list.add(...)`. Then use an enhanced for loop with `double d : list` to sum them. Notice autoboxing/unboxing happening silently.
4. **String pool demonstration:** Create two String variables using literals with the same text, and one using `new String(...)`. Use `==` and `.equals()` to compare all three pairs. Print the results and explain why they differ.
5. **var exploration:** Rewrite a small program that uses `int`, `double`, `String`, and `ArrayList` — replacing all local variable type declarations with `var`. Verify it still compiles and runs correctly.
6. **StringBuilder benchmark:** Write a loop that concatenates numbers from 1 to 10,000 using `String +=` and then the same with `StringBuilder`. Use `System.currentTimeMillis()` to measure and compare the time taken.
