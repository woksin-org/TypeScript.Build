// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
export class InvalidYarnWorkspace extends Error {
    /**
     * Instantiates an instance of {InvalidYarnWorkspace}.
     * @param {string} path
     */
    constructor(path: string, innerError?: Error) {
        super(`Could not create YarnWorkspace structure. Invalid yarn workspace at path '${path}'. ${innerError ? `Inner error message: ${innerError.message}` : ''}`);
    }
}
