// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
export class PathIsNotDirectory extends Error {
    /**
     * Instantiates an instance of {PathIsNotDirectory}.
     * @param {string} path
     */
    constructor(path: string) {
        super(`'${path}' is not a directory`);
    }
}
