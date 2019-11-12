/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import {Exception} from '@dolittle/tooling.common.utilities';

/**
 * The exception that gets thrown when a path is expected to be a directory, but isn't
 *
 * @export
 * @class PathIsNotDirectory
 * @extends {Exception}
 */
export class PathIsNotDirectory extends Exception {
    /**
     * Instantiates an instance of {PathIsNotDirectory}.
     * @param {string} path
     */
    constructor(path: string) {
        super(`'${path}' is not a directory`)
    }
}