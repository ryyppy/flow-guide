# Flow Guide 

This repository aims to be a newbie-guide for writing typed JavaScript with
Facebook's Flow - a static type checker for JavaScript (http://flowtype.org).

We will first discover how to set up our tools to get us running. Afterwards, we
will dive into some examples of how we can leverage types to make our JavaScript
code more predictable and even maybe more robust.

# How to set up your Flowtyped Project

We assume that you are using following toolchain:

* Babel 6 for transpiling ES6 -> ES5 code
* ESlint for style checking
* Flow >= 0.28.0

We will discuss the most minimalistic setup to get our tools running with `flow`.
In this project we also added additional configuration like airbnb eslint rules, so
don't get confused by that.

## Flow Installation

```bash
# Either install it locally as npm-package
npm install flow-bin --save-dev

# Or globally via brew
brew install flow
```

## Babel 6 Configuration

Since Flow's syntax supports an extended set of JavaScript, it is required to
strip away all Flow-Type code before execution.

This can be done via the `transform-flow-strip-types` babel-plugin.

```bash
# Install babel stuff with ES6 support (you probably already did that)
npm install babel babel-cli babel-core babel-preset-es2015 --save-dev

# Now install flow related stuff 
npm install babel-plugin-transform-flow-strip-types --save-dev
```

After installation, add the plugin to your `.babelrc` file (or wherever your
babel is being configured):

```json
{
  "plugins": [ "transform-flow-strip-types" ]
}
```

Now, babel will always strip away `flow` source and your JS runtime can interpret
the code. This is especially important for feeding `eslint`, so let's look into
its configuration.

## ESLint Configuration

Now that our babel configuration allows us to parse Flow typed JavaScript, we
can now utilize the `babel-eslint` parser to pass in sanatized JavaScript code.
Although this would already work by now, there will be some warnings about
unused variables whenever you write type declarations.

The `eslint` plugin `eslint-plugin-flow-vars` will mute those warnings, so let
us install all the eslint stuff we need:

```bash
# ESlint stuff (you probably already did that)
npm install eslint babel-eslint --save-dev

# Now the flow related stuff
npm install eslint-plugin-flow-vars
```

Done! Now if we run `eslint src/some.js`, eslint should run through and there
shouldn't be any errors because of unknown syntax.

## Editor Integration 

We can recommend following editor `flow` plugins:

* Atom: [`nuclide`](https://atom.io/packages/nuclide) (available in the `atom` package manager) 
* Vim: [vim-flow](https://github.com/flowtype/vim-flow)
* NeoVim: TBD (blog)
* Sublime: [Sublime-Flow](https://github.com/73rhodes/Sublime-Flow) & [SublimeLinter-Flow](https://github.com/SublimeLinter/SublimeLinter-flow)

For some plugins, make sure your `flow` installation is in your `$PATH`
variable, otherwise some plugins might not pick up the `flow` executable, or
even worse, pick up the wrong version of it.

# Using flow

First of all, before you can even use `flow`, you need to create a `.flowconfig`
in your local project's folder. This can be done by running `flow init`, which
will create a very basic INI file.

By default, `flow` will run a local server, which will parse your project for
`js` and `json` files, so you might see some problems with third-party
`node_modules` dependencies, which might contain stuff like malformed JSON files
or other unuseful stuff. For these edge-cases, you can put a regex matcher in
your `.flowconfig`'s `[ignore]` section, which will cause the program to skip
these defined files.

The `flow` server will provide important endpoints for retreiving data about
parsed files, so it is usually launched by your IDE / Text-Editor (if you installed
the proper plugins of course). Without that architecture, auto-completion would
be hard, so we should appreciate that awesome feature!

## Let us write some type-safe code! 

To ease you in, we will get you familiar with `flow`'s syntax and try to give
you a general idea of how its type inference works. All examples are listed in
the repositories `./tutorial` directory.

The best way to enjoy this tutorial is to clone this repository and open your
favorite editor to open the tutorial directory, read through the files and play
around with the code. See what happens if you change things, try to break things
intentionally and get a grasp of how `flow`'s error messages lead you to your
mistakes.

The tutorial gradually introduces flow concepts file by file (directory by
directory), so make sure to read the files in order. Comments will lead you
through the important sections of the code. To code grows while we introduce new
concepts, sometimes we detach from previous examples, sometimes we built upon
them. Don't get confused by previous examples, just concentrate on the current
context (imports etc.) and you should be fine ;-)

Tutorial Chapters:
* 00 - Basics
* 01 - React

Enjoy!

# Runtastic Flow Style Guide

This repository also contains the [style guide](styleguide/) we use for our flowtyped projects.
Maybe you find it useful as a reference or as a starter for your own rules.

We started this documentation as we are quite early `flow` adopters and aren't aware of any resources
for best practises, so we thought it would be a good idea to get the discussion going!

So if you have any input or questions, be free to open an issue!

## Extras 

* Write Robust & Type-Safe JavaScript with Flow
  ([Video](https://www.youtube.com/watch?v=R_B9KgUxPls) / [Presentation](https://speakerdeck.com/ryyppy/write-robust-and-type-safe-javascript-with-flow))
