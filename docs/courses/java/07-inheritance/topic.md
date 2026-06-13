# Inheritance in Java

Inheritance is one of the four fundamental pillars of Object-Oriented Programming (OOP). It allows a class (called the **subclass** or **child class**) to acquire the properties and behaviors of another class (called the **superclass** or **parent class**). Inheritance promotes **code reuse**, establishes natural **IS-A relationships** between types, and lays the groundwork for polymorphism. In Java, inheritance is implemented using the `extends` keyword and follows a **single-inheritance model** for classes — meaning each class can extend exactly one parent class. This design avoids the ambiguities of multiple class inheritance while still supporting rich polymorphic hierarchies.

---

## The `extends` Keyword and Single Inheritance

Java uses the `extends` keyword to declare that one class inherits from another. Every class in Java implicitly extends `java.lang.Object` if no explicit parent is specified.

```java
// Parent class (superclass)
public class Animal {
    String name;
    int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }
}

// Child class (subclass) — inherits from Animal
public class Dog extends Animal {
    String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);      // call parent constructor
        this.breed = breed;
    }

    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy", 3, "Labrador");
        dog.eat();    // inherited from Animal
        dog.sleep();  // inherited from Animal
        dog.bark();   // defined in Dog
    }
}
```

### Key Rules of Single Inheritance

- A class can `extend` **only one** class — Java does not support multiple class inheritance.
- A subclass inherits all **non-private** members (fields and methods) of its parent.
- **Constructors** are not inherited, but they can be invoked using `super()`.
- The inheritance chain can be arbitrarily deep: `A → B → C → D`.

---

## Method Overriding and the `@Override` Annotation

Method overriding allows a subclass to provide its own specific implementation of a method that is already defined in the parent class. The method signature (name + parameters) must match exactly.

```java
public class Animal {
    public void makeSound() {
        System.out.println("Some generic animal sound");
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a1 = new Cat();
        Animal a2 = new Dog();
        a1.makeSound(); // Meow!
        a2.makeSound(); // Woof!
    }
}
```

### Why Use `@Override`?

The `@Override` annotation is optional but **strongly recommended**:

| Without `@Override` | With `@Override` |
|---|---|
| Typos silently create a new method | Compiler error on typo or signature mismatch |
| Hard to spot bugs | Intent is clearly communicated |
| No IDE/tool warning | IDEs highlight mismatches immediately |

### Overriding Rules

- The overriding method must have the **same name, return type (or covariant), and parameters**.
- It **cannot** have a more restrictive access modifier (e.g., can't override `public` with `private`).
- `static`, `final`, and `private` methods **cannot** be overridden.
- The overriding method can throw **narrower or fewer checked exceptions** than the parent.

---

## The `super` Keyword

The `super` keyword gives a subclass access to the parent class's members. It has two primary uses: calling the parent constructor and calling an overridden method.

### `super()` — Calling the Parent Constructor

```java
public class Vehicle {
    String brand;
    int year;

    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
        System.out.println("Vehicle constructor called");
    }
}

public class Car extends Vehicle {
    int doors;

    public Car(String brand, int year, int doors) {
        super(brand, year);   // MUST be the first statement
        this.doors = doors;
        System.out.println("Car constructor called");
    }
}

// Output when new Car("Toyota", 2022, 4) is created:
// Vehicle constructor called
// Car constructor called
```

### `super.method()` — Calling an Overridden Method

```java
public class Shape {
    public void draw() {
        System.out.println("Drawing a shape");
    }
}

public class Circle extends Shape {
    @Override
    public void draw() {
        super.draw();                          // call parent's draw()
        System.out.println("Drawing a circle");
    }
}

// Output: 
// Drawing a shape
// Drawing a circle
```

---

## Constructor Chaining in Inheritance

When an object is created, Java automatically chains constructor calls from the **top of the hierarchy downward**. If you don't explicitly call `super()`, Java inserts an implicit call to the no-arg parent constructor.

```java
public class A {
    public A() {
        System.out.println("A constructor");
    }
}

public class B extends A {
    public B() {
        // implicit super() call to A()
        System.out.println("B constructor");
    }
}

public class C extends B {
    public C() {
        // implicit super() call to B()
        System.out.println("C constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        new C();
        // Output:
        // A constructor
        // B constructor
        // C constructor
    }
}
```

> **Rule:** `super()` must always be the **first statement** in a constructor. You cannot call both `super()` and `this()` in the same constructor.

---

## The `protected` Access Modifier

The `protected` modifier is closely tied to inheritance. A `protected` member is accessible:

- Within the **same class**
- Within the **same package**
- Within **any subclass** (even in a different package)

```java
// In package: animals
public class Animal {
    protected String name;       // accessible to subclasses
    private int secretId;        // NOT accessible to subclasses

    protected void breathe() {
        System.out.println(name + " is breathing.");
    }
}

// In package: pets (different package)
import animals.Animal;

public class Pet extends Animal {
    public void introduce() {
        System.out.println("I am " + name);   // ✅ protected field accessible
        breathe();                              // ✅ protected method accessible
        // secretId = 1;                        // ❌ private — not accessible
    }
}
```

### Access Modifier Summary

| Modifier | Same Class | Same Package | Subclass | Everywhere |
|---|---|---|---|---|
| `private` | ✅ | ❌ | ❌ | ❌ |
| *(default)* | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

---

## Preventing Inheritance with `final`

The `final` keyword can be applied to a **class** or a **method** to restrict further extension or overriding.

```java
// final class — cannot be extended
public final class ImmutablePoint {
    private final int x;
    private final int y;

    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}

// This would cause a compile error:
// public class ExtendedPoint extends ImmutablePoint { }  // ❌ ERROR

// final method — can be inherited but NOT overridden
public class Base {
    public final void criticalOperation() {
        System.out.println("This cannot be overridden.");
    }
}

public class Derived extends Base {
    // @Override
    // public void criticalOperation() { }  // ❌ ERROR
}
```

Common `final` classes in the JDK: `String`, `Integer`, `Math`, `System`.

---

## Abstract Classes

An **abstract class** is a class that cannot be instantiated directly. It may contain **abstract methods** (no body — subclasses must implement them) and **concrete methods** (with body — inherited as-is). Abstract classes are ideal when you want to define a **template** with shared behavior but leave specific details to subclasses.

```java
public abstract class Shape {
    String color;

    public Shape(String color) {
        this.color = color;
    }

    // Abstract method — must be implemented by subclasses
    public abstract double area();
    public abstract double perimeter();

    // Concrete method — shared by all subclasses
    public void displayInfo() {
        System.out.println("Color: " + color);
        System.out.printf("Area: %.2f%n", area());
        System.out.printf("Perimeter: %.2f%n", perimeter());
    }
}

public class Rectangle extends Shape {
    double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }

    @Override
    public double perimeter() {
        return 2 * (width + height);
    }
}

public class Circle extends Shape {
    double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape r = new Rectangle("Red", 4, 5);
        Shape c = new Circle("Blue", 3);

        r.displayInfo();
        c.displayInfo();

        // Shape s = new Shape("Green");  // ❌ Cannot instantiate abstract class
    }
}
```

### Abstract Class Rules

- Declared with the `abstract` keyword.
- **Cannot** be instantiated with `new`.
- May have **zero or more** abstract methods.
- A subclass must implement **all** abstract methods, or itself be declared `abstract`.
- Can have constructors, fields, and fully implemented methods.

---

## Interface vs Abstract Class

Both interfaces and abstract classes support abstraction, but they serve different design purposes.

| Feature | Abstract Class | Interface |
|---|---|---|
| Keyword | `abstract class` | `interface` |
| Instantiation | Cannot be instantiated | Cannot be instantiated |
| Methods | Abstract + concrete | Abstract + `default` + `static` |
| Fields | Instance fields allowed | Only `public static final` constants |
| Constructor | Yes | No |
| Inheritance | Single (`extends`) | Multiple (`implements`) |
| Access modifiers | Any | `public` (implicitly) |
| When to use | Shared state + partial impl | Pure contract / capability |

```java
// Interface — pure capability
public interface Flyable {
    void fly();
    default void land() {
        System.out.println("Landing safely...");
    }
}

// Abstract class — partial template
public abstract class Bird {
    String name;

    public Bird(String name) { this.name = name; }

    public void breathe() { System.out.println(name + " breathes"); }

    public abstract void makeSound();
}

// Concrete class uses both
public class Eagle extends Bird implements Flyable {
    public Eagle(String name) { super(name); }

    @Override
    public void makeSound() { System.out.println("Screech!"); }

    @Override
    public void fly() { System.out.println(name + " soars high!"); }
}
```

---

## The `instanceof` Operator

The `instanceof` operator checks whether an object is an instance of a specific class or interface at runtime.

```java
Animal animal = new Dog("Rex", 2, "Husky");

System.out.println(animal instanceof Animal); // true
System.out.println(animal instanceof Dog);    // true
System.out.println(animal instanceof Cat);    // false

// Pattern matching with instanceof (Java 16+)
if (animal instanceof Dog d) {
    System.out.println("Dog breed: " + d.breed);  // no cast needed
}
```

---

## Upcasting and Downcasting

**Upcasting** (widening) converts a subclass reference to a superclass type — always safe and implicit.  
**Downcasting** (narrowing) converts a superclass reference back to a subclass type — requires explicit cast and can throw `ClassCastException`.

```java
Animal animal;

// Upcasting — implicit, always safe
Dog dog = new Dog("Max", 4, "Beagle");
animal = dog;          // Dog → Animal (upcast)
animal.eat();          // works — Animal method
// animal.bark();      // ❌ Compile error — Animal type doesn't know bark()

// Downcasting — explicit, must verify type first
if (animal instanceof Dog d) {
    d.bark();          // ✅ Safe using pattern matching (Java 16+)
}

// Old-style downcast (pre-Java 16)
if (animal instanceof Dog) {
    Dog d2 = (Dog) animal;  // explicit cast
    d2.bark();
}

// Unsafe downcast — throws ClassCastException at runtime
Animal cat = new Cat("Whiskers", 1);
// Dog wrongDog = (Dog) cat;  // ❌ ClassCastException!
```

### Casting Quick Reference

| Operation | Syntax | Safety |
|---|---|---|
| Upcast | `Animal a = new Dog(...)` | Always safe (implicit) |
| Downcast (safe) | `if (a instanceof Dog d)` | Compiler-verified |
| Downcast (manual) | `(Dog) a` | Runtime risk of `ClassCastException` |

---

## Key Concepts Summary

- **`extends`** establishes an IS-A relationship; Java allows only **single class inheritance**.
- **`@Override`** is a compile-time safety net for method overriding — always use it.
- **`super()`** chains to the parent constructor and must be the **first statement**.
- **`super.method()`** invokes the parent's version of an overridden method.
- **`protected`** makes members accessible to subclasses across packages.
- **`final class`** prevents any further subclassing; **`final method`** prevents overriding.
- **Abstract classes** provide partial implementations and define contracts via abstract methods.
- **Interfaces** define pure capability contracts; a class can implement many interfaces.
- **`instanceof`** safely checks type before casting; use pattern matching (Java 16+) to avoid explicit casts.
- **Upcasting** is implicit and safe; **downcasting** is explicit and can fail at runtime.

---

## Try it

Practice these exercises to reinforce your understanding of inheritance:

1. **Employee Hierarchy** — Create an abstract class `Employee` with fields `name` and `salary`, a concrete method `displayDetails()`, and an abstract method `calculateBonus()`. Extend it with `Manager` (bonus = 20% of salary) and `Developer` (bonus = 15% of salary). Test with a list of `Employee` references.

2. **super Chain** — Create a three-level hierarchy `LivingThing → Animal → Mammal`. Each constructor should print a message. Create a `Mammal` object and observe the constructor chaining order.

3. **Shape Calculator** — Define an abstract class `Shape` with abstract methods `area()` and `perimeter()`. Implement `Triangle`, `Square`, and `Pentagon`. Store all shapes in an `ArrayList<Shape>` and print details for each.

4. **instanceof and Casting** — Create a `Vehicle` reference pointing to a `Truck` object. Use `instanceof` with pattern matching to safely access `Truck`-specific fields without a `ClassCastException`.

5. **final Experiment** — Mark a method `authenticate()` in a `Security` class as `final`. Try to override it in a `SuperSecurity` subclass and observe the compile error.

6. **Interface + Abstract** — Design a `Drawable` interface with `draw()` and a `default` method `resize()`. Create an abstract class `UIComponent` implementing `Drawable`. Extend it with `Button` and `TextField` classes that provide their own `draw()` implementation.
