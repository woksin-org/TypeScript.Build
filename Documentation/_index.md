---
title: Typescript Build Pipeline
description: Learn about our pipeline for building typescript applications
keywords: Tools, typescript build pipeline 
author: woksin
weight: 1
repository: https://github.com/dolittle-tools/TypeScript.Build
---

We have a common [Typescript Build Pipeline](https://www.github.com/dolittle-tools/TypeScript.Build) that bundles all the tools that we use for setting up our TypeScripts projects.

Essentially all this package does is provide the building blocks you'd need for a TypeScript project using Mocha + Sinon + Chai for testing. We build upon this package and extend it in order for us to provide pre-configured build packages for building TypeScript libraries using gulp and node, and client applications using webpack.