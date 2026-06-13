# Installing Java & Setting Up the Development Environment

Java development requires a few one-time setup steps before you can write and run your first program. This topic walks you through understanding the Java platform components, downloading and installing the JDK, configuring your system environment, choosing an IDE, and compiling and running a simple Java program entirely from the command line.

---

## JDK vs JRE vs JVM

Before installing anything, it is important to understand the three layers of the Java platform:

| Component | Full Name | Purpose | Who Needs It |
|-----------|-----------|---------|--------------|
| **JVM** | Java Virtual Machine | Executes Java bytecode on the host OS | Part of JRE/JDK |
| **JRE** | Java Runtime Environment | JVM + standard class libraries (runs Java apps) | End users |
| **JDK** | Java Development Kit | JRE + compiler (`javac`), debugger, tools | Developers |

### How They Relate

```
JDK
 └── JRE
      └── JVM
```

- **JVM** is platform-specific (different binary for Windows/macOS/Linux) but runs the same `.class` bytecode everywhere — this is the *"write once, run anywhere"* promise.
- **JRE** adds the Java standard library (`java.lang`, `java.util`, etc.) on top of the JVM.
- **JDK** adds the compiler (`javac`), the archiver (`jar`), the documentation generator (`javadoc`), and other developer tools on top of the JRE.

> **Rule of thumb:** As a developer, always install the **JDK**. The JRE alone cannot compile code.

---

## Choosing a Java Version

Java follows a release cadence with **Long-Term Support (LTS)** versions that receive updates for years.

| Version | Type | Status |
|---------|------|--------|
| Java 8  | LTS  | Extended support (legacy) |
| Java 11 | LTS  | Still widely used |
| Java 17 | LTS  | Widely adopted |
| **Java 21** | **LTS** | **Recommended (current LTS)** |
| Java 22/23 | Feature | Short-term, cutting-edge |

**Java 21 LTS** is the recommended version for new projects because it is stable, widely supported by frameworks, and includes modern language features like records, sealed classes, pattern matching, and virtual threads.

---

## Downloading JDK 21

The most popular open-source, production-ready JDK distribution is **Eclipse Temurin** from [adoptium.net](https://adoptium.net).

### Steps

1. Open your browser and navigate to **[https://adoptium.net](https://adoptium.net)**
2. Select **Temurin 21 (LTS)** from the version dropdown.
3. Choose your **Operating System** and **Architecture** (x64 for most desktops; ARM64 for Apple Silicon Macs).
4. Click **Download** to get the installer (`.msi` on Windows, `.pkg` on macOS, `.deb`/`.rpm`/`.tar.gz` on Linux).

> Other trusted distributions: [Oracle JDK](https://www.oracle.com/java/), [Amazon Corretto](https://aws.amazon.com/corretto/), [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk).

---

## Installing Java

### Windows

1. Run the downloaded `.msi` installer.
2. Follow the wizard — accept defaults (installs to `C:\Program Files\Eclipse Adoptium\jdk-21...`).
3. The installer can automatically set `JAVA_HOME` and update `PATH` — check both checkboxes if offered.
4. Click **Finish**.

### macOS

1. Double-click the downloaded `.pkg` file.
2. Follow the installer prompts (requires administrator password).
3. JDK installs to `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home`.

### Linux (Debian/Ubuntu — via package manager)

```bash
# Add the Adoptium APT repository
wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo apt-key add -
echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" \
  | sudo tee /etc/apt/sources.list.d/adoptium.list

# Install Temurin 21
sudo apt update
sudo apt install temurin-21-jdk
```

### Linux (Fedora/RHEL — via DNF)

```bash
sudo dnf install temurin-21-jdk
```

---

## Setting JAVA_HOME

`JAVA_HOME` is an environment variable that tells tools (Maven, Gradle, IDEs) where the JDK lives.

### Windows

1. Press `Win + S`, search **"Edit the system environment variables"** → click it.
2. Click **Environment Variables…**
3. Under **System variables**, click **New…**
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-21.0.x.x-hotspot` *(adjust to your actual path)*
4. Click **OK**.

### macOS / Linux

Add the following to your shell profile (`~/.zshrc` for Zsh, `~/.bashrc` or `~/.bash_profile` for Bash):

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
# Linux example:
# export JAVA_HOME=/usr/lib/jvm/temurin-21-amd64
```

Then reload:

```bash
source ~/.zshrc   # or source ~/.bashrc
```

---

## Adding Java to PATH

`PATH` tells your terminal which directories to search for executable programs like `java` and `javac`.

### Windows

1. In the **Environment Variables** dialog, find **Path** under **System variables** → click **Edit…**
2. Click **New** and add: `%JAVA_HOME%\bin`
3. Click **OK** on all dialogs.

### macOS / Linux

Append to the same profile file:

```bash
export PATH="$JAVA_HOME/bin:$PATH"
```

Then `source` the file again.

---

## Verifying the Installation

Open a new terminal / Command Prompt and run:

```bash
java -version
```

Expected output (version numbers may differ slightly):

```
openjdk version "21.0.3" 2024-04-16 LTS
OpenJDK Runtime Environment Temurin-21.0.3+9 (build 21.0.3+9)
OpenJDK 64-Bit Server VM Temurin-21.0.3+9 (build 21.0.3+9, mixed mode, sharing)
```

Then verify the compiler:

```bash
javac -version
```

Expected output:

```
javac 21.0.3
```

If both commands print version information, your Java installation is complete and working.

---

## Choosing an IDE

An Integrated Development Environment (IDE) dramatically speeds up Java development with code completion, refactoring, debugging, and build-tool integration.

| Feature | **IntelliJ IDEA** | **VS Code** | **Eclipse** |
|---------|-------------------|-------------|-------------|
| **Best for** | Professional Java/Spring dev | Lightweight / multi-language | Legacy enterprise projects |
| **Java support** | First-class, built-in | Via Extension Pack for Java | Built-in |
| **Debugger** | Excellent | Good | Good |
| **Refactoring** | Industry-leading | Basic–Good | Good |
| **Build tool integration** | Maven, Gradle (native) | Maven, Gradle (via extensions) | Maven, Gradle (via plugins) |
| **Community Edition** | Free & open-source | Free & open-source | Free & open-source |
| **Performance** | Heavier (more RAM) | Lightweight | Medium |
| **Spring Boot support** | Excellent (Ultimate) | Good (Spring Boot Extension) | Good (STS plugin) |
| **Learning curve** | Medium | Low | Medium–High |

### Recommended Setup

- **Beginners / Students:** VS Code with the [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
- **Professional Java development:** IntelliJ IDEA Community Edition (free) or Ultimate
- **Enterprise / existing teams:** Eclipse or IntelliJ

---

## Your First Java Program

### Step 1 — Create the File

Create a directory for your project and a file named exactly `HelloWorld.java`:

```bash
mkdir MyFirstProject
cd MyFirstProject
```

Open `HelloWorld.java` in any text editor or IDE and type:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

> **Important:** The filename must match the public class name exactly, including capitalization. `HelloWorld.java` → `public class HelloWorld`.

### Step 2 — Compile with `javac`

The Java compiler (`javac`) translates your `.java` source file into bytecode stored in a `.class` file:

```bash
javac HelloWorld.java
```

If successful, no output is printed, and a file `HelloWorld.class` appears in the directory.

```
MyFirstProject/
├── HelloWorld.java    ← source code (human-readable)
└── HelloWorld.class   ← bytecode (JVM-readable)
```

### Step 3 — Run with `java`

The `java` launcher starts the JVM and executes the bytecode:

```bash
java HelloWorld
```

Output:

```
Hello, World!
```

> Notice: you pass the **class name** (`HelloWorld`), not the filename (`HelloWorld.class`).

### Understanding Each Line

```java
public class HelloWorld {           // Class declaration — must match filename
    public static void main(String[] args) {  // Entry point — JVM calls this first
        System.out.println("Hello, World!");  // Print a line to standard output
    }
}
```

| Part | Meaning |
|------|---------|
| `public` | Accessible from anywhere |
| `class HelloWorld` | Defines a class named `HelloWorld` |
| `static` | Belongs to the class, not an instance |
| `void` | Method returns nothing |
| `main` | Special name the JVM looks for as the entry point |
| `String[] args` | Command-line arguments passed when running the program |
| `System.out.println(...)` | Prints text followed by a newline |

---

## Passing Command-Line Arguments

You can pass arguments when running your program:

```java
public class Greet {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("Hello, " + args[0] + "!");
        } else {
            System.out.println("Hello, stranger!");
        }
    }
}
```

```bash
javac Greet.java
java Greet Alice
# Output: Hello, Alice!
```

---

## Try it

1. **Install & verify:** Download JDK 21 from adoptium.net, install it, and confirm both `java -version` and `javac -version` print version 21.
2. **Hello World:** Create `HelloWorld.java`, compile it with `javac`, and run it with `java`. Confirm you see `Hello, World!` in the terminal.
3. **Experiment with args:** Write a `Greet.java` program that prints `Hello, <YourName>!` using a command-line argument. Run it with your name as the argument.
4. **IDE setup:** Install VS Code with the Extension Pack for Java (or IntelliJ IDEA Community). Open your `HelloWorld.java` file and run it from inside the IDE using the Run button. Compare the experience to the command-line approach.
5. **Breaking things (learning exercise):** Rename `HelloWorld.java` to `hello.java` and try to compile. Observe the error message and understand why Java requires the filename to match the class name.
