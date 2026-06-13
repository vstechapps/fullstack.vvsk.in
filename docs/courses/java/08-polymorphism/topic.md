# Polymorphism in Java

Polymorphism — from the Greek meaning "many forms" — is the ability of a single interface, method, or reference to behave differently depending on the underlying type. It is one of the most powerful principles in Object-Oriented Programming, enabling flexible, extensible, and maintainable code. Java supports two kinds of polymorphism: **compile-time polymorphism** (resolved at compile time via method overloading) and **runtime polymorphism** (resolved at runtime via method overriding and dynamic dispatch). Together, they allow you to write code that works generically across many types without knowing their exact implementation.

---

## Real-World Analogy

Think of a **remote control**. The same "Play" button behaves differently depending on what device it's connected to: a DVD player plays a disc, a music player plays a song, a streaming box plays a video. The button's interface is the same, but the **underlying behavior varies by context**. This is polymorphism — one interface, many behaviors.

---

## Compile-Time Polymorphism — Method Overloading

**Method overloading** allows a class to define multiple methods with the **same name** but different parameter lists (type, number, or order of parameters). The compiler determines which version to call based on the arguments at compile time.

```java
public class Calculator {

    // Different number of parameters
    public int add(int a, int b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Different parameter types
    public double add(double a, double b) {
        return a + b;
    }

    public String add(String a, String b) {
        return a + b;   // string concatenation
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(2, 3));           // 5        — int version
        System.out.println(calc.add(1, 2, 3));        // 6        — 3-arg version
        System.out.println(calc.add(1.5, 2.5));       // 4.0      — double version
        System.out.println(calc.add("Hello, ", "World!")); // Hello, World!
    }
}
```

### Overloading Rules

- Methods must differ in **parameter list** (type, count, or order) — **not** just return type.
- Return type alone **cannot** distinguish overloaded methods.
- Overloading works with **static** and **instance** methods.
- Java uses **widening promotion** to resolve ambiguity (e.g., `int` → `long` → `float` → `double`).

```java
public class Widening {
    public void print(long x) {
        System.out.println("long: " + x);
    }

    public static void main(String[] args) {
        new Widening().print(42);   // int 42 is widened to long automatically
    }
}
```

---

## Runtime Polymorphism — Method Overriding and Dynamic Dispatch

**Runtime polymorphism** occurs when a superclass reference points to a subclass object and the overridden method is resolved **at runtime** — not at compile time. Java's JVM uses a mechanism called **dynamic method dispatch** to determine which implementation to call.

```java
public class Notification {
    public void send(String message) {
        System.out.println("Sending generic notification: " + message);
    }
}

public class EmailNotification extends Notification {
    @Override
    public void send(String message) {
        System.out.println("📧 Email: " + message);
    }
}

public class SMSNotification extends Notification {
    @Override
    public void send(String message) {
        System.out.println("📱 SMS: " + message);
    }
}

public class PushNotification extends Notification {
    @Override
    public void send(String message) {
        System.out.println("🔔 Push: " + message);
    }
}

public class NotificationService {
    // Works with ANY Notification subtype
    public void dispatch(Notification n, String msg) {
        n.send(msg);   // resolved at runtime — dynamic dispatch
    }

    public static void main(String[] args) {
        NotificationService service = new NotificationService();

        Notification[] channels = {
            new EmailNotification(),
            new SMSNotification(),
            new PushNotification()
        };

        for (Notification channel : channels) {
            service.dispatch(channel, "Your order has shipped!");
        }
        // 📧 Email: Your order has shipped!
        // 📱 SMS:   Your order has shipped!
        // 🔔 Push:  Your order has shipped!
    }
}
```

### How Dynamic Dispatch Works

At runtime, Java looks up the **actual type** of the object (not the declared reference type) in the method table (vtable) to find the correct method implementation. This lookup happens every time the method is called.

---

## Overloading vs Overriding Comparison

| Feature | Method Overloading | Method Overriding |
|---|---|---|
| Resolution time | Compile time | Runtime |
| Polymorphism type | Compile-time (static) | Runtime (dynamic) |
| Method signature | Must differ | Must be identical |
| Return type | Can differ freely | Must be same or covariant |
| Class scope | Same class | Subclass of parent |
| `@Override` annotation | Not applicable | Recommended |
| `static` methods | Can be overloaded | Cannot be overridden (hidden instead) |
| `private` methods | Can be overloaded | Cannot be overridden |
| Access modifier | No restriction | Cannot be more restrictive |
| Exception handling | No restriction | Cannot add new checked exceptions |

---

## Interfaces for Polymorphism

Interfaces are the most powerful tool for achieving polymorphism in Java because they allow **completely unrelated classes** to be treated uniformly through a common contract.

```java
// Define the contract
public interface Printable {
    void print();
}

// Completely unrelated classes implementing the same interface
public class Invoice implements Printable {
    private String invoiceNumber;
    private double amount;

    public Invoice(String invoiceNumber, double amount) {
        this.invoiceNumber = invoiceNumber;
        this.amount = amount;
    }

    @Override
    public void print() {
        System.out.printf("Invoice #%s — Amount: $%.2f%n", invoiceNumber, amount);
    }
}

public class Receipt implements Printable {
    private String storeName;

    public Receipt(String storeName) {
        this.storeName = storeName;
    }

    @Override
    public void print() {
        System.out.println("Receipt from: " + storeName);
    }
}

public class Photo implements Printable {
    private String filename;

    public Photo(String filename) {
        this.filename = filename;
    }

    @Override
    public void print() {
        System.out.println("Printing photo: " + filename);
    }
}

// Polymorphic method — works with ANY Printable
public class Printer {
    public void printAll(List<Printable> items) {
        for (Printable item : items) {
            item.print();
        }
    }

    public static void main(String[] args) {
        List<Printable> queue = new ArrayList<>();
        queue.add(new Invoice("INV-001", 250.00));
        queue.add(new Receipt("Java Bookstore"));
        queue.add(new Photo("vacation.jpg"));

        new Printer().printAll(queue);
    }
}
```

### Interface Declaration and `implements`

```java
// Interface declaration
public interface Drawable {
    // Abstract method (implicitly public abstract)
    void draw();

    // Constant (implicitly public static final)
    int MAX_SIZE = 1000;
}

// Single interface implementation
public class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing circle");
    }
}

// Multiple interface implementation
public interface Resizable {
    void resize(double factor);
}

public interface Colorable {
    void setColor(String color);
}

public class Square implements Drawable, Resizable, Colorable {
    private double side;
    private String color;

    public Square(double side) { this.side = side; }

    @Override public void draw()   { System.out.println("Drawing " + color + " square"); }
    @Override public void resize(double factor) { side *= factor; }
    @Override public void setColor(String color) { this.color = color; }
}
```

---

## Default and Static Interface Methods (Java 8+)

Java 8 introduced `default` and `static` methods in interfaces, allowing interfaces to carry implementation without breaking existing code.

```java
public interface Vehicle {
    // Abstract
    String getBrand();

    // Default method — can be overridden
    default void startEngine() {
        System.out.println(getBrand() + " engine started (default).");
    }

    // Static method — called on the interface, not the object
    static int maxSpeed() {
        return 300;
    }

    // Private method (Java 9+) — helper for default methods
    private void logAction(String action) {
        System.out.println("LOG: " + action);
    }
}

public class Tesla implements Vehicle {
    @Override
    public String getBrand() { return "Tesla"; }

    // Override the default method
    @Override
    public void startEngine() {
        System.out.println("Tesla silently activated.");
    }
}

public class Ford implements Vehicle {
    @Override
    public String getBrand() { return "Ford"; }
    // Uses the default startEngine() without overriding
}

public class Main {
    public static void main(String[] args) {
        Vehicle t = new Tesla();
        Vehicle f = new Ford();

        t.startEngine();        // Tesla silently activated.
        f.startEngine();        // Ford engine started (default).
        System.out.println(Vehicle.maxSpeed()); // 300  — static call
    }
}
```

---

## Sealed Classes (Java 17+)

**Sealed classes** restrict which classes can extend or implement them, giving you controlled, exhaustive type hierarchies — the best of both open polymorphism and closed exhaustiveness.

```java
// Declare sealed class — only listed subtypes are allowed
public sealed class Shape
    permits Circle, Rectangle, Triangle { }

// Each permitted class must be: final, sealed, or non-sealed
public final class Circle extends Shape {
    double radius;
    Circle(double r) { this.radius = r; }
}

public final class Rectangle extends Shape {
    double width, height;
    Rectangle(double w, double h) { this.width = w; this.height = h; }
}

public non-sealed class Triangle extends Shape {
    // non-sealed means Triangle itself can be extended freely
    double base, height;
    Triangle(double b, double h) { this.base = b; this.height = h; }
}

// Pattern matching switch (Java 21 — fully finalized)
public double area(Shape s) {
    return switch (s) {
        case Circle c    -> Math.PI * c.radius * c.radius;
        case Rectangle r -> r.width * r.height;
        case Triangle t  -> 0.5 * t.base * t.height;
        // No default needed — compiler knows all permitted subtypes!
    };
}
```

---

## Casting Rules

```java
// Class hierarchy: Animal → Dog → GoldenRetriever
Animal a;
Dog d;
GoldenRetriever g = new GoldenRetriever("Buddy");

// === UPCASTING (implicit, always safe) ===
d = g;            // GoldenRetriever → Dog (upcast)
a = g;            // GoldenRetriever → Animal (upcast)
a = d;            // Dog → Animal (upcast)

// === DOWNCASTING (explicit, needs verification) ===
// Safe downcast using instanceof + pattern matching (Java 16+)
if (a instanceof Dog dog) {
    dog.fetch();  // no explicit cast needed
}

// Traditional downcast — risk of ClassCastException
Dog castedDog = (Dog) a;       // OK if 'a' actually holds a Dog
// Cat wrongCast = (Cat) a;    // ❌ ClassCastException at runtime

// Checking before casting (old style)
if (a instanceof GoldenRetriever) {
    GoldenRetriever gr = (GoldenRetriever) a;
    gr.shake();
}
```

### Casting Rules Summary

| Rule | Detail |
|---|---|
| Upcast | Always implicit and safe — no cast syntax needed |
| Downcast | Requires explicit `(Type)` cast |
| Failed downcast | Throws `ClassCastException` at runtime |
| Safe downcast | Use `instanceof` before casting |
| Unrelated cast | Compile-time error if types have no relationship |

---

## Polymorphism Benefits in Design

- **Open/Closed Principle** — Code is open for extension (add new types) but closed for modification (existing code unchanged).
- **Liskov Substitution Principle** — Subclass objects can replace superclass references without breaking behavior.
- **Dependency Inversion** — Program to interfaces/abstractions, not concrete implementations.
- **Reduced Coupling** — Client code depends on the interface type, not specific implementations.
- **Easy Testing** — Swap real implementations with mocks/stubs that share the same interface.

```java
// Without polymorphism — tightly coupled
public void processPayment(String type) {
    if (type.equals("card"))   { /* card logic */ }
    if (type.equals("paypal")) { /* paypal logic */ }
    // Adding new type requires modifying this method ❌
}

// With polymorphism — open for extension
public interface PaymentGateway {
    void processPayment(double amount);
}

public void processPayment(PaymentGateway gateway, double amount) {
    gateway.processPayment(amount);  // works for ANY payment type ✅
}

// New types added without touching existing code
public class CryptoPayment implements PaymentGateway {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing crypto payment: " + amount);
    }
}
```

---

## Key Concepts Summary

- **Compile-time polymorphism** is achieved via **method overloading** — same name, different signatures.
- **Runtime polymorphism** is achieved via **method overriding** — same signature, different class; resolved by dynamic dispatch.
- **Interfaces** are the primary tool for polymorphism in Java, enabling unrelated classes to share a contract.
- **`implements`** connects a class to an interface; a class can implement **multiple** interfaces.
- **`default` methods** in interfaces (Java 8+) provide optional concrete implementations.
- **`static` methods** in interfaces are called on the interface name, not instances.
- **Sealed classes** (Java 17+) restrict the permitted subtypes, enabling exhaustive pattern matching.
- **Upcasting** is always safe; **downcasting** requires `instanceof` verification to prevent `ClassCastException`.

---

## Try it

Practice these exercises to master polymorphism:

1. **Overloading a Logger** — Create a `Logger` class with overloaded `log(String msg)`, `log(String msg, int level)`, and `log(Exception e)` methods. Test each variant.

2. **Payment System** — Define a `PaymentGateway` interface with `processPayment(double amount)` and `refund(double amount)`. Implement `CreditCard`, `PayPal`, and `BankTransfer` classes. Write a method that accepts a `List<PaymentGateway>` and processes all payments.

3. **Shape Renderer** — Use the `Shape`/`Circle`/`Rectangle`/`Triangle` sealed class example. Write a `renderAll(List<Shape> shapes)` method using a `switch` expression and pattern matching.

4. **Interface Stacking** — Define interfaces `Flyable`, `Swimmable`, and `Walkable`, each with one method. Create a `Duck` class that implements all three. Store a `Duck` in a `Flyable` reference, a `Swimmable` reference, and a `Walkable` reference, calling each method.

5. **Casting Challenge** — Create an array of `Animal` references, some pointing to `Dog` and some to `Cat`. Iterate and use `instanceof` with pattern matching to call `bark()` only on dogs and `purr()` only on cats.

6. **Default Method Override** — Create an interface `Greetable` with a `default greet()` that prints "Hello!" Override it in class `FormalPerson` to print "Good day, sir." and in `CasualPerson` to print "Hey!" Test polymorphic dispatch.
