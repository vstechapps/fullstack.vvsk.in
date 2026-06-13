# Control Flow in Java

Programs rarely execute line by line from top to bottom. Control flow constructs let you make decisions, repeat actions, and skip code based on conditions. Java provides a rich set of control flow statements — conditionals, switches, multiple loop styles, and jump statements — all of which are covered in depth here.

---

## Comparison and Logical Operators

Before diving into control flow, you need the operators that form conditions.

### Comparison Operators

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `true` |
| `!=` | Not equal to | `5 != 3` | `true` |
| `<` | Less than | `3 < 5` | `true` |
| `>` | Greater than | `5 > 3` | `true` |
| `<=` | Less than or equal | `5 <= 5` | `true` |
| `>=` | Greater than or equal | `4 >= 5` | `false` |

> **Never use `==` to compare `String` content.** Use `.equals()` instead. `==` compares references, not values.

### Logical Operators

| Operator | Name | Meaning | Example |
|----------|------|---------|---------|
| `&&` | Logical AND | Both must be true | `age > 18 && hasID` |
| `\|\|` | Logical OR | At least one must be true | `isAdmin \|\| isOwner` |
| `!` | Logical NOT | Negates the boolean | `!isEmpty` |

### Short-Circuit Evaluation

Java evaluates `&&` and `||` lazily — it stops as soon as the result is determined:

```java
int x = 0;

// Short-circuit AND: if left side is false, right side is NEVER evaluated
if (x != 0 && (10 / x > 2)) {  // safe — division never happens when x == 0
    System.out.println("OK");
}

// Short-circuit OR: if left side is true, right side is NEVER evaluated
String name = null;
if (name == null || name.isEmpty()) {  // safe — .isEmpty() not called when name == null
    System.out.println("Name not provided");
}
```

This is a critical safety technique: always put the cheap/safe check on the left side of `&&` and `||`.

---

## Ternary Operator

The ternary operator `? :` is a compact inline conditional that evaluates to one of two values:

```java
// Syntax: condition ? valueIfTrue : valueIfFalse
int age = 20;
String category = (age >= 18) ? "Adult" : "Minor";
System.out.println(category); // "Adult"

int a = 10, b = 25;
int max = (a > b) ? a : b;
System.out.println("Max: " + max); // "Max: 25"

// Nested ternary (use sparingly — can hurt readability)
int score = 75;
String grade = (score >= 90) ? "A" : (score >= 70) ? "B" : "C";
System.out.println(grade); // "B"
```

---

## if / else if / else

The fundamental conditional construct. Only the first matching branch executes.

```java
int temperature = 28;

if (temperature > 35) {
    System.out.println("It's very hot — stay hydrated!");
} else if (temperature > 25) {
    System.out.println("It's warm — nice weather.");
} else if (temperature > 15) {
    System.out.println("It's mild — carry a jacket.");
} else {
    System.out.println("It's cold — bundle up!");
}
// Output: "It's warm — nice weather."
```

### Single-Statement Branches (no braces)

Braces are optional when the branch contains exactly one statement, but **always using braces is strongly recommended**:

```java
// Legal but error-prone:
if (x > 0)
    System.out.println("Positive");

// Recommended — always use braces:
if (x > 0) {
    System.out.println("Positive");
}
```

### Nested if-else

```java
int marks = 85;
boolean attended = true;

if (attended) {
    if (marks >= 90) {
        System.out.println("Grade: A");
    } else if (marks >= 75) {
        System.out.println("Grade: B");
    } else {
        System.out.println("Grade: C");
    }
} else {
    System.out.println("Not eligible — absent");
}
```

---

## switch Statement (Traditional)

The traditional `switch` matches a single expression against multiple `case` values. Note the **fall-through behavior** — execution continues into the next case unless explicitly stopped with `break`.

```java
int day = 3;
String dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    case 7:
        dayName = "Sunday";
        break;
    default:
        dayName = "Invalid day";
}
System.out.println(dayName); // "Wednesday"
```

### Intentional Fall-Through

```java
int month = 4; // April
int daysInMonth;

switch (month) {
    case 1: case 3: case 5: case 7:
    case 8: case 10: case 12:
        daysInMonth = 31;
        break;
    case 4: case 6: case 9: case 11:
        daysInMonth = 30;
        break;
    case 2:
        daysInMonth = 28; // ignoring leap year for simplicity
        break;
    default:
        daysInMonth = -1;
}
System.out.println("Days in month " + month + ": " + daysInMonth); // 30
```

Traditional `switch` works with: `byte`, `short`, `int`, `char`, `String` (Java 7+), and enum types.

---

## switch Expression (Java 14+)

The modern `switch` expression eliminates fall-through by default, uses arrow `->` syntax, and can return a value directly. It is more concise and safer than the traditional switch.

### Arrow Syntax (no fall-through)

```java
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6 -> "Saturday";
    case 7 -> "Sunday";
    default -> "Invalid day";
};
System.out.println(dayName); // "Wednesday"
```

### Multiple Labels in One Case

```java
int month = 4;
int daysInMonth = switch (month) {
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11           -> 30;
    case 2                      -> 28;
    default                     -> throw new IllegalArgumentException("Invalid month: " + month);
};
System.out.println(daysInMonth); // 30
```

### `yield` Keyword (for multi-statement cases)

```java
int score = 85;
String result = switch (score / 10) {
    case 10, 9 -> "Excellent";
    case 8 -> {
        System.out.println("Processing B grade...");
        yield "Good";  // yield returns a value from a block
    }
    case 7 -> "Average";
    default -> "Below Average";
};
System.out.println(result); // "Good"
```

### Traditional switch vs switch Expression

| Feature | Traditional `switch` | `switch` Expression (Java 14+) |
|---------|---------------------|-------------------------------|
| Syntax | `case X:` | `case X ->` |
| Fall-through | Yes (use `break` to prevent) | No (each case is independent) |
| Returns a value | No | Yes |
| Multiple labels | Requires stacking `case` lines | `case 1, 2, 3 ->` |
| Block with return | `break` exits | `yield` returns value |
| Null safety (Java 21) | No | `case null ->` supported |

---

## for Loop

The classic `for` loop gives you full control over initialization, condition, and update.

```java
// Syntax: for (initialization; condition; update)
for (int i = 0; i < 5; i++) {
    System.out.print(i + " ");
}
// Output: 0 1 2 3 4

// Countdown
for (int i = 10; i >= 0; i--) {
    System.out.print(i + " ");
}
// Output: 10 9 8 7 6 5 4 3 2 1 0

// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println("i=" + i + " j=" + j);
}
```

### Nested for Loops

```java
// Multiplication table
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= 5; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}
```

---

## Enhanced for-each Loop

Designed specifically for iterating over **arrays** and any **Iterable** (collections). Simpler and safer — no index management.

```java
// Iterating over an array
int[] numbers = {10, 20, 30, 40, 50};
for (int num : numbers) {
    System.out.print(num + " ");
}
// Output: 10 20 30 40 50

// Iterating over a List
import java.util.List;
List<String> fruits = List.of("Apple", "Banana", "Cherry");
for (String fruit : fruits) {
    System.out.println(fruit);
}
```

> **Limitation:** You cannot modify the array/collection size inside a for-each, and you don't have direct access to the index.

---

## while Loop

Checks the condition **before** each iteration. If the condition is false from the start, the body never executes.

```java
int count = 1;
while (count <= 5) {
    System.out.print(count + " ");
    count++;
}
// Output: 1 2 3 4 5

// Practical example: reading until a sentinel value
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);
System.out.println("Enter numbers (enter -1 to stop):");
int input = scanner.nextInt();
int sum = 0;
while (input != -1) {
    sum += input;
    input = scanner.nextInt();
}
System.out.println("Sum: " + sum);
```

---

## do-while Loop

Checks the condition **after** each iteration. The body **always executes at least once**.

```java
int number = 1;
do {
    System.out.print(number + " ");
    number++;
} while (number <= 5);
// Output: 1 2 3 4 5

// Classic use case: input validation (must prompt at least once)
Scanner sc = new Scanner(System.in);
int age;
do {
    System.out.print("Enter your age (must be > 0): ");
    age = sc.nextInt();
} while (age <= 0);
System.out.println("Your age: " + age);
```

---

## Loop Comparison Table

| Loop Type | Checks Condition | Min Executions | Best Used When |
|-----------|-----------------|---------------|----------------|
| `for` | Before each iteration | 0 | Known number of iterations |
| `for-each` | Before each iteration | 0 | Iterating collections/arrays |
| `while` | Before each iteration | 0 | Unknown iterations, condition-first |
| `do-while` | After each iteration | **1** | Must execute at least once (menus, input validation) |

---

## break and continue

### `break` — Exit the Loop Immediately

```java
// Find the first even number in an array
int[] nums = {1, 3, 7, 4, 9, 2};
for (int n : nums) {
    if (n % 2 == 0) {
        System.out.println("First even: " + n); // First even: 4
        break;  // exit the loop immediately
    }
}
```

In a `switch`, `break` exits the switch block. In a loop, it exits the innermost enclosing loop.

### `continue` — Skip to the Next Iteration

```java
// Print only odd numbers
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;  // skip even numbers — jump to next iteration
    }
    System.out.print(i + " ");
}
// Output: 1 3 5 7 9
```

### Labeled break and continue

Labels allow `break` and `continue` to target an outer loop when inside nested loops — use them sparingly.

```java
// Labeled break — exit the outer loop from inside the inner loop
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i + j == 6) {
            System.out.println("Breaking at i=" + i + ", j=" + j);
            break outer;  // exits the outer loop entirely
        }
    }
}
// Output: Breaking at i=2, j=4

// Labeled continue — skip current outer iteration from inside inner loop
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            continue outer;  // skip to next iteration of outer loop
        }
        System.out.println("i=" + i + " j=" + j);
    }
}
```

---

## Infinite Loops

```java
// for-based infinite loop (common in servers, event loops)
for (;;) {
    // process next request
    if (done) break;
}

// while-based infinite loop
while (true) {
    // game loop
    if (gameOver) break;
}
```

---

## Complete Control Flow Example

```java
import java.util.Scanner;

public class GradeCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalScore = 0;
        int count = 0;

        System.out.println("Enter student scores (-1 to finish):");

        // do-while ensures we prompt at least once
        int score;
        do {
            System.out.print("Score: ");
            score = sc.nextInt();

            if (score == -1) break;  // exit signal

            // Validate range using if-else
            if (score < 0 || score > 100) {
                System.out.println("Invalid score — must be 0-100. Skipping.");
                continue;
            }

            totalScore += score;
            count++;

        } while (true);

        if (count == 0) {
            System.out.println("No valid scores entered.");
        } else {
            double average = (double) totalScore / count;
            System.out.printf("Average: %.2f%n", average);

            // switch expression for grade
            String grade = switch ((int) average / 10) {
                case 10, 9 -> "A";
                case 8     -> "B";
                case 7     -> "C";
                case 6     -> "D";
                default    -> "F";
            };
            System.out.println("Grade: " + grade);
        }
    }
}
```

---

## Try it

1. **FizzBuzz classic:** Use a `for` loop from 1 to 100. Print `"Fizz"` for multiples of 3, `"Buzz"` for multiples of 5, `"FizzBuzz"` for multiples of both, and the number otherwise.
2. **Menu with do-while:** Write a program that shows a menu (1=Add, 2=Subtract, 3=Quit) using a `do-while` loop. Keep prompting until the user chooses 3. Use `switch` expression to handle each option.
3. **Prime number finder:** Use nested loops with `break` to find all prime numbers from 2 to 100. Print them in rows of 10.
4. **Short-circuit safety:** Write code that takes a `String` input that could be `null`. Use `||` short-circuit to safely check if it's null or empty in a single condition without a NullPointerException.
5. **Labeled break maze:** Create a 5×5 2D array filled with zeros except one cell set to 1 (the "treasure"). Use labeled nested loops to find it and print its coordinates when found.
6. **Loop comparison:** Implement the same task — summing numbers from 1 to 10 — using all four loop types (`for`, `for-each` on an array, `while`, `do-while`). Confirm they all produce 55.
