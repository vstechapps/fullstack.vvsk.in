# Object-Oriented Programming Basics in Java

Object-Oriented Programming (OOP) is Java's core paradigm. Instead of writing programs as sequences of instructions, OOP organizes code into **objects** — self-contained units that bundle data (fields) and behavior (methods) together. This topic covers how to design and use classes, manage access, understand memory layout, and write robust foundational classes in Java.

---

## Classes and Objects

A **class** is a blueprint — a template that describes what data an object holds and what actions it can perform.  
An **object** is a concrete instance of a class, created with the `new` keyword and stored in **heap memory**.

```java
// Class = blueprint
public class Car {
    // Fields (data / state)
    String make;
    String model;
    int year;
    double speed;

    // Method (behavior)
    void accelerate(double amount) {
        speed += amount;
    }

    void brake(double amount) {
        speed = Math.max(0, speed - amount);
    }

    void displayInfo() {
        System.out.println(year + " " + make + " " + model + " @ " + speed + " km/h");
    }
}
```

```java
// Objects = instances of the blueprint
public class Main {
    public static void main(String[] args) {
        Car car1 = new Car();   // object 1
        car1.make  = "Toyota";
        car1.model = "Camry";
        car1.year  = 2023;

        Car car2 = new Car();   // object 2 — independent from car1
        car2.make  = "Honda";
        car2.model = "Civic";
        car2.year  = 2022;

        car1.accelerate(60.0);
        car2.accelerate(80.0);

        car1.displayInfo(); // 2023 Toyota Camry @ 60.0 km/h
        car2.displayInfo(); // 2022 Honda Civic @ 80.0 km/h
    }
}
```

### Stack vs Heap Memory

```
STACK (per thread)           HEAP (shared)
─────────────────────        ──────────────────────────────
car1 ──────────────────────► [ Car object #1          ]
                              [ make:  "Toyota"        ]
                              [ model: "Camry"         ]
                              [ year:  2023            ]
                              [ speed: 60.0            ]

car2 ──────────────────────► [ Car object #2          ]
                              [ make:  "Honda"         ]
                              [ model: "Civic"         ]
                              [ year:  2022            ]
                              [ speed: 80.0            ]
```

- **Stack:** stores local variables and references (the variable `car1` itself is on the stack)
- **Heap:** stores the actual object data
- When you do `Car car3 = car1;`, both variables point to the **same heap object** — no copy is made

---

## Access Modifiers

Access modifiers control the **visibility** of fields, methods, and classes from other parts of the program.

| Modifier | Same Class | Same Package | Subclass (any package) | Any Class |
|----------|:---------:|:------------:|:----------------------:|:---------:|
| `private` | ✅ | ❌ | ❌ | ❌ |
| *(default / package-private)* | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

```java
public class BankAccount {
    private double balance;       // only this class can touch it directly
    String owner;                 // package-private — accessible in same package
    protected String bankName;    // accessible to subclasses too
    public int accountNumber;     // accessible everywhere
}
```

> **Best practice:** Make fields `private` by default. Expose data through `public` methods (getters/setters). This is the **encapsulation** principle.

---

## Encapsulation

Encapsulation means hiding the internal state of an object and requiring all interaction to go through well-defined methods. This protects data integrity and lets you change internals without breaking external code.

```java
public class BankAccount {
    private double balance;  // hidden — outsiders can't modify it directly
    private String owner;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = (initialBalance >= 0) ? initialBalance : 0;
    }

    // Controlled access via methods
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.printf("Deposited ₹%.2f | Balance: ₹%.2f%n", amount, balance);
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.printf("Withdrew ₹%.2f | Balance: ₹%.2f%n", amount, balance);
        } else {
            System.out.println("Insufficient funds or invalid amount.");
        }
    }

    public double getBalance() { return balance; } // read-only access
    public String getOwner()   { return owner; }
}
```

---

## Getters and Setters

Getters and setters are the standard way to provide controlled access to private fields.

```java
public class Person {
    private String name;
    private int age;

    // Getter — read access
    public String getName() { return name; }
    public int getAge()     { return age; }

    // Setter — write access with validation
    public void setName(String name) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
    }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }
}
```

```java
// Usage
Person p = new Person();
p.setName("Alice");
p.setAge(30);
System.out.println(p.getName() + " is " + p.getAge() + " years old.");
// Alice is 30 years old.
```

> **IDE tip:** Most IDEs (IntelliJ, VS Code) can auto-generate getters and setters — right-click → Generate → Getters and Setters.

---

## The `this` Keyword

`this` refers to the **current object** — the instance on which the method or constructor is being called. It is used to:

1. Disambiguate between instance fields and local variables/parameters with the same name
2. Call another constructor in the same class (constructor chaining)
3. Pass the current object as an argument to another method

```java
public class Student {
    private String name;
    private int rollNumber;

    // 1. Disambiguate: parameter 'name' shadows field 'name'
    public void setName(String name) {
        this.name = name;    // this.name = field; name = parameter
    }

    // 2. Pass current object as argument
    public void registerForExam(ExamService service) {
        service.enroll(this);  // passes the current Student object
    }
}
```

---

## Constructors

A **constructor** is a special method called when an object is created with `new`. It has the same name as the class and no return type.

### Default Constructor

If you write no constructor, Java provides a default no-arg constructor automatically. As soon as you define any constructor, the default is removed.

```java
public class Point {
    double x;
    double y;
    // Java auto-provides: public Point() {} if no constructor defined
}

Point p = new Point(); // x=0.0, y=0.0 (default values)
```

### Parameterized Constructor

```java
public class Point {
    double x;
    double y;

    // Parameterized constructor
    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
}

Point p1 = new Point(3.0, 4.0);
Point p2 = new Point(-1.5, 2.5);
```

### Constructor Overloading

A class can have multiple constructors with different parameter lists — the compiler picks the right one based on the arguments provided.

```java
public class Rectangle {
    private double width;
    private double height;

    // No-arg: creates a 1x1 rectangle
    public Rectangle() {
        this(1.0, 1.0);   // calls the two-arg constructor (constructor chaining)
    }

    // Square: both sides equal
    public Rectangle(double side) {
        this(side, side); // calls the two-arg constructor (constructor chaining)
    }

    // Full constructor
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double area() {
        return width * height;
    }
}
```

```java
Rectangle r1 = new Rectangle();        // 1x1 → area=1.0
Rectangle r2 = new Rectangle(5.0);     // 5x5 → area=25.0
Rectangle r3 = new Rectangle(3.0, 4.0); // 3x4 → area=12.0
```

### Constructor Chaining with `this()`

`this(...)` must be the **first statement** in a constructor body:

```java
public Rectangle(double width, double height) {
    // this.width = width;  // this line would need to come after this()
    this.width = width;
    this.height = height;
}

public Rectangle() {
    this(1.0, 1.0);  // must be first statement — calls full constructor
    // System.out.println("Created"); // this line would go after this()
}
```

---

## Method Overloading

Method overloading allows a class to have multiple methods with the **same name** but different **parameter lists** (number or types of parameters).

```java
public class Calculator {

    // Method 1: adds two ints
    public int add(int a, int b) {
        return a + b;
    }

    // Method 2: adds three ints
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Method 3: adds two doubles
    public double add(double a, double b) {
        return a + b;
    }

    // Method 4: concatenates two Strings
    public String add(String a, String b) {
        return a + b;
    }
}
```

```java
Calculator calc = new Calculator();
System.out.println(calc.add(2, 3));          // 5      (int version)
System.out.println(calc.add(1, 2, 3));       // 6      (three-int version)
System.out.println(calc.add(1.5, 2.5));      // 4.0    (double version)
System.out.println(calc.add("Hi", " Java")); // "Hi Java" (String version)
```

> The compiler selects the correct method at **compile time** based on argument types and count. This is called **static dispatch** or **compile-time polymorphism**.

---

## Static Fields and Methods vs Instance Members

| | Instance Members | Static Members |
|--|-----------------|---------------|
| Belongs to | Each object | The class itself |
| Memory | New copy per object | One shared copy |
| Access | `objectName.field` | `ClassName.field` |
| Can access | Instance + static | Static only (no `this`) |
| Typical use | Object state | Utilities, constants, counters |

```java
public class Counter {
    // Static field: shared across ALL instances
    private static int totalCount = 0;

    // Instance field: unique to each object
    private int id;
    private String name;

    public Counter(String name) {
        totalCount++;          // increment the shared counter
        this.id = totalCount;  // assign unique id
        this.name = name;
    }

    // Static method: operates on class-level data
    public static int getTotalCount() {
        return totalCount;
        // 'this' would be illegal here — no object context
    }

    // Instance method: can access both static and instance members
    public String getInfo() {
        return "Counter #" + id + " | Name: " + name
             + " | Total: " + totalCount;
    }
}
```

```java
Counter c1 = new Counter("Alpha");
Counter c2 = new Counter("Beta");
Counter c3 = new Counter("Gamma");

System.out.println(c1.getInfo()); // Counter #1 | Name: Alpha | Total: 3
System.out.println(c2.getInfo()); // Counter #2 | Name: Beta  | Total: 3
System.out.println(Counter.getTotalCount()); // 3
```

---

## `toString()`, `equals()`, and `hashCode()`

Every Java class implicitly inherits from `java.lang.Object`. Three methods from `Object` are especially important to override.

### `toString()` — Human-readable representation

```java
// Without override:
System.out.println(car); // Car@1a2b3c4 (class name + hash — not useful)

// With override:
public class Car {
    private String make;
    private String model;
    private int year;

    @Override
    public String toString() {
        return year + " " + make + " " + model;
    }
}

Car car = new Car("Toyota", "Camry", 2023);
System.out.println(car); // 2023 Toyota Camry (toString called automatically by println)
```

### `equals()` — Logical equality

```java
public class Car {
    private String make;
    private String model;
    private int year;

    // Two cars are equal if make, model, and year all match
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;          // same reference
        if (obj == null) return false;          // null check
        if (getClass() != obj.getClass()) return false; // type check
        Car other = (Car) obj;                 // safe cast
        return year == other.year
            && make.equals(other.make)
            && model.equals(other.model);
    }
}
```

### `hashCode()` — Required partner of `equals()`

```java
import java.util.Objects;

@Override
public int hashCode() {
    return Objects.hash(make, model, year);  // consistent with equals()
}
```

> **Contract:** If `a.equals(b)` is `true`, then `a.hashCode()` must equal `b.hashCode()`. Always override both together.

### Complete Example — `Student` Class

```java
import java.util.Objects;

public class Student {
    private String name;
    private int rollNumber;
    private double gpa;

    // Constructor
    public Student(String name, int rollNumber, double gpa) {
        this.name       = name;
        this.rollNumber = rollNumber;
        this.gpa        = gpa;
    }

    // Getters
    public String getName()     { return name; }
    public int getRollNumber()  { return rollNumber; }
    public double getGpa()      { return gpa; }

    // Setter with validation
    public void setGpa(double gpa) {
        if (gpa >= 0.0 && gpa <= 10.0) this.gpa = gpa;
    }

    @Override
    public String toString() {
        return String.format("Student[roll=%d, name=%s, gpa=%.2f]",
                             rollNumber, name, gpa);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Student)) return false;
        Student other = (Student) obj;
        return rollNumber == other.rollNumber;  // roll number uniquely identifies a student
    }

    @Override
    public int hashCode() {
        return Objects.hash(rollNumber);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Alice", 101, 9.1);
        Student s2 = new Student("Bob",   102, 8.7);
        Student s3 = new Student("Alice", 101, 9.1); // same roll as s1

        System.out.println(s1);           // Student[roll=101, name=Alice, gpa=9.10]
        System.out.println(s2);           // Student[roll=102, name=Bob, gpa=8.70]
        System.out.println(s1.equals(s3)); // true (same rollNumber)
        System.out.println(s1.equals(s2)); // false

        s1.setGpa(9.5);
        System.out.println(s1.getGpa());   // 9.5
    }
}
```

---

## Creating Multiple Objects — Memory Diagram

```java
Student s1 = new Student("Alice", 101, 9.1);
Student s2 = new Student("Bob",   102, 8.7);
Student s3 = s1;  // s3 is an ALIAS — points to the same object as s1
```

```
STACK                        HEAP
─────────────────────        ─────────────────────────────────
s1 (ref) ────────────────►  [ Student Object A               ]
s3 (ref) ────────────────►  [ name: "Alice", roll: 101, gpa: 9.1 ]

s2 (ref) ────────────────►  [ Student Object B               ]
                             [ name: "Bob", roll: 102, gpa: 8.7  ]
```

- `s1 == s3` → `true` (same reference, same heap address)
- `s1 == s2` → `false` (different objects)
- `s1.equals(s2)` → depends on the `equals()` implementation

---

## OOP Concepts Quick Reference

| Concept | Definition | Example |
|---------|-----------|---------|
| **Class** | Blueprint for creating objects | `class Car {}` |
| **Object** | Instance of a class | `Car myCar = new Car();` |
| **Field** | Variable belonging to a class/object | `private String make;` |
| **Method** | Function belonging to a class/object | `public void drive() {}` |
| **Constructor** | Special method to initialize objects | `public Car(String make) {}` |
| **Encapsulation** | Hiding fields, exposing via methods | `private` fields + `public` getters/setters |
| **Overloading** | Multiple methods with same name | `add(int, int)` and `add(double, double)` |
| **this** | Reference to current instance | `this.name = name;` |
| **static** | Belongs to class, not instance | `static int count;` |
| **final** | Immutable variable or non-overridable | `final int MAX = 100;` |

---

## Try it

1. **Build a `Book` class:** Create a class `Book` with private fields `title`, `author`, `year`, and `price`. Add a parameterized constructor, all getters, setters with validation (year > 1000, price >= 0), `toString()`, and `equals()` based on ISBN (add an `isbn` field). Create 3 Book objects in `main` and print them.

2. **Constructor chaining:** Add three constructors to `Book` — a no-arg (defaults: "Unknown", "Unknown", 2000, 0.0), a two-arg `(String title, String author)` that chains to the full constructor, and the full constructor. Verify all three work with `new Book(...)`.

3. **Method overloading:** Create a `Printer` class with three `print()` methods — one for `int`, one for `double`, and one for `String[]` (prints each element on a new line). Call all three from `main`.

4. **Static counter:** Create an `Employee` class with a `static` field `employeeCount` that increments in the constructor. Add a static method `getEmployeeCount()`. Create 5 employees and verify the count.

5. **equals/hashCode test:** Add 3 `Student` objects (two with the same roll number) to a `HashSet<Student>`. Print the set size. Without a proper `hashCode()`, the set may contain duplicates — override it and re-test to see the difference.

6. **Memory/reference trap:** Create two `Student` references pointing to the same object. Change the GPA through one reference and print via the other. Observe that both see the change, confirming they are the same object, not copies.
