// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { Package } from './';
import { Sources } from './Sources';

/**
 * Represents a yarn workspace
 *
 * @export
 * @class YarnWorkspace
 */
export class YarnWorkspace {

    constructor(private _workspacePackage: Package, private _sources: Sources) { }

    /**
     * Gets the {ProjectSources} for this yarn workspace
     *
     * @readonly
     */
    get sources() {
        return this._sources;
    }

    /**
     * Gets the {Package} for this yarn workspace
     *
     * @readonly
     */
    get workspacePackage() {
        return this._workspacePackage;
    }
}
