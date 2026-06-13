# Networking in Java

The `java.net` package gives Java programs first-class networking capabilities — from low-level socket programming to high-level HTTP communication. Java supports both **TCP** (reliable, connection-oriented) and **UDP** (fast, connectionless) protocols. The classic `Socket`/`ServerSocket` API handles TCP, `DatagramSocket` handles UDP, and `HttpURLConnection` provides HTTP access. Java 11 introduced the modern **HttpClient** API with full support for HTTP/1.1, HTTP/2, asynchronous requests, and reactive streams. Whether you're building a chat server, calling a REST API, or performing DNS lookups, Java's networking APIs have you covered.

---

## Networking Fundamentals

### TCP vs UDP

| Feature | TCP | UDP |
|---|---|---|
| Connection | Connection-oriented (handshake required) | Connectionless |
| Reliability | Guaranteed delivery and ordering | No guarantee |
| Error checking | Yes — automatic retransmission | Minimal (checksum only) |
| Speed | Slower (overhead for reliability) | Faster (low overhead) |
| Use cases | Web (HTTP/S), email, file transfer | DNS, video streaming, gaming, VoIP |
| Java classes | `Socket`, `ServerSocket` | `DatagramSocket`, `DatagramPacket` |
| Flow control | Yes | No |
| Header size | 20 bytes minimum | 8 bytes |

### Common Networking Ports

| Port | Protocol | Service |
|---|---|---|
| 21 | TCP | FTP |
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email) |
| 53 | UDP/TCP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 8080 | TCP | HTTP (alternate / dev) |

---

## TCP Client-Server with `Socket` and `ServerSocket`

TCP is the foundation of most internet communication. Java's `Socket` and `ServerSocket` classes make it straightforward to build reliable TCP applications.

### TCP Server

```java
import java.io.*;
import java.net.*;

public class TcpServer {
    public static void main(String[] args) throws IOException {
        int port = 9090;

        // Binds to port 9090 and listens for connections
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server listening on port " + port);

            while (true) { // Accept connections in a loop
                Socket clientSocket = serverSocket.accept(); // Blocks until a client connects
                System.out.println("Client connected: " + clientSocket.getInetAddress());

                // Handle this client in a new thread
                new Thread(() -> handleClient(clientSocket)).start();
            }
        }
    }

    private static void handleClient(Socket socket) {
        try (socket;
             BufferedReader  in  = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter     out = new PrintWriter(socket.getOutputStream(), true)) {

            String message;
            while ((message = in.readLine()) != null) {
                System.out.println("Received: " + message);
                out.println("Echo: " + message); // Send back to client
                if ("bye".equalsIgnoreCase(message.trim())) break;
            }
        } catch (IOException e) {
            System.err.println("Client error: " + e.getMessage());
        }
        System.out.println("Client disconnected.");
    }
}
```

### TCP Client

```java
import java.io.*;
import java.net.*;

public class TcpClient {
    public static void main(String[] args) throws IOException {
        String host = "localhost";
        int    port = 9090;

        try (Socket socket = new Socket(host, port);
             BufferedReader in   = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter    out  = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in))) {

            System.out.println("Connected to server. Type messages (or 'bye' to quit):");

            String line;
            while ((line = userInput.readLine()) != null) {
                out.println(line);                  // Send to server
                System.out.println(in.readLine());  // Read server's response
                if ("bye".equalsIgnoreCase(line.trim())) break;
            }
        }
    }
}
```

> **Run order:** Start `TcpServer` first, then `TcpClient` in a separate terminal.

---

## Multi-Threaded Server

The single-threaded server above only handles one client at a time. A real server spawns a new thread (or uses a thread pool) per client.

```java
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class MultiThreadedServer {
    public static void main(String[] args) throws IOException {
        ExecutorService pool = Executors.newFixedThreadPool(10); // Handle up to 10 clients concurrently

        try (ServerSocket serverSocket = new ServerSocket(9091)) {
            System.out.println("Multi-threaded server on port 9091");

            while (true) {
                Socket client = serverSocket.accept();
                pool.submit(() -> {
                    try (client;
                         BufferedReader in  = new BufferedReader(new InputStreamReader(client.getInputStream()));
                         PrintWriter    out = new PrintWriter(client.getOutputStream(), true)) {

                        String line;
                        while ((line = in.readLine()) != null) {
                            out.println("Server: " + line.toUpperCase());
                        }
                    } catch (IOException e) {
                        System.err.println("Error: " + e.getMessage());
                    }
                });
            }
        }
    }
}
```

---

## UDP with `DatagramSocket` and `DatagramPacket`

UDP is useful when speed matters more than reliability — live video, DNS queries, game state updates.

### UDP Server

```java
import java.net.*;

public class UdpServer {
    public static void main(String[] args) throws Exception {
        try (DatagramSocket socket = new DatagramSocket(9999)) {
            System.out.println("UDP server listening on port 9999");
            byte[] buffer = new byte[1024];

            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet); // Blocks until a packet arrives

                String received = new String(packet.getData(), 0, packet.getLength());
                System.out.println("Received: " + received);

                // Echo back to client
                byte[] response = ("Echo: " + received).getBytes();
                DatagramPacket reply = new DatagramPacket(
                    response, response.length,
                    packet.getAddress(), packet.getPort());
                socket.send(reply);
            }
        }
    }
}
```

### UDP Client

```java
import java.net.*;

public class UdpClient {
    public static void main(String[] args) throws Exception {
        try (DatagramSocket socket = new DatagramSocket()) {
            InetAddress serverAddr = InetAddress.getByName("localhost");

            String message = "Hello UDP!";
            byte[] data = message.getBytes();

            // Send
            DatagramPacket send = new DatagramPacket(data, data.length, serverAddr, 9999);
            socket.send(send);

            // Receive response
            byte[] buffer = new byte[1024];
            DatagramPacket receive = new DatagramPacket(buffer, buffer.length);
            socket.receive(receive);
            System.out.println("Server says: " + new String(receive.getData(), 0, receive.getLength()));
        }
    }
}
```

---

## HTTP with `URL` and `HttpURLConnection`

For classic HTTP communication (works in all Java versions):

### HTTP GET

```java
import java.io.*;
import java.net.*;

public class HttpGetDemo {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://jsonplaceholder.typicode.com/posts/1");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000); // 5-second connection timeout
        conn.setReadTimeout(10000);   // 10-second read timeout
        conn.setRequestProperty("Accept", "application/json");

        int statusCode = conn.getResponseCode();
        System.out.println("HTTP Status: " + statusCode);

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            System.out.println("Response: " + response);
        } finally {
            conn.disconnect();
        }
    }
}
```

### HTTP POST

```java
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

public class HttpPostDemo {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://jsonplaceholder.typicode.com/posts");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true); // Enable writing to request body
        conn.setRequestProperty("Content-Type", "application/json; utf-8");
        conn.setRequestProperty("Accept", "application/json");

        String json = """
                {
                    "title": "Java Networking",
                    "body": "Learning sockets and HTTP",
                    "userId": 1
                }
                """;

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = json.getBytes(StandardCharsets.UTF_8);
            os.write(input);
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
        conn.disconnect();
    }
}
```

---

## Java 11+ `HttpClient` (Modern API)

The `java.net.http.HttpClient` API (Java 11+) is fluent, supports HTTP/2, WebSockets, and both synchronous and asynchronous requests.

### Synchronous GET

```java
import java.net.http.*;
import java.net.URI;

public class HttpClientDemo {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(java.time.Duration.ofSeconds(10))
            .build();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/todos/1"))
            .header("Accept", "application/json")
            .GET()
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());
    }
}
```

### Asynchronous GET

```java
import java.net.http.*;
import java.net.URI;
import java.util.concurrent.CompletableFuture;

public class AsyncHttpDemo {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/users/1"))
            .build();

        CompletableFuture<HttpResponse<String>> future =
            client.sendAsync(request, HttpResponse.BodyHandlers.ofString());

        future.thenApply(HttpResponse::body)
              .thenAccept(body -> System.out.println("Async response: " + body))
              .join(); // Wait for completion
    }
}
```

### HTTP POST with `HttpClient`

```java
import java.net.http.*;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;

HttpClient client = HttpClient.newHttpClient();

String json = "{\"title\":\"Java\",\"body\":\"Networking\",\"userId\":1}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
    .header("Content-Type", "application/json")
    .POST(BodyPublishers.ofString(json))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println("Status: " + response.statusCode());
System.out.println("Body: " + response.body());
```

---

## Reading Content from a URL

```java
import java.io.*;
import java.net.URL;

public class ReadUrl {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://www.example.com");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(url.openStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}
```

---

## `InetAddress` for DNS Lookup

```java
import java.net.*;

public class DnsLookupDemo {
    public static void main(String[] args) throws UnknownHostException {
        // Forward lookup: hostname → IP
        InetAddress google = InetAddress.getByName("www.google.com");
        System.out.println("Host: " + google.getHostName());
        System.out.println("IP:   " + google.getHostAddress());

        // Reverse lookup: IP → hostname
        InetAddress loopback = InetAddress.getByName("127.0.0.1");
        System.out.println("Loopback: " + loopback.getHostName()); // localhost

        // All IPs for a hostname
        InetAddress[] addresses = InetAddress.getAllByName("www.google.com");
        for (InetAddress addr : addresses) {
            System.out.println(addr.getHostAddress());
        }

        // Local machine
        InetAddress local = InetAddress.getLocalHost();
        System.out.println("Local: " + local.getHostName() + " / " + local.getHostAddress());
    }
}
```

---

## Exception Handling in Networking

```java
import java.io.*;
import java.net.*;

public class NetworkExceptionDemo {
    public static void connect(String host, int port) {
        try {
            Socket socket = new Socket();
            // Set timeouts before connecting
            socket.connect(new InetSocketAddress(host, port), 3000); // 3s connection timeout
            socket.setSoTimeout(5000); // 5s read timeout

            // ... use socket ...
            socket.close();

        } catch (SocketTimeoutException e) {
            System.err.println("Timeout connecting to " + host + ":" + port);
        } catch (ConnectException e) {
            System.err.println("Connection refused — is the server running?");
        } catch (UnknownHostException e) {
            System.err.println("Cannot resolve hostname: " + host);
        } catch (IOException e) {
            System.err.println("I/O error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        connect("localhost", 9090);
        connect("nonexistent.host.xyz", 80);
    }
}
```

### Common Networking Exceptions

| Exception | Cause |
|---|---|
| `UnknownHostException` | Hostname cannot be resolved |
| `ConnectException` | Connection refused (server not running) |
| `SocketTimeoutException` | Read or connection timed out |
| `BindException` | Port already in use |
| `SocketException` | Low-level socket error (connection reset, etc.) |
| `IOException` | General I/O error |

---

## Key Concepts

- **TCP** guarantees reliable, ordered delivery via a connection; **UDP** is connectionless and faster but unreliable.
- `ServerSocket.accept()` blocks until a client connects; pair with a thread per connection or a thread pool for scalability.
- Always set **connection and read timeouts** (`setConnectTimeout`, `setSoTimeout`) to avoid hanging indefinitely.
- Close sockets in `try-with-resources` blocks to avoid resource leaks.
- `HttpURLConnection` works in all Java versions; prefer **`HttpClient`** (Java 11+) for HTTP/2, async requests, and cleaner API.
- `InetAddress.getByName()` performs DNS resolution; `getAllByName()` returns all IPs.
- For production servers, always use a **thread pool** (`ExecutorService`) instead of raw `new Thread()` per client.
- Use `DatagramSocket`/`DatagramPacket` for low-latency UDP communication where some packet loss is acceptable.

---

## Try it

1. **Echo server:** Build a complete TCP echo server and client. The server reads one line from the client, echoes it back in uppercase, and repeats until the client sends `"quit"`.

2. **Multi-client chat:** Extend the multi-threaded server to broadcast each client's message to all other connected clients (maintain a shared `List<PrintWriter>` of client outputs protected by `synchronized`).

3. **HTTP GET client:** Use `HttpClient` (Java 11+) to fetch data from `https://api.github.com/repos/openjdk/jdk` and print the repository name, description, and star count from the JSON response.

4. **UDP ping-pong:** Create a UDP server that replies "pong" to any "ping" message. Create a client that sends 5 "ping" messages and times how long each round trip takes using `System.currentTimeMillis()`.

5. **DNS explorer:** Write a program that accepts a list of domain names as command-line arguments and prints each domain's resolved IP addresses using `InetAddress.getAllByName()`. Handle `UnknownHostException` gracefully.

6. **Timeout handling:** Connect to `localhost:9999` (which nothing is listening on) and demonstrate catching `ConnectException`. Then connect to a real server with a 100ms timeout and catch `SocketTimeoutException`.

7. **Port scanner:** Write a simple TCP port scanner that checks which ports in the range 1–1024 are open on `localhost` by attempting `new Socket("localhost", port)` with a short timeout. Print open ports.
