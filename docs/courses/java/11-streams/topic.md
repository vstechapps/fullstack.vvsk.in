# Java Stream API

The Stream API, introduced in Java 8, revolutionized the way Java developers process collections of data. A **stream** is a sequence of elements that supports aggregate operations — it is not a data structure and does not store elements. Streams enable you to write **declarative, functional-style code** that is concise, readable, and often parallelizable. Key to understanding streams is the concept of **lazy evaluation**: intermediate operations are not executed until a terminal operation is invoked, and only as many elements are processed as needed. Streams also differ fundamentally from I/O streams (`InputStream`, `OutputStream`) — they are about data transformation pipelines, not file or network I/O.

---

## Streams vs Loops

Before diving in, here's how streams compare to the traditional loop-based approach:

| Feature | Traditional Loop | Stream API |
|---|---|---|
| Style | Imperative (how to do it) | Declarative (what to do) |
| Readability | Verbose for complex logic | Concise, pipeline-style |
| Mutability | Often mutates external state | Immutable / side-effect-free |
| Parallelism | Manual threading | `.parallel()` — one method call |
| Lazy evaluation | No | Yes — only computes what's needed |
| Reusability | Code can be reused | Stream is single-use |
| Null safety | Manual null checks | Works with `Optional` |
| Short-circuit | Manual `break` | Built-in (`findFirst`, `anyMatch`) |

```java
List<String> names = List.of("Alice", "Bob", "Charlie", "Anna", "Brian");

// Traditional loop
List<String> result = new ArrayList<>();
for (String name : names) {
    if (name.startsWith("A")) {
        result.add(name.toUpperCase());
    }
}

// Stream equivalent — more expressive
List<String> streamResult = names.stream()
    .filter(name -> name.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

---

## Creating Streams

Streams can be created from many sources.

```java
import java.util.*;
import java.util.stream.*;

public class StreamCreation {

    public static void main(String[] args) {

        // 1. From a Collection
        List<String> list = List.of("a", "b", "c");
        Stream<String> fromList = list.stream();

        // 2. From a Set
        Set<Integer> set = Set.of(1, 2, 3);
        Stream<Integer> fromSet = set.stream();

        // 3. From an array
        String[] arr = {"x", "y", "z"};
        Stream<String> fromArray = Arrays.stream(arr);

        // 4. Stream.of() — inline values
        Stream<String> inline = Stream.of("Java", "Python", "Go");

        // 5. Stream.generate() — infinite stream with Supplier
        Stream<Double> randoms = Stream.generate(Math::random).limit(5);
        randoms.forEach(System.out::println);

        // 6. Stream.iterate() — infinite stream with seed + function
        Stream<Integer> evens = Stream.iterate(0, n -> n + 2).limit(10);
        evens.forEach(n -> System.out.print(n + " ")); // 0 2 4 6 8 10 12 14 16 18
        System.out.println();

        // 7. Stream.iterate() with predicate (Java 9+)
        Stream<Integer> under100 = Stream.iterate(1, n -> n < 100, n -> n * 2);
        under100.forEach(n -> System.out.print(n + " ")); // 1 2 4 8 16 32 64

        // 8. IntStream / LongStream / DoubleStream — primitive streams
        IntStream range = IntStream.range(1, 6);       // 1, 2, 3, 4, 5
        IntStream closed = IntStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5
        range.forEach(System.out::println);

        // 9. From a String (character stream)
        IntStream chars = "Hello".chars();

        // 10. From Stream.builder()
        Stream<String> built = Stream.<String>builder()
            .add("one").add("two").add("three")
            .build();
    }
}
```

---

## Intermediate Operations

Intermediate operations return a new stream and are **lazy** — they only run when a terminal operation is triggered. Multiple intermediate operations form a **pipeline**.

### `filter` — Keep matching elements

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// [2, 4, 6, 8, 10]
```

### `map` — Transform each element

```java
List<String> words = List.of("hello", "world", "java");

List<String> upper = words.stream()
    .map(String::toUpperCase)        // method reference
    .collect(Collectors.toList());
// [HELLO, WORLD, JAVA]

List<Integer> lengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());
// [5, 5, 4]
```

### `flatMap` — Flatten nested collections

```java
List<List<Integer>> nested = List.of(
    List.of(1, 2, 3),
    List.of(4, 5),
    List.of(6, 7, 8, 9)
);

List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)    // flatten each inner list
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Common use case: split sentences into words
List<String> sentences = List.of("Hello World", "Java Streams");
List<String> allWords = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split(" ")))
    .collect(Collectors.toList());
// [Hello, World, Java, Streams]
```

### `distinct`, `sorted`, `limit`, `skip`

```java
List<Integer> nums = List.of(3, 1, 4, 1, 5, 9, 2, 6, 5, 3);

// distinct — remove duplicates
List<Integer> unique = nums.stream()
    .distinct()
    .collect(Collectors.toList());
// [3, 1, 4, 5, 9, 2, 6]

// sorted — natural order
List<Integer> sorted = nums.stream()
    .distinct()
    .sorted()
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5, 6, 9]

// sorted with Comparator — reverse order
List<Integer> reversed = nums.stream()
    .distinct()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
// [9, 6, 5, 4, 3, 2, 1]

// limit — take first N elements
List<Integer> firstThree = nums.stream()
    .limit(3)
    .collect(Collectors.toList());
// [3, 1, 4]

// skip — skip first N elements
List<Integer> afterThree = nums.stream()
    .skip(3)
    .collect(Collectors.toList());
// [1, 5, 9, 2, 6, 5, 3]
```

### `peek` — Inspect elements without modifying

```java
List<String> result = List.of("apple", "banana", "cherry").stream()
    .peek(s -> System.out.println("Before filter: " + s))
    .filter(s -> s.length() > 5)
    .peek(s -> System.out.println("After filter: " + s))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// Useful for debugging pipelines — don't use peek for side effects in production
```

### Chaining Multiple Intermediate Operations

```java
record Employee(String name, String dept, double salary) {}

List<Employee> employees = List.of(
    new Employee("Alice", "Engineering", 95000),
    new Employee("Bob",   "Marketing",   72000),
    new Employee("Carol", "Engineering", 88000),
    new Employee("Dave",  "Marketing",   65000),
    new Employee("Eve",   "Engineering", 105000)
);

// Find top-2 engineering salaries, formatted
List<String> top2Eng = employees.stream()
    .filter(e -> e.dept().equals("Engineering"))
    .sorted(Comparator.comparingDouble(Employee::salary).reversed())
    .limit(2)
    .map(e -> e.name() + ": $" + e.salary())
    .collect(Collectors.toList());
// [Eve: $105000.0, Alice: $95000.0]
```

---

## Terminal Operations

Terminal operations **trigger the stream pipeline** and produce a result or side effect. After a terminal operation, the stream is consumed and cannot be reused.

### `forEach` and `count`

```java
List<String> fruits = List.of("Mango", "Apple", "Banana");

// forEach — process each element
fruits.stream().forEach(System.out::println);

// count — number of matching elements
long count = fruits.stream()
    .filter(f -> f.length() > 4)
    .count();
// 2 (Mango, Apple, Banana — Mango=5, Apple=5, Banana=6)
```

### `reduce` — Aggregate to a single value

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5);

// Sum using reduce
int sum = nums.stream()
    .reduce(0, Integer::sum);   // identity=0, accumulator=Integer::sum
// 15

// Product
int product = nums.stream()
    .reduce(1, (a, b) -> a * b);
// 120

// Max (returns Optional)
Optional<Integer> max = nums.stream()
    .reduce(Integer::max);
max.ifPresent(m -> System.out.println("Max: " + m));  // Max: 5
```

### `findFirst` and `findAny`

```java
List<String> names = List.of("Alice", "Anna", "Bob", "Charlie");

Optional<String> first = names.stream()
    .filter(n -> n.startsWith("A"))
    .findFirst();
// Optional[Alice]

Optional<String> any = names.parallelStream()
    .filter(n -> n.startsWith("A"))
    .findAny();
// Optional[Alice] or Optional[Anna] — non-deterministic in parallel
```

### `anyMatch`, `allMatch`, `noneMatch`

```java
List<Integer> scores = List.of(72, 85, 91, 60, 78);

boolean anyAbove90   = scores.stream().anyMatch(s -> s > 90);   // true
boolean allPassing   = scores.stream().allMatch(s -> s >= 60);  // true
boolean noneNegative = scores.stream().noneMatch(s -> s < 0);   // true
```

### `min` and `max`

```java
List<String> words = List.of("cat", "elephant", "dog", "ant");

Optional<String> shortest = words.stream()
    .min(Comparator.comparingInt(String::length));
// Optional[ant]

Optional<String> longest = words.stream()
    .max(Comparator.comparingInt(String::length));
// Optional[elephant]
```

### `toList()` (Java 16+)

```java
// Before Java 16:
List<String> list1 = stream.collect(Collectors.toList());

// Java 16+: shorter, returns unmodifiable list
List<String> list2 = stream.toList();
```

---

## Collectors

`Collectors` provides factory methods for common collection operations used with `.collect()`.

```java
import java.util.stream.*;
import java.util.*;

List<String> fruits = List.of("Apple", "Banana", "Cherry", "Avocado", "Blueberry");

// toList / toSet
List<String> asList = fruits.stream().collect(Collectors.toList());
Set<String>  asSet  = fruits.stream().collect(Collectors.toSet());

// toMap — key: first letter, value: fruit name (careful with duplicate keys!)
Map<Character, String> byLetter = fruits.stream()
    .collect(Collectors.toMap(
        f -> f.charAt(0),
        f -> f,
        (existing, newer) -> existing   // merge function for duplicate keys
    ));

// joining — concatenate strings
String csv = fruits.stream().collect(Collectors.joining(", "));
// Apple, Banana, Cherry, Avocado, Blueberry

String wrapped = fruits.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// [Apple, Banana, Cherry, Avocado, Blueberry]

// counting
long count = fruits.stream().collect(Collectors.counting());  // 5

// groupingBy — group into Map<Key, List<Value>>
Map<Character, List<String>> grouped = fruits.stream()
    .collect(Collectors.groupingBy(f -> f.charAt(0)));
// {A=[Apple, Avocado], B=[Banana, Blueberry], C=[Cherry]}

// groupingBy with downstream collector — count per group
Map<Character, Long> countByLetter = fruits.stream()
    .collect(Collectors.groupingBy(
        f -> f.charAt(0),
        Collectors.counting()
    ));
// {A=2, B=2, C=1}

// partitioningBy — split into true/false groups
Map<Boolean, List<String>> partitioned = fruits.stream()
    .collect(Collectors.partitioningBy(f -> f.length() > 5));
// {true=[Banana, Cherry, Avocado, Blueberry], false=[Apple]}

// summarizingInt — stats (count, sum, min, max, average)
List<Integer> nums = List.of(3, 7, 2, 9, 5);
IntSummaryStatistics stats = nums.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));
System.out.println("Count: "   + stats.getCount());   // 5
System.out.println("Sum: "     + stats.getSum());     // 26
System.out.println("Min: "     + stats.getMin());     // 2
System.out.println("Max: "     + stats.getMax());     // 9
System.out.println("Average: " + stats.getAverage()); // 5.2

// averagingInt / summingInt
double avg = nums.stream().collect(Collectors.averagingInt(n -> n));
int total  = nums.stream().collect(Collectors.summingInt(n -> n));
```

---

## Optional Class

`Optional<T>` is a container that may or may not hold a non-null value. It's commonly returned by terminal stream operations and helps avoid `NullPointerException`.

```java
import java.util.Optional;

// Creating Optional
Optional<String> present = Optional.of("Hello");
Optional<String> empty   = Optional.empty();
Optional<String> nullable = Optional.ofNullable(null);   // empty, no NPE

// Checking and getting
System.out.println(present.isPresent());  // true
System.out.println(empty.isEmpty());      // true (Java 11+)

present.ifPresent(v -> System.out.println("Value: " + v));

// orElse / orElseGet
String val1 = empty.orElse("default");                         // "default"
String val2 = empty.orElseGet(() -> "computed-default");       // supplier
String val3 = present.orElseThrow(() ->
    new RuntimeException("No value!"));                        // or throw

// Transforming with map / flatMap / filter
Optional<Integer> length = present
    .filter(s -> s.length() > 3)
    .map(String::length);
// Optional[5]

// Chain with stream
List<String> names = List.of("Alice", null, "Bob");
names.stream()
    .map(Optional::ofNullable)         // wrap each in Optional
    .filter(Optional::isPresent)       // remove empty Optionals
    .map(Optional::get)                // unwrap
    .forEach(System.out::println);     // Alice, Bob
```

---

## Parallel Streams

Parallel streams split work across multiple threads using the **ForkJoinPool**, enabling easy parallelism for CPU-intensive, independent operations.

```java
import java.util.stream.*;

// Sequential
long seqSum = LongStream.rangeClosed(1, 1_000_000)
    .sum();

// Parallel — same result, potentially faster on multi-core
long parSum = LongStream.rangeClosed(1, 1_000_000)
    .parallel()
    .sum();

// Convert existing stream to parallel
List<Integer> bigList = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) bigList.add(i);

long count = bigList.parallelStream()
    .filter(n -> n % 2 == 0)
    .count();

System.out.println("Even numbers: " + count);  // 500000
```

### When to Use Parallel Streams

| ✅ Good fit | ❌ Avoid |
|---|---|
| Large data sets (100K+ elements) | Small collections |
| CPU-bound computation | I/O-bound operations |
| No shared mutable state | Operations with side effects |
| Independent, stateless operations | Order-sensitive results |
| No result ordering requirement | Synchronized/blocking code |

> **Warning:** Parallel streams are not always faster. Thread coordination overhead can make them *slower* for small datasets. Always benchmark before parallelizing.

---

## Numeric Streams — IntStream, LongStream, DoubleStream

Specialized primitive streams avoid boxing/unboxing overhead.

```java
// IntStream — range-based
IntStream.range(1, 6)
    .forEach(n -> System.out.print(n + " "));  // 1 2 3 4 5

// Sum, average, min, max built-in
int sum = IntStream.rangeClosed(1, 100).sum();                   // 5050
OptionalDouble avg = IntStream.of(3, 5, 7, 9).average();         // 6.0
OptionalInt max = IntStream.of(3, 5, 7, 9).max();                // 9

// mapToInt — convert object stream to IntStream
List<String> words = List.of("cat", "elephant", "dog");
int totalLength = words.stream()
    .mapToInt(String::length)
    .sum();
// 3 + 8 + 3 = 14

// boxed() — convert IntStream back to Stream<Integer>
List<Integer> boxed = IntStream.range(1, 6)
    .boxed()
    .collect(Collectors.toList());
```

---

## Key Concepts Summary

- A **stream** is a lazy, single-use pipeline of operations on a data source — not a data structure.
- **Lazy evaluation** means intermediate operations only run when a terminal operation is invoked.
- **Intermediate operations** (`filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`) return streams.
- **Terminal operations** (`collect`, `forEach`, `count`, `reduce`, `findFirst`, `anyMatch`, `min`, `max`, `toList`) trigger execution.
- **`Collectors`** provides `toList()`, `toSet()`, `toMap()`, `groupingBy()`, `joining()`, `counting()`, and `summarizingInt()`.
- **`Optional`** safely represents a possibly-absent value returned by terminal operations.
- **Parallel streams** enable multi-threaded processing with `.parallel()` or `.parallelStream()`.
- **Primitive streams** (`IntStream`, `LongStream`, `DoubleStream`) avoid boxing overhead for numeric processing.
- Streams are **single-use** — once consumed by a terminal operation, they cannot be reused.

---

## Try it

Practice these exercises to master the Stream API:

1. **Word Frequency** — Given a `List<String>` of words, use `Collectors.groupingBy` with `Collectors.counting()` to build a `Map<String, Long>` of word frequencies. Sort by frequency descending and print the top 5.

2. **Employee Report** — Using the `Employee` record (name, dept, salary), use streams to: (a) find average salary per department using `groupingBy` + `averagingDouble`, (b) find the highest-paid employee overall using `max`.

3. **FlatMap Practice** — Given a list of sentences, use `flatMap` to get a stream of individual words, then collect distinct words that are longer than 4 characters into a sorted `List<String>`.

4. **Optional Chain** — Write a method `String getUpperCaseIfLong(Optional<String> opt, int minLength)` that returns the uppercased value if present and longer than `minLength`, or `"N/A"` otherwise — using only `Optional` methods (no `isPresent()` + `get()`).

5. **Number Statistics** — Given a `List<Integer>`, compute min, max, sum, count, and average using a single `collect(Collectors.summarizingInt(...))` call. Then repeat using `IntStream` directly.

6. **Parallel Stream Benchmark** — Create a list of 1 million random integers. Time a sequential stream `filter + map + collect` operation vs a parallel stream version using `System.nanoTime()`. Compare results and discuss when parallel is faster.

7. **Custom Collector** — Use `Collectors.toUnmodifiableList()` and `Collectors.toUnmodifiableMap()` to collect results that cannot be mutated after collection. Try adding an element afterward and observe the exception.
