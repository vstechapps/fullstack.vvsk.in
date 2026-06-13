# Lambda Expressions & Functional Interfaces

Java 8 introduced **lambda expressions** as one of the most significant additions to the language — enabling a concise way to express instances of single-method interfaces (functional interfaces). Before lambdas, anonymous inner classes were the only way to pass behavior as a parameter, resulting in verbose, hard-to-read code. Lambdas make Java more expressive, reduce boilerplate, and open the door to a more functional programming style. Combined with the **Streams API** and the rich set of built-in functional interfaces in `java.util.function`, lambdas transformed how modern Java code is written.

---

## Why Lambdas Were Introduced

Prior to Java 8, passing behavior required creating anonymous classes — even for trivial tasks like sorting a list or filtering elements. This led to ceremony-heavy code that obscured intent. Lambda expressions allow you to treat functionality as a method argument, making the code shorter, more readable, and easier to reason about.

```java
// Before Java 8 — anonymous class
List<String> names = Arrays.asList("Charlie", "Alice", "Bob");
Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});

// With Lambda — Java 8+
Collections.sort(names, (a, b) -> a.compareTo(b));
```

---

## Lambda Syntax

The basic syntax of a lambda expression is:

```
(parameters) -> expression
(parameters) -> { statements; }
```

### Parameter Variations

```java
// No parameters
Runnable r = () -> System.out.println("Hello!");

// Single parameter — parentheses optional
Consumer<String> print = s -> System.out.println(s);

// Multiple parameters
Comparator<Integer> cmp = (a, b) -> a - b;

// Explicit parameter types (optional, usually inferred)
Comparator<Integer> cmpTyped = (Integer a, Integer b) -> a - b;
```

### Body Variations

```java
// Expression body — implicit return, no braces
Function<Integer, Integer> square = x -> x * x;

// Block body — explicit return required
Function<Integer, Integer> squareBlock = x -> {
    int result = x * x;
    return result;
};
```

---

## Functional Interfaces

A **functional interface** is an interface with exactly one abstract method. Lambdas can only be used where a functional interface is expected. The `@FunctionalInterface` annotation makes the contract explicit and causes a compile error if violated.

```java
@FunctionalInterface
public interface Greeting {
    String greet(String name);
    // Adding a second abstract method here would cause a compile error
}

// Using the functional interface
Greeting formal = name -> "Good day, " + name;
Greeting casual = name -> "Hey, " + name + "!";

System.out.println(formal.greet("Alice"));  // Good day, Alice
System.out.println(casual.greet("Bob"));    // Hey, Bob!
```

> **Note:** Functional interfaces may have any number of `default` and `static` methods — only *abstract* methods are counted.

---

## Built-in Functional Interfaces (`java.util.function`)

Java 8 ships a rich library of ready-to-use functional interfaces so you rarely need to define your own.

### `Predicate<T>` — Test a condition

```java
import java.util.function.Predicate;

Predicate<String> isLong   = s -> s.length() > 5;
Predicate<String> startsWithA = s -> s.startsWith("A");

System.out.println(isLong.test("Hello"));      // false
System.out.println(isLong.test("Hello World")); // true

// Composition
Predicate<String> longAndStartsA = isLong.and(startsWithA);
System.out.println(longAndStartsA.test("Alexandros")); // true
System.out.println(longAndStartsA.test("Bob"));        // false
```

### `Function<T, R>` — Transform input to output

```java
import java.util.function.Function;

Function<String, Integer> strLen = String::length;
Function<Integer, String> intToStr = i -> "Value: " + i;

// Compose: strLen runs first, then intToStr
Function<String, String> combined = strLen.andThen(intToStr);
System.out.println(combined.apply("Hello")); // Value: 5

// compose: intToStr runs first (opposite order)
// combined2 would be: intToStr -> strLen
```

### `Consumer<T>` — Accept input, return nothing

```java
import java.util.function.Consumer;

Consumer<String> printer  = s -> System.out.println(s);
Consumer<String> upper    = s -> System.out.println(s.toUpperCase());

// Chain consumers with andThen
Consumer<String> both = printer.andThen(upper);
both.accept("hello"); 
// hello
// HELLO
```

### `Supplier<T>` — Provide a value, take no input

```java
import java.util.function.Supplier;

Supplier<Double> random  = () -> Math.random();
Supplier<String> greeting = () -> "Hello, World!";

System.out.println(random.get());   // e.g. 0.7432...
System.out.println(greeting.get()); // Hello, World!
```

### `BiFunction<T, U, R>` — Two inputs, one output

```java
import java.util.function.BiFunction;

BiFunction<String, Integer, String> repeat = 
    (s, n) -> s.repeat(n);

System.out.println(repeat.apply("ha", 3)); // hahaha
```

### `UnaryOperator<T>` — Function where input and output type are the same

```java
import java.util.function.UnaryOperator;

UnaryOperator<String> shout = s -> s.toUpperCase() + "!";
UnaryOperator<Integer> doubleIt = x -> x * 2;

System.out.println(shout.apply("hello"));  // HELLO!
System.out.println(doubleIt.apply(7));     // 14
```

### Quick Reference Table

| Interface | Abstract Method | Input | Output |
|---|---|---|---|
| `Predicate<T>` | `test(T t)` | T | boolean |
| `Function<T,R>` | `apply(T t)` | T | R |
| `Consumer<T>` | `accept(T t)` | T | void |
| `Supplier<T>` | `get()` | — | T |
| `BiFunction<T,U,R>` | `apply(T t, U u)` | T, U | R |
| `UnaryOperator<T>` | `apply(T t)` | T | T (same type) |
| `BinaryOperator<T>` | `apply(T t1, T t2)` | T, T | T |
| `BiPredicate<T,U>` | `test(T t, U u)` | T, U | boolean |
| `BiConsumer<T,U>` | `accept(T t, U u)` | T, U | void |

---

## Method References

Method references are a shorthand for lambdas that simply call an existing method. They use the `::` operator and come in four forms.

### Static Method Reference

```java
import java.util.function.Function;

// Lambda form
Function<String, Integer> parse1 = s -> Integer.parseInt(s);

// Method reference form
Function<String, Integer> parse2 = Integer::parseInt;

System.out.println(parse2.apply("42")); // 42
```

### Instance Method Reference (on a specific instance)

```java
String prefix = "Hello, ";
Function<String, String> greeter = prefix::concat;
System.out.println(greeter.apply("World")); // Hello, World
```

### Instance Method Reference (on an arbitrary instance of a type)

```java
import java.util.function.Function;

// Equivalent to: s -> s.toUpperCase()
Function<String, String> upper = String::toUpperCase;
System.out.println(upper.apply("java")); // JAVA
```

### Constructor Reference

```java
import java.util.function.Supplier;
import java.util.ArrayList;
import java.util.List;

Supplier<List<String>> listFactory = ArrayList::new;
List<String> list = listFactory.get();
list.add("Lambda");
System.out.println(list); // [Lambda]
```

### Method Reference Summary Table

| Type | Syntax | Lambda Equivalent |
|---|---|---|
| Static method | `ClassName::staticMethod` | `x -> ClassName.staticMethod(x)` |
| Instance (specific) | `instance::method` | `x -> instance.method(x)` |
| Instance (arbitrary) | `ClassName::instanceMethod` | `x -> x.method()` |
| Constructor | `ClassName::new` | `() -> new ClassName()` |

---

## Comparator with Lambda

Lambdas integrate naturally with `Comparator`, which is itself a functional interface.

```java
import java.util.*;

List<String> cities = Arrays.asList("Mumbai", "Delhi", "Chennai", "Agra");

// Sort alphabetically
cities.sort((a, b) -> a.compareTo(b));
System.out.println(cities); // [Agra, Chennai, Delhi, Mumbai]

// Sort by length, then alphabetically
cities.sort(Comparator.comparingInt(String::length)
                      .thenComparing(Comparator.naturalOrder()));
System.out.println(cities); // [Agra, Delhi, Mumbai, Chennai]

// Reverse order
cities.sort(Comparator.reverseOrder());
System.out.println(cities); // [Mumbai, Delhi, Chennai, Agra]
```

---

## Capturing Variables (Effectively Final)

Lambdas can capture variables from their enclosing scope, but those variables must be **effectively final** — meaning their value is never changed after initialization. This rule ensures thread safety and predictable behavior.

```java
String greeting = "Hello";  // effectively final
Runnable r = () -> System.out.println(greeting + ", World!");
r.run(); // Hello, World!

// greeting = "Hi";  // ← uncommenting this causes a compile error
//                      "Variable used in lambda should be effectively final"
```

```java
// Captured instance fields are fine — only local variables are restricted
public class Counter {
    private int count = 0;

    public Runnable createIncrementer() {
        return () -> count++;  // instance field, OK
    }
}
```

---

## Composition

Functional interfaces provide default methods for composing multiple functions or predicates together.

### `Function` Composition

```java
import java.util.function.Function;

Function<Integer, Integer> times2  = x -> x * 2;
Function<Integer, Integer> plus3   = x -> x + 3;

// andThen: apply times2, THEN plus3
Function<Integer, Integer> times2ThenPlus3 = times2.andThen(plus3);
System.out.println(times2ThenPlus3.apply(5)); // (5*2)+3 = 13

// compose: apply plus3 FIRST, then times2
Function<Integer, Integer> plus3ThenTimes2 = times2.compose(plus3);
System.out.println(plus3ThenTimes2.apply(5)); // (5+3)*2 = 16
```

### `Predicate` Composition

```java
import java.util.function.Predicate;

Predicate<Integer> isEven     = n -> n % 2 == 0;
Predicate<Integer> isPositive = n -> n > 0;

Predicate<Integer> isEvenAndPositive = isEven.and(isPositive);
Predicate<Integer> isEvenOrPositive  = isEven.or(isPositive);
Predicate<Integer> isOdd             = isEven.negate();

System.out.println(isEvenAndPositive.test(4));  // true
System.out.println(isEvenAndPositive.test(-4)); // false
System.out.println(isEvenOrPositive.test(3));   // true
System.out.println(isOdd.test(7));              // true
```

### `Consumer` Chaining

```java
import java.util.function.Consumer;

Consumer<String> log  = s -> System.out.println("[LOG] " + s);
Consumer<String> save = s -> System.out.println("[SAVE] " + s);

Consumer<String> logAndSave = log.andThen(save);
logAndSave.accept("UserCreated");
// [LOG] UserCreated
// [SAVE] UserCreated
```

---

## Anonymous Class vs Lambda

| Feature | Anonymous Class | Lambda |
|---|---|---|
| Verbosity | High — full class body required | Minimal — just parameters and body |
| `this` keyword | Refers to the anonymous class instance | Refers to the enclosing class |
| Can have state (fields) | Yes | No |
| Can implement multiple methods | Yes (non-functional interfaces) | No — single abstract method only |
| Serializable | Yes (with effort) | Implementation-dependent |
| Performance | New class file generated | More efficient (invokedynamic) |
| Readability | Obscures intent | Expresses intent clearly |
| Scope of variables | Creates own scope | Shares enclosing scope |
| Java version | All versions | Java 8+ |

```java
// Anonymous class
Runnable anon = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running with anonymous class");
    }
};

// Lambda — same result, far less code
Runnable lambda = () -> System.out.println("Running with lambda");

anon.run();
lambda.run();
```

---

## Key Concepts

- A **lambda expression** is an anonymous function — it has parameters, a body, and a return type, but no name.
- Lambdas work only with **functional interfaces** (exactly one abstract method).
- The `@FunctionalInterface` annotation enforces the contract at compile time.
- `java.util.function` provides `Predicate`, `Function`, `Consumer`, `Supplier`, and many more ready-to-use types.
- **Method references** (`::`) are a cleaner alternative to lambdas that simply delegate to an existing method.
- Captured local variables must be **effectively final** — they cannot be reassigned after capture.
- **Composition** methods (`andThen`, `compose`, `and`, `or`, `negate`) allow building complex behavior from simple pieces.
- Lambdas use `invokedynamic` under the hood, making them more efficient than anonymous classes.

---

## Try it

Practice these exercises to reinforce your understanding of lambdas and functional interfaces:

1. **Basic lambda:** Write a `Predicate<String>` that returns `true` if a string is a valid palindrome (same forwards and backwards).

2. **Function pipeline:** Create two `Function<String, String>` lambdas — one that trims whitespace and one that converts to lowercase — then compose them into a single "normalize" function using `andThen`.

3. **Consumer chain:** Write a `Consumer<List<Integer>>` that first prints the list, then prints its sum, chaining both using `andThen`.

4. **Method reference:** Replace each lambda below with the equivalent method reference:
   ```java
   Function<String, String> f1 = s -> s.trim();
   Function<String, Integer> f2 = s -> Integer.parseInt(s);
   Supplier<StringBuilder> s1  = () -> new StringBuilder();
   ```

5. **Custom functional interface:** Define a `@FunctionalInterface` called `Transformer<T>` with method `T transform(T input)`. Write two implementations — one that reverses a string and one that doubles an integer — and apply them.

6. **Sorting challenge:** Given a `List<String>` of full names like `"John Smith"`, sort them by last name (the word after the space) using a lambda `Comparator`.

7. **Capture effectively final:** Explain why the following code fails to compile and fix it:
   ```java
   int multiplier = 3;
   Function<Integer, Integer> multiply = x -> x * multiplier;
   multiplier = 5;
   System.out.println(multiply.apply(4));
   ```
