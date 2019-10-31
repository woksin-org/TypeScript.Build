This project represents a base build pipeline for TypeScript based projects.
Everything that is common among any TypeScript project, be it a node or browser (client) based, is found here.

## Using it

The idea is that this package serves as a foundation to build specific tools for building node and browser applications.
Which means that you normally shouldn't consume this package directly. You'd want to consume the higher-level build packages specific to building certain kinds of projects.

Currently we provide build packages for a small set of project-types:

* [NodeJS Projects / Libraries](https://npmjs.org/package/@dolittle/typescript.build.node)
* Browser using Webpack (In development)
* Aurelia Client app using Webpack (In development)

## Dependencies

This project has all its dependencies as regular dependencies, which is why it is important to add a reference to
this package as a dev dependency. The reason for this is to be able to get all the packages down that the
build pipeline need onto your developer box.

## Tests

This package also provides every dependency you'd need to perform tests using the [Mocha](https://mochajs.org/) framework

## Mocking

Sinon
[To be documented]

## Assertions

Chai
Sinon Chai
Sinon Chai in Order
[To be documented]
