/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Package, ProjectSources } from "../internal";

/**
 * Represents a yarn workspace 
 *
 * @export
 * @class YarnWorkspace
 */
export class YarnWorkspace {

    constructor(private _workspacePackage: Package, private _sources: ProjectSources) {}

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
