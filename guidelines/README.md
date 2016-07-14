# Runtastic Flow Guidelines

This document discusses our ways of writing flow-typed JavaScript source code
for Runtastic related projects.

To stay consistent between examples, it is assumed that source code is located
in `[PROJECT]/src/` and its transpiled output in `[PROJECT]/lib/`. Pathes may
vary project-wise, but we try to stick to this convention as best as possible. 

## Defining Types 

When handling a complex code-base, you will find yourself in the situation where
you have to wrangle a lot with type aliases / definitions, which are eventually
dependent on eachother (and maybe spread over different files). To make things
easier to follow, we need some rough guidelines when and where it makes
sense to expose those types.

To clear things up, we are mostly talking about types which are defined like this:

```javascript
// Publicy exposed by the module
export type MyType = 'value1' | 'value2';

// Defined in the module scoped only
type LocalType = Object;
```

Also we will point out some examples which describe some general guidelines for
formatting typed code. 

### Local Types

TODO: Local Types

#### Functions with Long Argument Lists

TODO: Functions with Long Argument Lists

### (Sub-) Module Scoped Types

TODO: Submodule Scoped Types

#### Export Forwarding

There is a way to import and re-export types from different files, which is
inspired by the ES6 module specification:

```javascript
# src/sub/index.js

import type { MyType } from './someFunction';

export type MyType;
```

## Own & Third-Party Module Types 

### Using and Vendoring `js.flow` Files 

Flow offers different methods to infer types for third-party source code. One of
the easiest ways to vendor flow-type declarations is by copying the original
source of each vendored file and put it in an accompanying file with a
`.js.flow` suffix.

**Ideally after each build, files should end up in the project similar to
this:**

```
|- src/
   |- sub1
      |- file1.js 
|- lib/
   |- sub1
      |- file1.js 
      |- file1.js.flow 
|- ...
```

For now, we use a [bash script](guidelines/assets/flowjs_dist_example.sh)
to automatically create those `.js.flow` definitions. We will eventually work on
a platform independent solution (node?) when our requirements change. 

For our projects, we always vendor complementary `flow.js` files. Unfortunately,
we don't have a solution for minified source code yet (except for writing libdef
declarations by hand).

### Using Libdef files (External Declaration Files)

In many occassions, it is not viable to follow the `js.flow` approach,
many times you will find yourself in following scenarios:

  + Modules are not typed with `flow`
  + Modules are consumed as single `min.js` file (UMD, AMD,..)
  + Modules / Tools require a specific global environment (e.g. `mocha`)

Since we try to achieve a 100% `flow` coverage, there needs to be a balance
between value gain of using another node-module and type-safetiness.

For maintaining and retrieving libdef files of more popular projects we use
[flow-typed](https://github.com/flowtype/flow-typed). By default, `flow-typed`
will install downloaded libdef files in `[PROJECT]/flow-typed/npm`, which are
tagged by `flow` & `module` version. These files **always** have to be tracked
in git.
