/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import isValidPath from 'is-valid-path';

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

    static get PACKAGE_NAME() { return 'package.json' }

    private _path: string
    private _packageObject: PackageObject
    
    /**
     * Instantiates an instance of {Package}.
     * @param {string} _rootFolder Path to the root of the project containing a package.json file 
     * @param {Package} [_parentPackage] The parent {Package} if this {Package} is a yarn workspace
     */
    constructor(private _rootFolder: string, private _parentPackage?: Package) {
        if (!isValidPath(this._rootFolder) || !fs.statSync(this._rootFolder).isDirectory())
        throw new Error(`Package root directory '${this._rootFolder}' is not a valid directory`)
        
        this._rootFolder = path.resolve(this._rootFolder);
        this._path = path.resolve(path.join(this._rootFolder, Package.PACKAGE_NAME));
        if (!fs.existsSync(this._path)) 
            throw new Error(`There is no package.json at path '${this._path}'`);
        
        this._packageObject = JSON.parse(fs.readFileSync(this._path) as any);
    }

    /**
     * Gets the absolute path to the package.json
     *
     * @readonly
     */
    get path() {
        return this._path;
    }

    /**
     * Gets the absolute path to the folder 
     *
     * @readonly
     */
    get rootFolder() {
        return this._rootFolder;
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
     * Gets the parent package for this yarn workspace
     *
     * @readonly
     */
    get parentPackage() {
        return this._parentPackage;
    }

    /**
     * Whether or not this is yarn workspaces root package
     *
     * @returns
     */
    hasWorkspaces() {
        return this._packageObject.workspaces !== undefined;
    }
}