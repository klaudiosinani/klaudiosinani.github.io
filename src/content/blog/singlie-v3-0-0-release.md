---
author: Klaudio Sinani
pubDatetime: 2025-11-09T18:36:27Z
modDatetime:
ogImage: header.jpeg
title: "Singlie: v3.0.0 Release"
slug: singlie-v3-0-0-release
featured: false
draft: false
tags:
  - release
  - singlie
  - data-structures
  - typescript
description: A complete TypeScript rewrite
---

*A complete TypeScript rewrite.*

## Introduction

The new v3.0.0 [Singlie](https://klaudiosinani.com/singlie) release provides a fully typed TypeScript implementation of
singly circular and linear linked list data structures, accompanied by extensive parameterized and property-based test
suites, comprehensive CI/CD automation on [GitHub Actions](https://github.com/klaudiosinani/singlie/actions), and formal
DOI registration via [Zenodo](https://zenodo.org/records/17564945).

## Major Changes: TypeScript Rewrite

The new version introduces a complete rewrite from JavaScript to TypeScript, bringing fundamental improvements:

**Full Type Safety**

All data structures now support generics, enabling compile-time validation of type correctness. Users can now catch type
errors during development rather than discovering them at runtime:

```typescript
const list = new Linear<string>();
list.append('hello', 'world');

// TypeScript catches type errors at compile time
// list.append(42); // Type error
```

**Modern Testing Infrastructure**

Jest testing with property-based testing via fast-check provides comprehensive coverage:

- 60+ parameterized test cases covering standard operations
- 10+ property-based tests that automatically generate edge cases
- Type definitions validated through test compilation

**Enhanced Developer Experience**

IDE autocompletion, inline documentation, and type inference make working with the library now significantly more
intuitive and error-resistant than the previous JavaScript version.

**Automated CI/CD Pipeline**

GitHub Actions now validates every commit across multiple Node.js versions and automatically publishes to the NPM
registry when version tags are created via the trusted publisher framework.

**Digital Object Identifier Attribution**

Singlie has been assigned a Digital Object Identifier - DOI via
Zenodo, [10.5281/zenodo.17563627](https://zenodo.org/records/17564945), enabling proper citation in academic work and
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

More information regarding the citation can be found in the [CITATION.cff](https://github.com/klaudiosinani/singlie/blob/master/CITATION.cff) file.

## Breaking Changes

Two methods have been removed in favor of TypeScript's type system:

- **`List#isCircular(): boolean`** — Removed
- **`List#isLinear(): boolean`** — Removed

**Migration**:

```typescript
// Before (v2.1.0 JavaScript)
const list = new Circular();
if (list.isCircular()) { /* ... */ }

// After (v3.0.0 TypeScript)
const list = new Circular<T>();
// TypeScript knows the type; use instanceof only if needed
if (list instanceof Circular) { /* ... */ }
```

## API Reference

Singlie exposes a fluent API with 25 methods organized across capability interfaces:

### Properties

- **`head: Node<T> | null`** — The first node in the list
- **`last: Node<T> | null`** — The last node in the list
- **`length: number`** — Total number of nodes

### Core Operations

- **`append(...values: T[]): List<T>`** — Append one or more nodes to the end
- **`prepend(...values: T[]): List<T>`** — Prepend one or more nodes to the beginning
- **`insert(options: {value: T | T[], index: number}): List<T>`** — Insert nodes at specific index
- **`remove(index: number): List<T>`** — Remove node at specific index
- **`clear(): List<T>`** — Remove all nodes from the list
- **`get(index: number): T`** — Get value at specific index
- **`set(options: {value: T, index: number}): List<T>`** — Set value at specific index
- **`node(index: number): Node<T>`** — Get node at specific index
- **`isEmpty(): boolean`** — Check if a list is empty

### Iteration & Transformation

- **`forEach(consumer: Consumer<T>): List<T>`** — Execute consumer for each value returning the instance
- **`map<U>(mapper: Mapper<T, U>): List<U>`** — Transform values to a new list
- **`filter(predicate: Predicate<T>): List<T>`** — Filter values based on predicate to a new list
- **`reduce<U>(reducer: Reducer<T, U>, initialValue: U): U`** — Reduce to single value
- **`reverse(): List<T>`** — Reverse the order of nodes to a new list

### Search Operations

- **`includes(value: T): boolean`** — Check if value exists in a list
- **`indexOf(value: T): number`** — Find index of value (-1 if not found)

### Serialization

- **`toArray(): T[]`** — Convert list to array
- **`toString(): string`** — Convert list to comma-separated string
- **`join(separator?: string): string`** — Join values with custom separator

### Conversion

- **`toCircular(): Circular<T>`** — Convert linear list to new circular list *(Linear only)*
- **`toLinear(): Linear<T>`** — Convert circular list to new linear list *(Circular only)*

### Type Aliases

The library uses standardized function type aliases for a better developer experience:

- **`Consumer<T>`** — `(value: T) => void` for forEach operations
- **`Predicate<T>`** — `(value: T) => boolean` for filter operations
- **`Mapper<T, U>`** — `(value: T) => U` for map transformations
- **`Reducer<T, U>`** — `(accumulator: U, value: T) => U` for reduce operations

## Installation

To install the new version, run the command below:

```bash
npm install singlie@v3.0.0
```

## Resources

- **Singlie v3.0.0 Release Notes**: [github.com/klaudiosinani/singlie/releases/tag/v3.0.0](https://github.com/klaudiosinani/singlie/releases/tag/v3.0.0)
- **Singlie Website**: [klaudiosinani.com/singlie](https://klaudiosinani.com/singlie)
- **GitHub Repository**: [github.com/klaudiosinani/singlie](https://github.com/klaudiosinani/singlie)
- **NPM Package**: [npmjs.com/package/singlie](https://www.npmjs.com/package/singlie)
- **Zenodo Publication**: [doi.org/10.5281/zenodo.17563627](https://doi.org/10.5281/zenodo.17563627)
