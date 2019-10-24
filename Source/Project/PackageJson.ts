/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';

export type PackageObject = {
    /**
     * Name of the package
     *
     * @type {string}
     */
    name: string,
    /**
     * Version of the package
     *
     * @type {string}
     */
    version: string,
    /**
     * The private field
     *
     * @type {boolean}
     */
    private?: boolean
    /**
     * Yarn workspaces field
     *
     * @type {string[]}
     */
    workspaces?: string[] 
}

/**
 * Represents an npm package
 *
 * @export
 * @class Package
 */
export class Package {

    private _packageObject: PackageObject
    
    /**
     * Instantiates an instance of {Package}.
     * @param {string} _packagePath Path to the package.json file absolute or relative from 
     */
    constructor(private _packagePath: string) {
        if (!fs.existsSync(this._packagePath)) throw new Error(`There is no package.json at path '${this._packagePath}'`);
        this._packageObject = JSON.parse(fs.readFileSync(this._packagePath) as any);
    }
    /**
     * Gets the absolute path to the package.json
     *
     * @readonly
     */
    get path() {
        return path.isAbsolute(this._packagePath)? this._packagePath : path.resolve(this._packagePath);
    }
    /**
     * Gets the package.json object
     *
     * @readonly
     */
    get packageObject() {
        return this._packageObject;
    }

    /**
     * Whether or not this is a private package
     *
     * @returns
     */
    isPrivate() {
        return this._packageObject.private === true;
    }

    /**
     * Whether or not this is yarn workspaces root package
     *
     * @returns
     */
    isWorkspaces() {
        return this._packageObject.workspaces !== undefined
    }

}