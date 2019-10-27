/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Package, ProjectSources } from "../internal";

export class YarnWorkspace {
    private _sources: ProjectSources

    constructor(private _workspacePackage: Package) {
        this._sources = new ProjectSources(_workspacePackage.rootFolder);
    }

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