/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';
import { Package } from "../internal";

/**
 * Represents a project
 *
 * @export
 * @class Project
 */
export class Project {
    
    private _root: string;
    private _rootPackage: Package
    private _workspacePackages?: Package[]

    /**
     * Instantiates an instance of {Project}.
     * @param {string} [root]
     */
    constructor(root?: string) {
        this._root = root || process.env.PWD || process.cwd();
        this._rootPackage = new Package(this._root);

        if (this._rootPackage.isWorkspaces) {
            this.createWorkspacePackages();
        }
    }
    
    private createWorkspacePackages() {
        this._workspacePackages = [];
        let rootPackageObject = this._rootPackage.packageObject;
        rootPackageObject.workspaces!.forEach(_ => {
            if (isGlob(_)) {
                glob.sync(_, {absolute: true, }).forEach(workspacePath => {
                    try {
                        let packagePath = path.join(workspacePath, 'package.json')
                        this._workspacePackages!.push(new Package(packagePath));
                    } catch (error) {
                        throw Error(`Could not create Package for workspace at path`);
                    }
                });
            }
            else {
                try {
                    let packagePath = path.join(_, 'package.json')
                    this._workspacePackages!.push(new Package(packagePath));
                } catch (error) {
                    throw Error(`Could not create Package for workspace at path`);
                }
            }
        });
    }

}