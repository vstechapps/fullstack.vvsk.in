# Java Module System (JPMS)

The **Java Platform Module System (JPMS)**, introduced in Java 9 as **Project Jigsaw**, fundamentally changed how Java applications are structured and deployed. Before modules, every Java program ran on a flat **classpath** — a single, global namespace where any code could access any other code, leading to problems collectively known as **"classpath hell."** JPMS introduces a first-class concept of a **module**: a named, self-describing unit of code with explicit dependencies and a controlled public API. This makes large applications more maintainable, enables true encapsulation at the package level, and allows the creation of minimal custom runtime images with `jlink`.

---

## Why Modules Were Introduced

### Problems with the Classpath

- **No encapsulation across packages:** `public` meant accessible to *everyone*, even internal implementation classes.
- **Classpath hell:** Duplicate JARs, version conflicts, and JAR files with ambiguous contents caused subtle runtime errors.
- **Monolithic JDK:** The entire JDK (~60MB+) was loaded even if your app only needed 5 packages.
- **Hidden dependencies:** There was no way to declare or verify what a JAR depended on.
- **Split packages:** The same package could be spread across multiple JARs — a maintenance nightmare.

### What JPMS Provides

- **Reliable configuration:** Dependencies are declared and verified at startup, not discovered at runtime.
- **Strong encapsulation:** Internal packages are hidden unless explicitly `export`ed.
- **Reduced attack surface:** Unexported packages cannot be accessed via reflection by default.
- **Smaller deployments:** `jlink` creates a custom JRE with only the modules your app needs.
- **Clear architecture:** Module boundaries enforce good software design.

---

## `module-info.java`

Every module is defined by a `module-info.java` file placed at the **root of the module's source tree**. This file contains the module declaration and all its directives.

### Basic Syntax

```java
// src/com.example.myapp/module-info.java

module com.example.myapp {
    // Declare a dependency on another module
    requires java.sql;

    // Export a package so other modules can use it
    exports com.example.myapp.api;
}
```

### All Module Directives

```java
module com.example.service {

    // ─── REQUIRES ──────────────────────────────────────────────────
    // Depends on java.logging at compile and runtime
    requires java.logging;

    // Requires AND re-exports: any module requiring this one also sees java.sql
    requires transitive java.sql;

    // Only needed at compile time (e.g., annotation processor)
    requires static java.compiler;


    // ─── EXPORTS ───────────────────────────────────────────────────
    // All modules can access this package
    exports com.example.service.api;

    // Only specific modules can access this package (qualified export)
    exports com.example.service.internal to com.example.admin, com.example.tools;


    // ─── OPENS ─────────────────────────────────────────────────────
    // Allows deep reflection on this package (e.g. for frameworks like Spring)
    opens com.example.service.model;

    // Only specific modules can reflect into this package
    opens com.example.service.config to com.fasterxml.jackson.databind;


    // ─── SERVICES ──────────────────────────────────────────────────
    // Declares that this module uses a service (ServiceLoader)
    uses com.example.service.spi.Plugin;

    // Declares that this module provides a service implementation
    provides com.example.service.spi.Plugin
        with com.example.service.impl.DefaultPlugin;
}
```

---

## Module Directives Reference Table

| Directive | Purpose | Compile-Time | Runtime | Reflection |
|---|---|---|---|---|
| `requires M` | Depend on module M | ✓ | ✓ | — |
| `requires transitive M` | Depend on M and re-export it | ✓ | ✓ | — |
| `requires static M` | Depend on M at compile time only | ✓ | optional | — |
| `exports P` | Make package P visible to all | ✓ | ✓ | — |
| `exports P to M` | Make package P visible to module M only | ✓ | ✓ | — |
| `opens P` | Allow deep reflection into package P | — | ✓ | ✓ |
| `opens P to M` | Allow reflection into P only from module M | — | ✓ | ✓ |
| `uses S` | Declare use of service S (ServiceLoader) | — | ✓ | — |
| `provides S with I` | Provide implementation I for service S | — | ✓ | — |

---

## Named, Unnamed, and Automatic Modules

| Type | Description | Has `module-info.java`? | On Module Path? |
|---|---|---|---|
| **Named module** | Fully declared module with `module-info.java` | ✓ | ✓ |
| **Unnamed module** | Code on the **classpath** (legacy jars, no module declaration) | ✗ | ✗ (classpath) |
| **Automatic module** | JAR on the **module path** without `module-info.java` — gets a name from the JAR filename | ✗ | ✓ |

- The **unnamed module** can read all named and automatic modules, but named modules cannot `requires` the unnamed module by name.
- **Automatic modules** can read all other modules and are a bridge for migrating third-party libraries.

---

## Simple Multi-Module Maven Project

Here is a practical two-module Maven project structure:

```
my-app/
├── pom.xml                             (parent POM)
├── greeter-api/
│   ├── pom.xml
│   └── src/main/java/
│       ├── module-info.java
│       └── com/example/api/
│           └── Greeter.java
└── greeter-impl/
    ├── pom.xml
    └── src/main/java/
        ├── module-info.java
        └── com/example/impl/
            ├── Main.java
            └── EnglishGreeter.java
```

### `greeter-api` Module

```java
// greeter-api/src/main/java/module-info.java
module com.example.greeter.api {
    exports com.example.api; // Export the API package
}
```

```java
// greeter-api/src/main/java/com/example/api/Greeter.java
package com.example.api;

public interface Greeter {
    String greet(String name);
}
```

### `greeter-impl` Module

```java
// greeter-impl/src/main/java/module-info.java
module com.example.greeter.impl {
    requires com.example.greeter.api; // Depend on the API module

    // Not exporting internal package — strong encapsulation!
}
```

```java
// greeter-impl/src/main/java/com/example/impl/EnglishGreeter.java
package com.example.impl;

import com.example.api.Greeter;

public class EnglishGreeter implements Greeter {
    @Override
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
}
```

```java
// greeter-impl/src/main/java/com/example/impl/Main.java
package com.example.impl;

import com.example.api.Greeter;

public class Main {
    public static void main(String[] args) {
        Greeter greeter = new EnglishGreeter();
        System.out.println(greeter.greet("World")); // Hello, World!
    }
}
```

### Parent `pom.xml` (excerpt)

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>greeter-api</module>
        <module>greeter-impl</module>
    </modules>

    <properties>
        <maven.compiler.release>17</maven.compiler.release>
    </properties>
</project>
```

---

## Module Graph

The module graph describes how modules relate to each other through `requires` declarations. The JVM resolves and validates this graph at startup.

```
java.base  ←──── (implicitly required by all modules)
    ↑
java.logging
    ↑
com.example.greeter.api
    ↑
com.example.greeter.impl  ──→  Main (entry point)
```

- Every module implicitly `requires java.base` (no need to declare it).
- The JVM checks that all required modules are present at startup — missing modules fail fast with a clear error rather than a runtime `ClassNotFoundException`.

---

## Command-Line Module Options

| Option | Purpose | Example |
|---|---|---|
| `--module-path` | Specify where to find modules (replaces `-classpath` for modules) | `--module-path out/mods` |
| `--module` | Specify the main module and class to run | `--module com.example.impl/com.example.impl.Main` |
| `--add-modules` | Add extra modules to the module graph | `--add-modules java.xml.bind` |
| `--add-opens` | Open a package for reflection at runtime | `--add-opens java.base/java.lang=ALL-UNNAMED` |
| `--add-exports` | Export an internal package at runtime | `--add-exports java.base/sun.nio.ch=ALL-UNNAMED` |
| `--list-modules` | List all available system modules | `java --list-modules` |
| `--describe-module` | Print module descriptor | `java --describe-module java.sql` |

```bash
# Compile both modules
javac --module-source-path src -d out/mods --module com.example.greeter.api,com.example.greeter.impl

# Run
java --module-path out/mods --module com.example.greeter.impl/com.example.impl.Main
```

---

## `jlink` — Custom Runtime Images

`jlink` creates a minimal, self-contained JRE containing only the modules your application actually needs. This dramatically reduces deployment size.

```bash
# Create a custom runtime image for the greeter app
jlink \
  --module-path $JAVA_HOME/jmods:out/mods \
  --add-modules com.example.greeter.impl \
  --output dist/greeter-runtime \
  --compress=2 \
  --no-header-files \
  --no-man-pages

# Run using the custom image (no JDK needed on target machine!)
dist/greeter-runtime/bin/java \
  --module com.example.greeter.impl/com.example.impl.Main
```

A typical Spring Boot JAR might need only 30-40 modules, reducing JRE size from 300MB+ to under 50MB.

---

## Common Migration Challenges

Migrating an existing classpath-based application to modules is non-trivial. Common issues include:

### Split Packages

Two JARs containing classes in the same package — JPMS forbids this.

```
# Error example:
Error occurred during initialization of boot layer
java.lang.LayerInstantiationException: Package com.example.util in both
    module foo and module bar
```

**Fix:** Reorganize packages so each is owned by exactly one module.

### Illegal Reflective Access

Frameworks (Spring, Hibernate, Jackson) use reflection to access private fields. JPMS blocks this without an explicit `opens` directive.

```bash
# Runtime workaround (not recommended for production)
--add-opens java.base/java.lang=ALL-UNNAMED

# Proper fix in module-info.java
opens com.example.model to com.fasterxml.jackson.databind;
```

### Unnamed Module Restrictions

Named modules cannot declare `requires` on the unnamed module. Libraries on the classpath are in the unnamed module and are available to all named modules, but named modules can't selectively depend on them.

**Fix:** Move libraries to the module path (as automatic modules) or until they publish their own `module-info.java`.

### Missing Transitive Dependencies

If module A `requires transitive B`, and B in turn `requires C`, then A's users get C transitively. Getting this right during migration requires careful analysis of the dependency graph.

```java
// In your module: if you use types from java.sql in your public API,
// add requires transitive so your users don't need to declare it themselves
requires transitive java.sql;
```

---

## Key Concepts

- JPMS solves **classpath hell** by making dependencies explicit and encapsulation enforceable at the package level.
- A module is defined by **`module-info.java`** at the source root; this file declares `requires`, `exports`, `opens`, `uses`, and `provides`.
- `exports` controls **compile-time and runtime** visibility; `opens` controls **reflection** access.
- `requires transitive` re-exports a dependency to all downstream modules.
- **Named modules** have `module-info.java`; **automatic modules** are JARs on the module path without one; **unnamed modules** are on the classpath.
- `jlink` creates a **minimal custom JRE** containing only the modules needed — perfect for containers and embedded systems.
- Use `--add-opens` and `--add-exports` on the command line as a temporary migration bridge, not as a permanent solution.
- The most common migration challenges are **split packages**, **illegal reflective access**, and **unnamed module restrictions**.

---

## Try it

1. **Hello Modules:** Create a single-module project with a `module-info.java` that declares `module hello.world {}`. Add a `Main` class and compile/run it using `--module-path` and `--module`.

2. **Two-module project:** Implement the `greeter-api` / `greeter-impl` example above from scratch without Maven — using only `javac` and `java` commands. Verify that `com.example.impl` is inaccessible from outside its module.

3. **Strong encapsulation test:** In the `greeter-impl` module, create an `internal` package with a class. Verify that another module **cannot** access it (compile error), then use `exports ... to ...` to grant selective access.

4. **Service loader:** Refactor the greeter project to use the `uses`/`provides` ServiceLoader pattern. The `greeter-api` module declares `uses Greeter`; the `greeter-impl` module declares `provides Greeter with EnglishGreeter`. Load it with `ServiceLoader.load(Greeter.class)`.

5. **`jlink` image:** Run `jlink` on your greeter project and measure the size of the resulting runtime image. Compare it to the full JDK size with `du -sh`.

6. **Describe a module:** Run `java --describe-module java.sql` and `java --describe-module java.base`. Identify their `requires`, `exports`, and `opens` directives. What does `java.sql` export?

7. **Migration challenge:** Take a simple two-JAR classpath project where both JARs contain classes in the same package (split package). Observe the JPMS error when placed on the module path. Reorganize the packages to fix it.
