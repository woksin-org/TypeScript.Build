---
title: Wallaby
description: Learn about the wallaby configuration
keywords: Tools, typescript build pipeline 
author: woksin
repository: https://github.com/dolittle-tools/TypeScript.Build
---

The [TypeScript Build Pipeline](../) removes the need for the developer to configure [Wallaby](https://wallabyjs.com/).

To make use of this configuration you simply need to have a file called  'wallaby.conf.js' that looks like this:

```js
const build = require('@dolittle/typescript.build');

module.exports = build.wallaby(build.wallabyBabelConfig);
```