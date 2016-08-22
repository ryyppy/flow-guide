# Runtastic Flow Guidelines

## Table of Contents
  0. [Preface](#preface)
  1. [Type Names](#type-names)
  2. [Type Definitions](#type-definitions)
  3. [Function Headers](#function-headers)
  4. [Type Inference](#type-inference)
  5. [Libdef Files](#libdef-files)

## Preface

This document discusses our ways of writing flow-typed JavaScript source code
for Runtastic related projects.

To stay consistent between examples, it is assumed that source code is located
in `[PROJECT]/src/` and its transpiled output in `[PROJECT]/lib/`. Paths may
vary project-wise, but we try to stick to this convention as best as possible.

**[⬆ back to top](#table-of-contents)**

## Type Names

Type names are a very important part of documentation, so it must be clear what
intentions each type has, e.g. a consumer of a type should intuitively know what
meta-type (`Object`, `Function` or primitives like `string`, `number`,...) they
represent. Also names must be unambiguous to prevent mistaking JavaScript
with Flow code.

  <a name="type-names--capitalize"></a><a name="1.1"></a>
  - [1.1](#type-names--capitalize) Capitalize & CamelCase type names

  > This will help us prevent collisions with variable names etc.

  ```
  // bad
  type foo = string;
  type myFoo = string;
  type JSONApiEntity = {};

  // good
  type Foo = string;
  type MyFoo = string;
  type JsonApiEntity = {};
  ```

  <a name="type-names--functions"></a><a name="1.2"></a>
  - [1.2](#type-names--functions) **Functions:** Add a `Fn` / `Cb` suffix to mark types as functions / callbacks

  > We realized that this naming convention was especially beneficial for our functional APIs,
  > which utilize a lot of function composition / currying / mapping etc.

  ```javascript
  // bad
  type Http = () => Promise<Object>;

  // good
  type HttpFn = () => Promise<Object>;
  type DoProfilePressFn = (profile: Object) => void;

  // also okay
  type OnProfilePressedCb = (profile: Object) => void;
  ```

**[⬆ back to top](#table-of-contents)**

## Type Definitions

When handling a complex code-base, you will find yourself in the situation where
you have to wrangle a lot with type aliases & definitions, which are eventually
dependent on eachother (and maybe spread over different files). To make things
easier to follow, we need some rough guidelines when and where it makes
sense to expose those types.

To set the stage, we are talking about type definitions like this:

```javascript
// Publicy exposed by the (sub)module
export type MyType = 'value1' | 'value2';

// Defined in the module scoped only
type LocalType = Object;

// Export forwarding
export type * from 'someTypes';
```

<a name="type-definitions--types-file"></a><a name="2.1"></a>
- [2.1](#type-definitions--types-file) **Dedicated Type Files:** Gather common types into Type files / submodules. Rule of thumb: Is a type an integral entity inside the whole module functionality? Then you probably want dedicated files.

  > Why? In many cases this reduces mental overhead whenever types of a specific category are used
  > in different parts of the application / library. Also those files make a great target for
  > library type exports (so the types can be used in other modules as well).

  ```javascript
  // ======================
  // Example 1:
  // Here we put all unit-related Types in the src/units.js and import
  // from the same file within e.g. our formatters
  // ======================

  // src/units.js
  export type DistanceUnit = 'km'
    | 'mi'
    | 'm'
    | 'cm';

  export WeightUnit = 'kg' | 'lbs' | 'st';

  // src/format/formatWeight.js
  import type { WeightUnit } from '../units';

  export function formatWeight(value: number, unit: WeightUnit): string {
    //...
  }

  // ======================
  // Example 2:
  // For more complex collections of types, it is also totally viable to create whole
  // type submodule structures with index forwarding:
  // ======================

  // src/types/units.js
  export SomeUnit = 'x';

  // src/types/index.js
  export type * from 'units';

  // src/someConsumer.js
  import { SomeUnit } from './types';  
  ```

<a name="type-definitions--module-related-types"></a><a name="2.2"></a>
- [2.2](#type-definitions--module-related-types) **(Sub)module Related Types:** Export types which are purely related to one specific submodule / function from the same file as the implementation.

  > Why? In the contrary to the common type file, sometimes a type definition only
  > makes sense in a very specific context of a specific module / function.
  > This is especially true for function modules, which expose the function interface
  > as a type as well (for functional concepts etc.).
  >
  > Most of the time, these types are mostly so specific that you don't really
  > need to explicitly import / use them... Flow usually does a good job in inferring
  > those types anyways.

  ```javascript

  // ======================
  // Especially for these occasional util-modules, it is very common
  // to export its types directly from the same file
  // ======================

  // src/util/jsonapi.js
  export type JsonApiResponse = {
    data?: Object,
    links?: Object,
    meta?: Object,
    included?: Array<Object>,
  };

  export Entity = {
    data?: Object,
    links?: Object,
    meta?: Object,
  };

  export function denormalize(jsonApiResponse: JsonApiResponse): Entity {
    // ...
  }

  // src/someModule.js
  import type { Entity } from './util/jsonapi'; // Entity only makes sense in the jsonapi context
  ```

<a name="type-definitions--local-vs-export-types"></a><a name="2.3"></a>
- [2.3](#type-definitions--local-vs-export-types) **Local vs Export Types:** Do not unnecessarily export
types if they are not useful for other modules. Try to be consistent with names
inside a module's (say: "npm package's") scope

  > Why? Local Types are a good way to express a specific context and we are not
  > forced to import types from other files. Sometimes it is easier to just
  > rewrite types instead of centralizing them (less file dependencies).

  ```javascript
  // src/some/module.js

  // More generic names are totally okay as long as they are scoped to the module
  type Options = { test: string };

  export function foo(options: Options): string {
    return 'bar';
  }
  ```
<a name="type-definitions--prevent-name-collisions"></a><a name="2.4"></a>
- [2.4](#type-definitions--prevent-name-collisions) **Prevent Name Collisions:** Do not export multiple types from different submodules with the same name inside a module's scope.

  > This will prevent name collisions, whenever we try to do an `export type * from './mytypes';`
  > and also prevent confusion on the module level.

  **Bad:**

  ```javascript
  // src/format1.js
  export type FormatFn = (arg: Object) => string;

  // src/format2.js
  export type FormatFn = (arg: number) => string;

  // src/index.js
  export type * from './format1';
  export type * from './format2';

  // test.js
  import type { FormatFn } from './src'; // ??? What type is FormatFn ???
  ```

  **Good:**

  ```javascript
  // src/format1.js
  export type FormatObjectFn = (arg: Object) => string;

  // src/format2.js
  export type FormatNumberFn = (arg: number) => string;

  // src/index.js
  export type * from './format1';
  export type * from './format2';

  // test.js
  import type { FormatObjectFn } from './src'; // Nice!
  ```

<a name="type-definitions--typeof"></a><a name="2.5"></a>
- [2.5](#type-definitions--typeof) **The typeof Operator**: Use the `typeof` operator to reflect type information of a specific function / class. (Details: https://flowtype.org/docs/typeof.html)

  > Why? Before we learned about the existance of the `typeof` operator, we defined concrete
  > function definitions as types by duplicating the interface, which makes maintanence a little
  > bit more tedious

  **Bad:**

  ```javascript
  // src/convert.js
  type ConvertFn = (to: Unit, unitValue: ?UnitValue) => ?UnitValue;
  function convert(to: Unit, unitValue: ?UnitValue): ?UnitValue { /* ... */ }
  ```

  **Good:**

  ```javascript
  // src/convert.js
  type ConvertFn = typeof convert; // Much more DRY approach
  function convert(arg: HttpArg): Promise<HttpResult> { /* ... */ }

  // it's also viable to do typeof operations on the fly!
  import { convert } from './src/convert';

  function higherOrderStuff(convertFn: typeof convert) { /* ... */ }
  ```

**[⬆ back to top](#table-of-contents)**

## Function Headers

In many situations, you will end up with some very complex function parameter
lists or return types, which are getting messy to read after the addition of flow-types,
if you don't stick to a guideline.

Here we will give some hints how to handle these situations appropriately.

<a name="function-headers--complex-arguments"></a><a name="3.1"></a>
- [3.1](#function-headers--complex-arguments) **Complex Arguments**: Try not to inline `Function` or `Object` definitions in
function headers (especially for export functions).

  > Why? Because inlined Function / Object definitions are a nightmare to read
  > and most of the time explicitly defined types are easier to maintain.

  **Bad:**

  ```javascript
  // Inline types makes it kinda hard to read, mkay?
  function someFunc(option1: { a: string, b: string }, cb: (a: Object) => string): Promise<string> {
      // Function body
  }
  ```

  **Good:**

  ```javascript
  // Explicit types makes it a little bit easier on the eyes
  type Option = {
    a: string,
    b: string,
  };

  type CallbackFn = (a: Object) => string;

  function something(option: Option, cb: CallbackFn): Promise<string> {
    // Function body
  }
  ```

<a name="function-headers--complex-return-values"></a><a name="3.2"></a>
- [3.2](#function-headers--complex-return-values) **Complex Return Values**: Don't inline
  complex Object / Function types as return types (primitives are fine).

  > Why? Readablity

  ```javascript
  // bad
  function createObject(a: string, b: string): { a: string, b: Function } { /* ... */ }

  // good
  type SomeObj = { a: string, b: string };
  function createObject(a: string, b: string): SomeObj { /* ... */ }

  // also good
  function something(): Promise<string> { /* ... */ }
  ```

<a name="function-headers--long-argument-lists"></a><a name="3.3"></a>
- [3.3](#function-headers--long-argument-lists) **Long Argument Lists**: If the function definition reaches the line max-len, put arguments in separate lines.

  ```javascript
  // bad
  function something(arg1: string, arg2: string, arg3: string, arg4: string, arg5: string): string {
    /* ... */
  }

  // good
  function something(
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string,
    arg5: string,
    ): string {
      /* ... */
  }

  // also good with certain limit
  function something(arg1: string, arg2: number, arg3: Object): string {
    /* ... */
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Type Inference

<a name="type-inference--exported-interfaces"></a><a name="4.1"></a>
- [4.1](#type-inference--exported-interfaces) **Exported Interfaces**: Always fully annotate interfaces which are
exposed via the `export` keyword

  > Why? Flow will report exported values without annotations as an error to prevent
  > undocumented public interfaces.

  ```javascript
  // bad
  export function foo(arg) {
    // Usually, flow could infer the types, but since it is exported,
    // it will report an error
    return `${arg} - foo`;
  }

  // good
  export function foo(arg: string): string {
    return `${arg} - foo`; // This will work
  }
  ```


<a name="type-inference--non-exported-interfaces"></a><a name="4.2"></a>
- [4.2](#type-inference--non-exported-interfaces) **Non-Exported Interfaces**: Utilize the inference system
for arrow functions, function body code as much as possible.

  > Why? Flow does a really good job inferring (guessing) your types.
  > You don't have to worry about uncovered edge-cases. If flow cannot infer a
  > type, it will report an error and will ask for more annotations.

  **Bad:**

  ```javascript
  const list: Array<string> = ['foo', 'bar']; // unnecessarily verbose

  // Don't do this annotation madness... Flow can guess this super easily
  list.reduce((result: string, next: string): string => `${result},${next}`, '');
  ```

  **Good:**

  ```javascript
  const list = ['foo', 'bar'];

  list.reduce((result, next) => `${result},${next}`, '');
  ```

**[⬆ back to top](#table-of-contents)**

## Libdef Files

<a name="libdef-files--shadow-files"></a><a name="5.1"></a>
### [5.1](#libdef-files--shadow-files) Using and Vendoring `js.flow` Files ("Shadow Files")

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

<a name="libdef-files--external-libdef-files"></a><a name="5.1"></a>
### [5.2](#libdef-files--external-libdef-files) External Libdef Files

In many occassions, it is not viable to follow the `js.flow` approach,
many times you will find yourself in following scenarios:

  + Modules are not typed with `flow`
  + Modules are consumed as single `min.js` file (UMD, AMD,..)
  + Modules / Tools require a specific global environment (e.g. `mocha`)

Since we try to achieve a 100% `flow` coverage, there needs to be a balance
between value gain of using another node-module and type-safetiness.

For maintaining and retrieving libdef files of more popular projects we use
[flow-typed](https://github.com/flowtype/flow-typed). By default, the `flow-typed`
cli binary will install downloaded libdef files in `[PROJECT]/flow-typed/npm`,
which are tagged by `flow` & `module` version. These files **always** have to be tracked
in git.

Whenever you use flow-typed, make sure to add the path `flow-typed/` in the `[LIB]` section
of your project's `.flowconfig`. Otherwise, `flow` might not pick up the libdef files.

If you have to write a libdef on your own, make sure to put these definitions directly
in the `flow-typed`, but not in the `flow-typed/npm` subdirectory.

**[⬆ back to top](#table-of-contents)**
