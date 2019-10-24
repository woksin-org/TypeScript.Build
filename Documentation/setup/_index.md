---
title: Setup
description: Learn how to setup and use the typescript build pipeline
keywords: Tools, typescript build pipeline, setup
author: woksin
weight: 1
repository: https://github.com/dolittle-tools/TypeScript.Build
---

To use the TypeScript Build Pipeline, all you have to do is to add this dependency in your devDependencies in your root package.json:

```json
"devDependencies": {
    "@dolittle/typescript.build": "^1.0.0"
}
```

We have [examples](https://github.com/dolittle-tools/TypeScript.Build/tree/master/Examples) for how to set up a typescript project with both a project with a single package and multiple projects using [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) that basically has all the files and configurations you'd need to get it working. So copying all this from the folder with the strategy you want to use when starting a new project is a good start.

{{% notice info%}}
Having [Yarn](https://yarnpkg.com/lang/en/) globally installed is a pre-requisite to fully utilize this build pipeline solution.

```bash
npm i -g yarn
```
{{% /notice %}}


{{% notice info%}}
All the source files must be sitting in a folder called 'Source'. Follow the structure given in the [examples](https://github.com/dolittle-tools/TypeScript.Build/tree/master/Examples) 
{{% /notice %}}

{{% notice info%}}
We recommend to have similar configurations (package.json, tsconfig.json) as the one provided under the [examples](https://github.com/dolittle-tools/TypeScript.Build/tree/master/Examples) of the project structure you want to use.
{{% /notice %}}

