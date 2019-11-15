---
title: Tasks
description: Learn about the gulp tasks
keywords: Tools, typescript, build, tasks
author: woksin
repository: https://github.com/dolittle-tools/TypeScript.Build
aliases: /tooling/typescript/build/tasks
---

The build package centralizes the logic related to processing the packages, essentially building, testing and cleaning, removing the need for the developer to configure their own tasks and scripts.
To do this we use [Gulp](https://gulpjs.com/) to create custom and generalized tasks that can be used across any TypeScript application.

There are two ways to utilize these features. Firstly you can either have your own 'Gulpfile.js' file in the root of your project that looks like this:

Gulpfile.js (This file is optional)
```js
const build = require('@dolittle/typescript.build');
build.setupGulp(exports);
// export additional tasks...
```

Then you would need to have a couple of scripts in your package.json (all you package.json files if you're using yarn workspaces) depending on whether or not you decided to have your own Gulpfile or not:

If you don't have your own Gulpfile.js
```json
{
  "scripts": {
    "tasks": "gulp --tasks --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js",
    "clean": "gulp clean --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js",
    "build": "gulp build --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js",
    "test": "gulp test --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js",
    "test:run": "gulp test-run --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js",
    "test:clean": "gulp test-clean --gulpfile node_modules/@dolittle/typescript.build/Gulpfile.js"
}
```

and if you have your own Gulpfile.js
```json
{
  "scripts": {
    "tasks": "gulp --tasks",
    "clean": "gulp clean",
    "build": "gulp build",
    "test": "gulp test",
    "test:run": "gulp test-run",
    "test:clean": "gulp test-clean"
}
```

{{% notice info %}}
You don't need to have all these scripts, unless you're using the Dolittle Azure DevOps pipeline for TypeScript then you need all of these with those exact names.
{{% /notice %}}


{{% notice info %}}
--gulpfile must point to the Gulpfile.js file in the @dolittle/typescript.build.node package.
{{% /notice %}}

