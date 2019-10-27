/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';
import { Package, ProjectSources } from "../internal";

/**
 * Represents a project
 *
 * @export
 * @class Project
 */
export class Project {

    private _root: string
    private _rootPackage: Package
    private _workspacePackages: Package[] = []
    private _sources: ProjectSources

    /**
     * Instantiates an instance of {Project}.
     * @param {string} [root] The root folder of the project
     */
    constructor(root?: string) {
        this._root = root !== undefined? path.resolve(root) : process.cwd();
        this._root
        this._rootPackage = new Package(this._root);

        if (this._rootPackage.hasWorkspaces()) {
            this.createWorkspacePackages();
        }
        this._sources = new ProjectSources(this._root, this._workspacePackages);
    }
    /**
     * Gets the absolute path to the root folder
     *
     * @readonly
     */
    get root() {
        return this._root;
    }
    /**
     * Gets the root {Package} for this project
     *
     * @readonly
     */
    get rootPackage() {
        return this._rootPackage;
    }
    /**
     * Gets the the {Package} for each yarn workspace
     *
     * @readonly
     */
    get workspacePackages() {
        return this._workspacePackages;
    }
    /**
     * Gets the {Sources} for this project
     *
     * @readonly
     */
    get sources() {
        return this._sources;
    }
    /**
     * Whether or not this project has yarn workspaces
     *
     * @returns
     */
    hasWorkspaces() {
        return this._workspacePackages !== undefined && this._workspacePackages.length > 0;
    }
    
    private createWorkspacePackages() {
        this._workspacePackages = [];
        let rootPackageObject = this._rootPackage.packageObject;
        rootPackageObject.workspaces!.forEach(workspace => {
            if (isGlob(workspace)) {
                glob.sync(workspace, {absolute: true, }).forEach(workspacePath => {
                    try {
                        this._workspacePackages.push(new Package(workspacePath, this._rootPackage));
                    } catch (error) {
                        throw Error(`Could not create Package for workspace at path`);
                    }
                });
            }
            else {
                try {
                    this._workspacePackages.push(new Package(workspace, this._rootPackage));
                } catch (error) {
                    throw Error(`Could not create Package for workspace at path`);
                }
            }
        });
    }
}
