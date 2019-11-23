---
title: Wallaby
description: Learn about the wallaby configuration
keywords: Tools, typescript, build, wallaby
author: woksin
repository: https://github.com/dolittle-tools/TypeScript.Build
aliases: /tooling/typescript/build/wallaby
---

The [TypeScript Build Pipeline](../) removes the need for the developer to configure [Wallaby](https://wallabyjs.com/) themselves.

Based on your project structure of choice, this package will try to setup a wallaby configuration accordingly.

{{% notice warning %}}
The wallaby configuration is not easy to get right, especially when it's one configuration for different project structures like what we try to do here. If you're having any problems then please create an issue [here!](https://github.com/dolittle-tools/TypeScript.Build/issues)
{{% /notice %}}

To make use of this configuration you simply need to have a file called  'wallaby.conf.js' that looks like this:

```js
const build = require('@dolittle/typescript.build');

module.exports = build.wallaby();
```

Or with the two optional parameters: 

```js
const build = require('@dolittle/typescript.build');
let settingsCallback = (wallaby, settings) => {/* Configure the pre-configured settings here */}
let setupCallback = wallaby => {/* Configure the pre-configured setup here */}
module.exports = build.wallaby(settingsCallback, setupCallback);
```
