// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
export class NotValidGlob extends Error {
    /**
     * Instantiates an instance of {NotValidGlob}.
     * @param {string} pattern
     */
    constructor(pattern: string) {
        super(`The pattern '${pattern}' is not a valid glob pattern`);
    }
}
