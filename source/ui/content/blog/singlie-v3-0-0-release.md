---
author: Klaudio Sinani
pubDatetime: 2025-11-09T18:36:27Z
modDatetime:
title: "Singlie: v3.0.0 Release"
slug: singlie-v3-0-0-release
featured: false
draft: false
sector: academic
tags:
  - release
  - singlie
  - data-structures
  - typescript
description: "A complete TypeScript rewrite of the singly linked list library, with full generics, parameterized and property-based tests, and a registered DOI."
---

_A complete TypeScript rewrite._

## Introduction

Version `3.0.0` of [Singlie](https://klaudiosinani.com/singlie) is now available.

Singlie supplies two data structures: a singly linear linked list and a singly circular linked list. This release is a
complete rewrite in TypeScript, and the implementation is now fully typed.

The release also adds these items:

- Large test suites with parameterized tests and property-based tests.
- Full CI/CD automation on [GitHub Actions](https://github.com/klaudiosinani/singlie/actions).
- A formal DOI registration on [Zenodo](https://zenodo.org/records/17564945).

## Major Changes: TypeScript Rewrite

The new version is a complete rewrite from JavaScript to TypeScript. The rewrite gives these improvements:

**Full Type Safety**

All the data structures now support generics. Therefore the compiler can validate the types. You find the type errors
during development, and not when the program runs:

```typescript
const list = new Linear<string>();
list.append("hello", "world");

// The compiler finds the type errors before the program runs
// list.append(42); // Type error
```

**New Test Suite**

The tests use Jest. The property-based tests use fast-check. The suite contains:

- More than 60 parameterized tests for the standard operations.
- More than 10 property-based tests. These tests make the edge cases automatically.
- A compilation test that validates the type definitions.

**Support in the Editor**

The editor now shows the completions, the documentation and the inferred types. Therefore the library is easier to use
than the previous JavaScript version, and you make fewer errors.

**Automatic CI/CD Pipeline**

GitHub Actions now validates each commit on more than one version of Node.js. When you create a version tag, the
pipeline publishes the package to the NPM registry. It uses the trusted publisher framework.

**Digital Object Identifier**

Zenodo assigned a Digital Object Identifier (DOI) to Singlie:
[10.5281/zenodo.17563627](https://zenodo.org/records/17564945). You can now cite the library in academic work and in
research publications:

```bibtex
@software{Sinani_Singlie_Singly_circular_2025,
author = {Sinani, Klaudio and Sinani, Mario A.},
doi = {10.5281/zenodo.17563627},
license = {MIT},
month = nov,
title = {{Singlie: Singly circular and linear linked lists}},
url = {https://github.com/klaudiosinani/singlie},
version = {3.0.0},
year = {2025}
}
```

The [CITATION.cff](https://github.com/klaudiosinani/singlie/blob/master/CITATION.cff) file contains more information
about the citation.

## Breaking Changes

This release removes two methods. The type system of TypeScript replaces them:

- **`List#isCircular(): boolean`** — Removed.
- **`List#isLinear(): boolean`** — Removed.

**Migration**:

```typescript
// Before (v2.1.0, JavaScript)
const list = new Circular();
if (list.isCircular()) {
  /* ... */
}

// After (v3.0.0, TypeScript)
const list = new Circular<T>();
// The compiler knows the type. Use instanceof only if you must test at runtime.
if (list instanceof Circular) {
  /* ... */
}
```

## API Reference

Most methods return a list. Therefore you can connect the calls in a chain. The sections that follow group the
properties and the methods by function.

### Properties

- **`head: Node<T> | null`** — The first node in the list. It is `null` if the list is empty.
- **`last: Node<T> | null`** — The last node in the list. It is `null` if the list is empty.
- **`length: number`** — The number of nodes in the list.

### Core Operations

- **`append(...values: T[]): List<T>`** — Adds one or more nodes to the end of the list.
- **`prepend(...values: T[]): List<T>`** — Adds one or more nodes to the start of the list.
- **`insert(options: {value: T | T[], index: number}): List<T>`** — Adds one or more nodes at the given index.
- **`remove(index: number): List<T>`** — Removes the node at the given index.
- **`clear(): List<T>`** — Removes all the nodes from the list.
- **`get(index: number): T`** — Returns the value at the given index.
- **`set(options: {value: T, index: number}): List<T>`** — Changes the value at the given index.
- **`node(index: number): Node<T>`** — Returns the node at the given index.
- **`isEmpty(): boolean`** — Returns `true` if the list has no nodes.

### Iteration and Transformation

- **`forEach(consumer: Consumer<T>): List<T>`** — Calls the consumer one time for each value. Returns the same list.
- **`map<U>(mapper: Mapper<T, U>): List<U>`** — Applies the mapper to each value. Returns a new list.
- **`filter(predicate: Predicate<T>): List<T>`** — Keeps the values that agree with the predicate. Returns a new list.
- **`reduce<U>(reducer: Reducer<T, U>, initialValue: U): U`** — Combines all the values into one value.
- **`reverse(): List<T>`** — Returns a new list with the nodes in the opposite order.

### Search Operations

- **`includes(value: T): boolean`** — Returns `true` if the list contains the value.
- **`indexOf(value: T): number`** — Returns the index of the value. Returns `-1` if the list does not contain it.

### Serialization

- **`toArray(): T[]`** — Returns the values as an array.
- **`toString(): string`** — Returns the values as one string with a comma between each value.
- **`join(separator?: string): string`** — Returns the values as one string with the given separator between them.

### Conversion

- **`toCircular(): Circular<T>`** — Returns a new circular list with the same values. _Linear lists only._
- **`toLinear(): Linear<T>`** — Returns a new linear list with the same values. _Circular lists only._

### Type Aliases

The library declares a type alias for each function that you supply to it:

- **`Consumer<T>`** — `(value: T) => void`. Use it with `forEach`.
- **`Predicate<T>`** — `(value: T) => boolean`. Use it with `filter`.
- **`Mapper<T, U>`** — `(value: T) => U`. Use it with `map`.
- **`Reducer<T, U>`** — `(accumulator: U, value: T) => U`. Use it with `reduce`.

## Installation

To install the new version, run the command that follows:

```bash
npm install singlie@v3.0.0
```

## Resources

- **Singlie v3.0.0 Release Notes**: [github.com/klaudiosinani/singlie/releases/tag/v3.0.0](https://github.com/klaudiosinani/singlie/releases/tag/v3.0.0)
- **Singlie Website**: [klaudiosinani.com/singlie](https://klaudiosinani.com/singlie)
- **GitHub Repository**: [github.com/klaudiosinani/singlie](https://github.com/klaudiosinani/singlie)
- **NPM Package**: [npmjs.com/package/singlie](https://www.npmjs.com/package/singlie)
- **Zenodo Publication**: [doi.org/10.5281/zenodo.17563627](https://doi.org/10.5281/zenodo.17563627)
