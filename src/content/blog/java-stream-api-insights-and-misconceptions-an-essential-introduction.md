---
author: Klaudio Sinani
pubDatetime: 2024-10-29T21:10:00Z
modDatetime:
ogImage: header.jpeg
title: 'Java Stream API: Insights and Misconceptions' 
slug: java-stream-api-insights-and-misconceptions
featured: false
draft: false
tags:
  - java
  - stream-api
  - white-paper
description:
  An essential introduction
---

## Purpose

The main purpose of this publication is to focus on and clarify a few common misconceptions about the Stream API while highlighting some key properties of Java streams.

Usually, these misconceptions present themselves during the design, implementation, or review phase of solutions involving streams in their implementation, and can act as a trigger for very interesting discussions among engineers.

In order to manage to dispel any misconceptions surrounding the Stream API, someone needs to understand and internalize the actual behavior of streams in Java.

For that reason, via clear and practical examples, we will attempt to illustrate these misconceptions and provide insight into key properties of streams, aiming to help you as the reader avoid common pitfalls and write more efficient, maintainable code when working with Java streams.

## Introduction

The Java Stream API was introduced back in Java 8, as a feature that would enable the processing of element sequences in a functional and declarative style. By design, the API aimed to simplify and optimize complex data manipulation tasks, which previously relied on iterative, verbose, costly, maintenance and scalability-wise, constructs.

Their introduction, along with the introduction of other features, like lambda expressions and the `java.util.function` package in general, marked a significant point in the evolution of Java, adding significant new capabilities inspired by the functional paradigm. This enabled the production of cleaner, more expressive, concise, and easier-to-parallelize code.

In practical terms, the Stream API provides a framework for processing data structures, like lists, sets, etc,  through a series of streamlined operations, that include filtering, mapping, reducing, etc. By using these declarative operations we can express data transformations more intuitively and work with collections of objects in a more functional, efficient, and effective approach.

## Properties

### Streams are lazy

#### Common misconception

> Execution of operations on streams is immediate.

#### Explanation

One of the defining feature of streams is *lazy evaluation*. Intermediate operations, such as `map`, `filter`, & `sorted` do not process data until a terminal operation, e.g. `collect`, `forEach`, is invoked. This enables to only process as much data as required and when it is absolutely required, optimizing performance by avoiding unnecessary computations.

Let's look into an example demonstrating stream laziness.

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

Stream<Integer> numbersStream = numbers.stream()
    .peek(number -> logger.log("Peek operation: " + number))
    .filter(number -> {
        logger.log("Filter operation: " + number);
        return number % 2 == 0;
    })
    .map(number -> {
        logger.log("Map operation: " + number);
        return number * 2;
    });

logger.log("Stream defined, awaiting execution.");

logger.log("Initializing execution.");
numbersStream.forEach(number -> logger.log("ForEach operation: " + number));
```

In the example, we can observe the following:

1. A stream is created out of the list of numbers: `numbers.stream()`
2. Intermediate operations are declared:
    - `peek`: logs each number
    - `filter`: filters in even numbers
    - `map`: multiples each even number by 2
3. None of the operations are executed immediately, that's why the message: `"Stream defined, awaiting execution."` is logged first
4. The terminal operation `forEach` is invoked and the stream processes each element on demand.
    - For each element, the stream navigates through peek, filter, map, and finally forEach
    - The logs display each step as it happens, validating the claim that each element is processed only when needed by the terminal operation.

Our observations can be validated by the log output of our code below.

```plaintext
Stream defined, awaiting execution.
Initializing execution.
Peek operation: 1
Filter operation: 1
Peek operation: 2
Filter operation: 2
Map operation: 2
ForEach operation: 4
Peek operation: 3
Filter operation: 3
Peek operation: 4
Filter operation: 4
Map operation: 4
ForEach operation: 8
Peek operation: 5
Filter operation: 5
```

## Streams are single-use

### Common misconception

> Streams can be re-used like collections or iterators

### Explanation

Once a terminal operation is invoked on a stream, the stream is considered `closed` or `consumed`, and it can not be reused, thus Java Streams are considered strictly single-use.

Attempting to reuse the same stream results in an `IllegalStateException`.

This single-use property allows the API to stay efficient, stateless, and predictable, making it easier to build complex data transformations while managing resources effectively and aligning with the functional paradigm, discouraging side effects.

Let's look into an example demonstrating the single-use property of streams.

```java
List<String> names = List.of("Alice", "Bob", "Charlie");

// Create a stream and perform a terminal operation
names.stream().forEach(name -> logger.log("Hello, " + name));

var nameStream = names.stream();
nameStream.forEach(name -> logger.log("Goodbye, " + name));

// Attempt to reuse the same stream - this will cause an IllegalStateException
nameStream.forEach(name -> logger.log("This will cause an error!"));
```

In our code example, we can observe the following:

1. We first create a stream from the list of names
2. Using `forEach` we print a greeting for each name.
3. `ForEach` is a terminal operation, thus it consumes the stream.
4. When we attempt to use `forEach` again, an `IllegalStateException` is thrown since `nameStream` is exhausted after the first use.

We can confirm our observations via the log output of our code example.

```plaintext
Hello, Alice
Hello, Bob
Hello, Charlie
Goodbye, Alice
Goodbye, Bob
Goodbye, Charlie
Exception in thread "main" java.lang.IllegalStateException: stream has already been operated upon or closed
```

## Steams can be short-circuited

### Common misconception

> The full underlying source is always processed by a stream.

### Explanation

The short-circuiting property of Java streams allows certain operations to stop processing as soon as a condition is fulfilled. This can optimize our stream's performance by reducing unnecessary computations.

The short-circuiting property is particularly useful when working with large data sets where unnecessary processing can be avoided. It can take place when using terminal operations, e.g. `findFirst`, `findAny`, etc, as well as when using the `limit` operation in combination with other intermediate operations.

Let's view an example demonstrating the short-circuiting property of streams.

```java
List<Integer> numbers = List.of(1, 3, 5, 6, 7, 8);

logger.log("Initiating stream processing.");

boolean hasEvenNumber = numbers.stream()
    .peek(number -> logger.log("Peek operation: " + number))
    .anyMatch(number -> number % 2 == 0); // Stops at the first even number

logger.log("hasEvenNumber? " + hasEvenNumber);
```

In the example we can observe the following:

1. The `peek` operation is used to log each element as it's processed by the stream
2. The`anymatch` operation checks if there are any even numbers in the list
3. `anyMatch` stops the processing once it finds the first even number, in our case that number is `6`
4. The elements of the underlying `number` collection, `7` and `8`, are never consumed by the stream

The above demonstrates the short-circuiting behavior, as the stream pipeline terminates as soon as the predicate in the `anyMatch` operation is satisfied, skipping the rest of the elements.

We can validate our observation also by looking into the log output of our code example.

```plaintext
Initiating stream processing.
Peek operation: 1
Peek operation: 3
Peek operation: 5
Peek operation: 6
hasEvenNumber? true
```

## Streams can be infinite

### Common isconception

> Streams represent finite memory-safe data sequences.

### Explanation

Java streams can be `infinite`, meaning they can generate an unbounded sequence of elements without a predefined end.

This capability is particularly useful for modeling data sources that grow continuously, like event logs, sensor data, or even mathematical sequences. 

Infinite streams are typically created using the `Stream.generate` or `Stream.iterate` factory methods. These methods, also known as *stream sources*, create an infinite sequence of elements based on a supplier function (`generate`) or a seed and a unary operator (`iterate`).

However, infinite streams must be combined with short-circuiting operations to avoid infinite processing. Without such operations, processing an infinite stream would run indefinitely, leading to resource exhaustion.

Let's dive into an "infinite" example.

```java
logger.log("Generating an infinite stream of natural numbers");

Stream.iterate(1, number -> number + 1) // Starts from 1 and keeps adding 1 indefinitely
    .peek(number -> logger.log("Peek operation: " + number)) // Log each number
    .limit(5) // Short-circuit after 5 elements
    .forEach(number -> logger.log("ForEach operation: " + number));
```

We can make the following observation for our example:

1. The invoke `Stream.iterate` stream source with a seed value of `1` and the unary operator `number -> number + 1`
2. The outcome is the creation of an infinite stream of natural numbers starting from 1
3. The `peek` operation logs each number processed by the stream
4. The `limit(5)`  short-circuiting intermediate operation stops the stream after processing the first five numbers 
5. That prevents the infinite execution of our stream
6. Finally, we invoke the `forEach` terminal operation to re-log the first five natural numbers and consume the stream

Our short example demonstrates how infinite streams can produce unbounded sequences, but short-circuiting allows us to control processing, stopping when needed. Without the usage of the `limit` operation, our stream would continue indefinitely, since in our example a `non-short-circuit` operation like `forEach` consumes the produced infinite stream.

Below we can inspect the log output of our example code and validate our observations accordingly.

```plaintext
Generating an infinite stream of natural numbers.
Peek operation: 1
ForEach operation: 1
Peek operation: 2
ForEach operation: 2
Peek operation: 3
ForEach operation: 3
Peek operation: 4
ForEach operation: 4
Peek operation: 5
ForEach operation: 5
```

## Streams can fuse loops

### Common misconception

> Each intermediate operation results in a separate iteration over the underlying source.

### Explanation

The Java Stream API internally employees an optimization mechanism, called Loop Fusion. This mechanism aims to combine multiple sequential operations on a stream into a single pass, thereby reducing the overhead of iterating through the underlying data source multiple times.

This significantly favors and improves performance, particularly when dealing with large datasets that require the execution of multiple operations for filtering, mapping, and collecting.

By merging operations, loop fusion minimizes the number of temporary objects created, leading to lower memory consumption and garbage collection overhead.

In other words, this optimization mechanism can enhance the efficiency of code while allowing us to preserve a clean, readable, and declarative syntax.

Let's look into a short practical example.

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

// Chained Stream Operations with log Statements
int result = numbers.stream()
    .map(n -> {
        int doubled = n * 2; // Double each number
        logger.log("Map: " + n + " to " + doubled);
        return doubled;
    })
    .filter(n -> {
        boolean isGreaterThanFive = n > 5; // Filter numbers greater than 5
        logger.log("Filter: " + n + " > 5? " + isGreaterThanFive);
        return isGreaterThanFive;
    })
    .map(n -> {
        int incremented = n + 1; // Add 1 to each filtered number
        logger.log("Map: " + n + " to " + incremented);
        return incremented;
    })
    .reduce(0, (subtotal, element) -> {
        int newTotal = subtotal + element; // Sum the results
        logger.log("Reduce: " + subtotal + " + " + element + " = " + newTotal);
        return newTotal;
    });

logger.log("Final Result: " + result); // Output: Final Result: 15
```

By running the code in our example we receive the following log output:

```plaintext
Map: 1 to 2
Filter: 2 > 5? false
Map: 2 to 4
Filter: 4 > 5? false
Map: 3 to 6
Filter: 6 > 5? true
Map: 6 to 7
Reduce: 0 + 7 = 7
Map: 4 to 8
Filter: 8 > 5? true
Map: 8 to 9
Reduce: 7 + 9 = 16
Map: 5 to 10
Filter: 10 > 5? true
Map: 10 to 11
Reduce: 16 + 11 = 27
Map: 6 to 12
Filter: 12 > 5? true
Map: 12 to 13
Reduce: 27 + 13 = 40
Final Result: 40
```

Now, based on the structure of the code in our example and the log output we can observe the following points:

- **Single Traversal**: The Stream API processes the source data in a single pass, applying the multiple operations (mapping, filtering, and reducing) efficiently without separate iterations for each operation.
- **Immediate Execution**: Each element is transformed and evaluated sequentially. Intermediate operations, like `map` and `filter`, are applied directly to the results of the previous operation, allowing for immediate processing without intermediate collections.
- **Efficient Reduction**: The `reduce` terminal operation accumulates results only from elements that have passed through the state of the `filter` operation, thus ensuring that the final computation is performed efficiently in a single pass, thus again minimizing overhead.
- **Clear Data Flow**: The stream's processing model promotes readable and maintainable code. It clearly expresses the data transformation of our constructed pipeline, while highlighting purely on what is our final objective rather than how the mechanics of the iteration are structured.

## Streams can be parallelized

### Common misconception

> Converting a sequential stream to parallel always leads to better performance

## Explanation

The parallelization property of Java streams allows for concurrent processing of data, leveraging multiple threads to enhance performance when operating on large datasets.

By simply switching from a sequential stream to a parallel stream, operations are conducted in parallel, enabling the use of available CPU cores. This can significantly reduce execution time, especially for CPU-intensive tasks, as the workload is distributed across multiple threads.

These benefits come with a caveat, as parallel streams are not guaranteed to always be faster than sequential ones. For smaller datasets or less complicated operations, the overhead of managing multiple threads can overshadow the benefits of parallelization.

That is why in some cases, it can very well be that a sequential stream may outperform a parallel one due to less costly overhead.

Now, let's look into an example show-casing this behavior.

First, we define a simple time measuring method, that accepts a `Runnable` and logs its total execution time in microseconds.

```java
public void logExecutionTime(String taskTitle, Runnable task) {
    long startTime = System.nanoTime();

    task.run();

    long duration = TimeUnit.NANOSECONDS.toMicros( System.nanoTime() - startTime);

    logger.log(format("[%s] executed in: %d microseconds", taskTitle, duration));
}
```

Next we define two methods performing essential the same task. The only different will be that one is using a sequential stream while the other one a parallel.

```java
private static int filterAndSumInSequence(List<Integer> integers, int threshold) {
    return integers
        .stream()
        .filter(number -> number > threshold)
        .map(number -> number * 2)
        .reduce(0, Integer::sum);
}

private static int filterAndSumInParallel(List<Integer> integers, int threshold) {
    return integers
        .stream()
        .parallel()
        .filter(number -> number > threshold)
        .map(number -> number * 2)
        .reduce(0, Integer::sum);
}
```

As input to our methods we will generate and provide a collection of 1000 integers.
We compare the execution times of both methods across 10 consecutive iterations, in order to reinforce our results.

```java
List<Integer> integers = IntStream.range(0, 1000)
    .boxed()
    .toList();

for (int i = 0; i < 10; i++) {
    logger.log("Iteration: " + i);
    logExecutionTime("Sequential Task", () -> filterAndSumInSequence(integers, 500));
    logExecutionTime("Parallel Task", () -> filterAndSumInParallel(integers, 500));
}
```

By executing our code on a 20-core machine we receive the following log output.

```plaintext
Iteration: 0
[Sequential Task] executed in: 2200 microseconds
[Parallel Task] executed in: 3038 microseconds

Iteration: 1
[Sequential Task] executed in: 126 microseconds
[Parallel Task] executed in: 377 microseconds

Iteration: 2
[Sequential Task] executed in: 68 microseconds
[Parallel Task] executed in: 369 microseconds

Iteration: 3
[Sequential Task] executed in: 47 microseconds
[Parallel Task] executed in: 326 microseconds

Iteration: 4
[Sequential Task] executed in: 69 microseconds
[Parallel Task] executed in: 377 microseconds

Iteration: 5
[Sequential Task] executed in: 57 microseconds
[Parallel Task] executed in: 272 microseconds

Iteration: 6
[Sequential Task] executed in: 45 microseconds
[Parallel Task] executed in: 346 microseconds

Iteration: 7
[Sequential Task] executed in: 53 microseconds
[Parallel Task] executed in: 201 microseconds

Iteration: 8
[Sequential Task] executed in: 34 microseconds
[Parallel Task] executed in: 149 microseconds

Iteration: 9
[Sequential Task] executed in: 26 microseconds
[Parallel Task] executed in: 301 microseconds
```

It is clear from the results that the sequential stream is more performant across all 10 iterations compared to the parallel one, taking on average 272 microseconds to execute the task, versus an average execution time of 575.6 microseconds needed by the parallel one.

This showcases the fact that for smaller datasets, where rather uncomplicated operations are required, the functional cost of parallel streams related to their inner thread management, can overshadow the benefits of parallelization itself.

## Streams can be costly

### Common misconception

> A stream is always automatically optimizing its operation pipeline.

### Explanation

While the Stream API is optimized for common patterns, there can be cases where pipelines can be quite inefficient, especially due to a lack of thoughtful design. Thus the statement that "stream pipelines automatically optimize performance” is not fully valid.

Let's look at a few key factors.

#### 1. Lazy Evaluation vs Automatic Optimization

As mentioned before, one key feature of streams is **lazy evaluation**. Intermediate operations like `filter`, `map`, and `sorted` are only executed when a terminal operation (e.g., `collect`, `reduce`, `forEach`) is invoked. This helps defer computation and potentially decrease the amount of work done in the pipeline. 

However, lazy evaluation on its own doesn’t mean the stream pipeline is automatically optimized for every scenario. The Stream API does not inherently optimize the order or combination of operations. It just evaluates them in the order they have been declared. This means that poorly structured pipelines can lead to potential inefficiencies.

#### 2. Operation Order

The sequence of operations in a stream pipeline can greatly affect performance, especially when working with large datasets requiring complicated transformations.

For example, operations like `filter` reduce the number of elements passed down the stream. By setting the `filter` operation early in the pipeline, we can achieve a decrease in the workload for subsequent operations.

```java
Set<String> words = Set.of("ab", "abcd", "efgh", "cd", "klmn");

// Here, filtering first reduces the number of elements that go through the `map` operation.
List<String> result = words.stream()
    .filter(word -> word.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

Additionally, if we are interested only in a limited number of results, placing `limit()` as early as possible can prevent unnecessary computation on remaining elements.

```java
Set<String> words = Set.of("ab", "abcd", "efgh", "cd", "klmn");

// Limit early to stop after the first 2 elements
List<String> result = words.stream()
    .filter(word -> word.length() > 3)
    .limit(2) 
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

### 3. Managing Costly Operations

Certain operations, like `sorted` and `distinct`, require more computational effort and they can easily cause substantial overhead if not used thoughtfully.

- **`sorted`**: The operation requires the comparison of all elements, which can be costly for large datasets. Using `sorted` should be limited to cases where order is truly essential, especially in parallel streams where it brings additional overhead to merge sorted chunks across threads.

- **`distinct`**: Τhis operation requires the check of every element against the rest to ensure successful deduplication, potentially increasing memory usage. If unique elements are needed, but order doesn’t matter, combining `distinct` with `.unordered` on a parallel stream may help improve performance.

### 4. Parallel Stream Trade-offs

Parallel streams can be helpful for CPU-bound tasks over large datasets, but they also bring complexity. As we also saw earlier, not all operations can be parallelized efficiently, and parallel streams can introduce overhead in splitting tasks, coordinating threads, and merging results. Based on that, we can make the following observations:

- Use parallel streams for operations that benefit from concurrent processing, where you have to manage large data sets and execute intensive processing
- Avoid parallel streams for small collections or when the pipeline includes operations that are difficult to parallelize

## Conclusion

In conclusion, we hope going through these lines has helped you as a reader to clear out some common misconceptions surrounding the Java Stream API and also highlight some of its key properties like laziness, single-use nature, short-circuiting, loop fusion, parallelization, etc.

By understanding these underlying behaviors, one can effectively leverage streams for more efficient, maintainable, and clean code, while avoiding common pitfalls that might not always be so visible.