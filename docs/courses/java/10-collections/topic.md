# Collections Framework in Java

The Java Collections Framework (JCF) is a unified architecture of interfaces, implementations, and algorithms for storing and manipulating groups of objects. Introduced in Java 2, it provides ready-made, high-performance data structures that eliminate the need to write your own. Whether you need fast random access, insertion-order guarantees, unique elements, key-value mappings, or priority-based ordering, the JCF has a class for it. Mastering the Collections Framework is indispensable for writing efficient, readable Java programs.

---

## Collections Hierarchy

The framework is organized into two parallel trees — the `Collection` hierarchy (for single elements) and the `Map` hierarchy (for key-value pairs).

```
java.lang.Iterable
└── java.util.Collection
    ├── java.util.List          (ordered, duplicates allowed)
    │   ├── ArrayList
    │   ├── LinkedList
    │   └── Vector (legacy)
    │       └── Stack (legacy)
    ├── java.util.Set           (unique elements)
    │   ├── HashSet
    │   ├── LinkedHashSet
    │   └── TreeSet
    └── java.util.Queue         (FIFO / priority ordering)
        ├── LinkedList
        ├── PriorityQueue
        └── java.util.Deque     (double-ended queue)
            ├── ArrayDeque
            └── LinkedList

java.util.Map                   (key → value mapping, separate hierarchy)
    ├── HashMap
    ├── LinkedHashMap
    ├── TreeMap
    └── Hashtable (legacy)
```

---

## Generics with Collections

All modern Java collection classes are **generic** — they are parameterized by element type, providing compile-time type safety and eliminating the need for explicit casts.

```java
import java.util.*;

// Without generics (legacy — avoid)
List rawList = new ArrayList();
rawList.add("Hello");
rawList.add(42);
String s = (String) rawList.get(0);   // explicit cast, runtime risk ❌

// With generics (modern — always use)
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
// names.add(42);   // ❌ compile error — type safety enforced
String name = names.get(0);           // no cast needed ✅

// Bounded type parameters in utility methods
public static <T extends Comparable<T>> T findMax(List<T> list) {
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) max = item;
    }
    return max;
}
```

---

## List — Ordered, Index-Based, Allows Duplicates

A `List` maintains insertion order, allows duplicate elements, and provides index-based access.

### ArrayList vs LinkedList

| Feature | `ArrayList` | `LinkedList` |
|---|---|---|
| Internal structure | Dynamic array | Doubly-linked list |
| Random access `get(i)` | O(1) — very fast | O(n) — traversal needed |
| Insert/delete at end | O(1) amortized | O(1) |
| Insert/delete at middle | O(n) — shift elements | O(1) (after finding node) |
| Memory overhead | Low (contiguous memory) | Higher (node pointers) |
| Implements `Deque`? | No | Yes |
| Best for | Read-heavy, random access | Frequent insertions/deletions |

```java
import java.util.*;

public class ListDemo {

    public static void main(String[] args) {
        // === ArrayList ===
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        fruits.add("Apple");           // duplicates allowed
        fruits.add(1, "Blueberry");   // insert at index

        System.out.println(fruits);           // [Apple, Blueberry, Banana, Cherry, Apple]
        System.out.println(fruits.get(2));    // Banana
        System.out.println(fruits.size());    // 5
        System.out.println(fruits.contains("Cherry")); // true
        fruits.remove("Apple");               // removes FIRST occurrence
        fruits.remove(0);                     // removes by index

        // Iterate with forEach and lambda
        fruits.forEach(f -> System.out.println("🍎 " + f));

        // Sublist
        List<String> sub = fruits.subList(0, 2);

        // Sort
        Collections.sort(fruits);
        System.out.println("Sorted: " + fruits);

        // === LinkedList ===
        LinkedList<Integer> queue = new LinkedList<>();
        queue.addFirst(1);
        queue.addLast(2);
        queue.addLast(3);
        System.out.println("First: " + queue.peekFirst());
        System.out.println("Last: " + queue.peekLast());
        queue.removeFirst();
        System.out.println(queue);   // [2, 3]
    }
}
```

---

## Set — Unique Elements

A `Set` guarantees that no duplicate elements are stored. The three main implementations differ in ordering.

| Feature | `HashSet` | `LinkedHashSet` | `TreeSet` |
|---|---|---|---|
| Ordering | No guaranteed order | Insertion order | Sorted (natural or Comparator) |
| `null` allowed | One `null` | One `null` | No `null` (throws NPE) |
| Performance | O(1) add/remove/contains | O(1) slightly slower | O(log n) |
| Underlying structure | Hash table | Hash table + linked list | Red-Black tree |
| Use when | Order doesn't matter | Need insertion order | Need sorted iteration |

```java
import java.util.*;

public class SetDemo {

    public static void main(String[] args) {
        // === HashSet — no order ===
        Set<String> colors = new HashSet<>();
        colors.add("Red");
        colors.add("Green");
        colors.add("Blue");
        colors.add("Red");   // duplicate — ignored
        System.out.println("HashSet: " + colors);   // order not guaranteed

        // === LinkedHashSet — insertion order ===
        Set<String> ordered = new LinkedHashSet<>();
        ordered.add("Banana");
        ordered.add("Apple");
        ordered.add("Cherry");
        ordered.add("Apple");   // duplicate — ignored
        System.out.println("LinkedHashSet: " + ordered);   // [Banana, Apple, Cherry]

        // === TreeSet — sorted order ===
        Set<Integer> numbers = new TreeSet<>();
        numbers.add(50);
        numbers.add(10);
        numbers.add(30);
        numbers.add(20);
        System.out.println("TreeSet: " + numbers);   // [10, 20, 30, 50]

        // TreeSet with custom Comparator (reverse order)
        Set<String> reverseSet = new TreeSet<>(Comparator.reverseOrder());
        reverseSet.addAll(List.of("Mango", "Apple", "Grape"));
        System.out.println("Reverse TreeSet: " + reverseSet);   // [Mango, Grape, Apple]

        // Set operations
        Set<Integer> setA = new HashSet<>(Set.of(1, 2, 3, 4));
        Set<Integer> setB = new HashSet<>(Set.of(3, 4, 5, 6));

        // Intersection
        Set<Integer> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        System.out.println("Intersection: " + intersection);   // [3, 4]

        // Union
        Set<Integer> union = new HashSet<>(setA);
        union.addAll(setB);
        System.out.println("Union: " + union);   // [1, 2, 3, 4, 5, 6]
    }
}
```

---

## Map — Key-Value Pairs

A `Map` stores key-value pairs where each key is unique. Maps are not part of the `Collection` hierarchy but are central to the framework.

| Feature | `HashMap` | `LinkedHashMap` | `TreeMap` | `Hashtable` |
|---|---|---|---|---|
| Ordering | No guaranteed order | Insertion order | Sorted by key | No guaranteed order |
| `null` keys | One `null` key allowed | One `null` key allowed | No `null` keys | No `null` keys |
| `null` values | Allowed | Allowed | Allowed | Not allowed |
| Thread-safe | No | No | No | Yes (synchronized) |
| Performance | O(1) avg | O(1) avg, slightly slower | O(log n) | O(1) but slow (synchronized) |
| Use when | Best general-purpose map | Need insertion order | Need sorted keys | Legacy code only |

```java
import java.util.*;

public class MapDemo {

    public static void main(String[] args) {
        // === HashMap ===
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 92);
        scores.put("Bob", 85);
        scores.put("Charlie", 78);
        scores.put("Alice", 95);   // updates existing key

        System.out.println("Alice's score: " + scores.get("Alice"));  // 95
        System.out.println("Has Bob: " + scores.containsKey("Bob"));  // true
        System.out.println("Size: " + scores.size());                  // 3

        scores.putIfAbsent("Dave", 88);   // only adds if key absent
        scores.remove("Bob");

        // Iterate over entries
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " → " + entry.getValue());
        }

        // getOrDefault — safe retrieval
        int eve = scores.getOrDefault("Eve", 0);   // 0 — Eve not present

        // computeIfAbsent — compute value on first access
        Map<String, List<String>> groups = new HashMap<>();
        groups.computeIfAbsent("Math", k -> new ArrayList<>()).add("Alice");
        groups.computeIfAbsent("Math", k -> new ArrayList<>()).add("Bob");
        System.out.println(groups);  // {Math=[Alice, Bob]}

        // === LinkedHashMap — insertion order ===
        Map<String, String> capitals = new LinkedHashMap<>();
        capitals.put("India", "New Delhi");
        capitals.put("France", "Paris");
        capitals.put("Japan", "Tokyo");
        System.out.println("Capitals: " + capitals);  // insertion order preserved

        // === TreeMap — sorted by key ===
        Map<String, Integer> wordCount = new TreeMap<>();
        wordCount.put("zebra", 3);
        wordCount.put("apple", 7);
        wordCount.put("mango", 1);
        System.out.println("TreeMap: " + wordCount);  // alphabetical: {apple=7, mango=1, zebra=3}
        System.out.println("First key: " + ((TreeMap<String,Integer>) wordCount).firstKey());
    }
}
```

---

## Common Collection Operations

```java
import java.util.*;

public class CommonOperations {

    public static void main(String[] args) {
        List<String> list = new ArrayList<>(Arrays.asList("C", "A", "B", "A"));

        // Size and emptiness
        System.out.println(list.size());       // 4
        System.out.println(list.isEmpty());    // false

        // Contains
        System.out.println(list.contains("A"));   // true

        // Remove
        list.remove("A");        // removes first occurrence
        list.remove(0);          // removes by index (now "B")

        // Add all / Remove all
        list.addAll(List.of("D", "E"));
        list.removeAll(List.of("D", "E"));

        // Clear
        list.clear();
        System.out.println(list.isEmpty());   // true

        // Iterator
        List<String> items = new ArrayList<>(List.of("One", "Two", "Three"));
        Iterator<String> it = items.iterator();
        while (it.hasNext()) {
            String item = it.next();
            if (item.equals("Two")) it.remove();  // safe removal during iteration
        }
        System.out.println(items);   // [One, Three]

        // forEach with lambda
        items.forEach(System.out::println);

        // Convert array to List and back
        String[] arr = {"X", "Y", "Z"};
        List<String> fromArray = new ArrayList<>(Arrays.asList(arr));
        String[] backToArray = fromArray.toArray(new String[0]);
    }
}
```

---

## Collections Utility Class

`java.util.Collections` provides static utility methods for sorting, searching, and manipulating collections.

```java
import java.util.*;

public class CollectionsUtilDemo {

    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 3, 8, 1, 9, 2));

        // Sort
        Collections.sort(nums);
        System.out.println("Sorted: " + nums);   // [1, 2, 3, 5, 8, 9]

        // Sort with Comparator (reverse)
        Collections.sort(nums, Comparator.reverseOrder());
        System.out.println("Reverse: " + nums);  // [9, 8, 5, 3, 2, 1]

        // Shuffle
        Collections.shuffle(nums);
        System.out.println("Shuffled: " + nums);

        // Min / Max
        System.out.println("Min: " + Collections.min(nums));
        System.out.println("Max: " + Collections.max(nums));

        // Binary search (list must be sorted first)
        Collections.sort(nums);
        int idx = Collections.binarySearch(nums, 5);
        System.out.println("Index of 5: " + idx);

        // Frequency
        List<String> words = List.of("apple", "banana", "apple", "cherry");
        System.out.println("apple count: " + Collections.frequency(words, "apple")); // 2

        // Unmodifiable view
        List<String> immutable = Collections.unmodifiableList(new ArrayList<>(words));
        // immutable.add("grape");   // ❌ UnsupportedOperationException

        // Reverse
        List<Integer> rev = new ArrayList<>(List.of(1, 2, 3, 4, 5));
        Collections.reverse(rev);
        System.out.println("Reversed: " + rev);  // [5, 4, 3, 2, 1]

        // Fill
        Collections.fill(rev, 0);
        System.out.println("Filled: " + rev);    // [0, 0, 0, 0, 0]

        // nCopies
        List<String> copies = Collections.nCopies(3, "Java");
        System.out.println(copies);   // [Java, Java, Java]
    }
}
```

---

## Queue and Deque

### Queue — FIFO (First In, First Out)

```java
import java.util.*;

public class QueueDemo {

    public static void main(String[] args) {
        // LinkedList as Queue
        Queue<String> queue = new LinkedList<>();
        queue.offer("First");    // enqueue (prefer over add — no exception on failure)
        queue.offer("Second");
        queue.offer("Third");

        System.out.println("Peek: " + queue.peek());     // First — doesn't remove
        System.out.println("Poll: " + queue.poll());     // First — removes
        System.out.println("Queue: " + queue);           // [Second, Third]

        // PriorityQueue — elements dequeued by natural order (min-heap by default)
        Queue<Integer> pq = new PriorityQueue<>();
        pq.offer(30);
        pq.offer(10);
        pq.offer(20);
        while (!pq.isEmpty()) {
            System.out.print(pq.poll() + " ");   // 10 20 30 — always smallest first
        }

        // PriorityQueue with Comparator (max-heap)
        Queue<Integer> maxPQ = new PriorityQueue<>(Comparator.reverseOrder());
        maxPQ.offer(30);
        maxPQ.offer(10);
        maxPQ.offer(20);
        System.out.println("\nMax: " + maxPQ.poll());   // 30
    }
}
```

### Deque — Double-Ended Queue

```java
import java.util.*;

public class DequeDemo {

    public static void main(String[] args) {
        // ArrayDeque — faster than LinkedList for stack/queue operations
        Deque<String> deque = new ArrayDeque<>();

        // Use as Queue (FIFO)
        deque.offerLast("A");
        deque.offerLast("B");
        deque.offerLast("C");
        System.out.println("Queue poll: " + deque.pollFirst());  // A

        // Use as Stack (LIFO)
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1);   // addFirst
        stack.push(2);
        stack.push(3);
        System.out.println("Stack pop: " + stack.pop());   // 3 (LIFO)
        System.out.println("Stack peek: " + stack.peek()); // 2

        // Use both ends
        deque.offerFirst("Z");   // add to front
        deque.offerLast("D");    // add to back
        System.out.println("First: " + deque.peekFirst());  // Z
        System.out.println("Last: "  + deque.peekLast());   // D
    }
}
```

---

## Key Concepts Summary

- **Collection hierarchy**: `Iterable → Collection → List / Set / Queue`; `Map` is separate.
- **ArrayList** is best for random access; **LinkedList** is best for frequent insertion/deletion.
- **HashSet** is fastest for uniqueness; **LinkedHashSet** preserves insertion order; **TreeSet** sorts.
- **HashMap** is the general-purpose map; **TreeMap** maintains key sort order; **LinkedHashMap** preserves insertion order. Avoid **Hashtable** (legacy).
- **Generics** provide compile-time type safety — always parameterize your collections.
- **Collections utility class** provides `sort`, `shuffle`, `min`, `max`, `binarySearch`, `reverse`, and more.
- **Queue** is FIFO; **PriorityQueue** dequeues by priority; **ArrayDeque** is the preferred stack/deque implementation.
- Use `Iterator.remove()` for safe removal during iteration; never mutate a list with a for-each loop.

---

## Try it

Practice exercises to master the Collections Framework:

1. **Frequency Counter** — Given a `String`, count the frequency of each character using a `HashMap<Character, Integer>`. Print the results in alphabetical order using a `TreeMap`.

2. **Unique Words** — Read a sentence, split it into words, and store unique words in a `LinkedHashSet` (preserving first-occurrence order). Print the set and its size.

3. **Student Grade Book** — Use a `Map<String, List<Integer>>` to map student names to lists of grades. Compute the average grade per student. Sort students alphabetically by name when printing.

4. **Task Scheduler** — Implement a simple task queue using `ArrayDeque`. Tasks have a name and priority (int). Use a `PriorityQueue<Task>` (with a Comparator) to always process the highest-priority task first.

5. **Set Operations** — Given two `HashSet<Integer>` objects A and B, compute and print their union, intersection, and difference (A minus B) without modifying the originals.

6. **Collections Sort Challenge** — Create a `List<Person>` where `Person` has `name` and `age`. Sort the list first by age ascending, then by name alphabetically (use `Comparator.comparingInt().thenComparing()`). Use `Collections.sort` and also try the `List.sort()` method.
