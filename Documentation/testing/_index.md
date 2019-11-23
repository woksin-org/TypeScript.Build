---
title: Testing
description: Learn about testing in TypeScript
keywords: Tools, typescript, build, Testing
author: woksin
repository: https://github.com/dolittle-tools/TypeScript.Build
aliases: /tooling/typescript/build/testing
---

The [TypeScript Build](../) is configured to use [Mocha](https://mochajs.org). It also uses chai and sinon for assertions and mocking.

Test files should sit together with the source files and be under folders with the name pattern 'for_*'. Test files can have setup files, they are under folders named 'given', which again are also under the test folders 'for_*'.

The 'mocha.opts.js' file is used in the Gulp test task when mocha is executed. It sets up the testing environment with chai and sinon providing declarative assertions and mocking. 

jsdom-global is also used, it provides with globally defined variables that's normally available in a browser environment.  

