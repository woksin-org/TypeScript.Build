// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import { SourceFiles, OutputFiles } from './';
import { YarnWorkspace, Package } from '../';

/**
 * Represents a project's sources
 *
 * @export
 * @class Sources
 */
export class Sources {

    /**
     * Instantiates an instance of {Sources}.
     * @param {string} _rootFolder
     * @param {YarnWorkspace[]} [_workspaces=[]]
     */
    constructor(private _rootFolder: string, private _rootPackage: Package, private _workspaces: YarnWorkspace[] = []) {
        this.tsConfig = this._workspaces.length > 0 ? undefined : path.join(this._rootFolder, 'tsconfig.json');
        this.sourceFiles = new SourceFiles(this._rootFolder, this._rootPackage, this._workspaces);
        this.outputFiles = new OutputFiles(this._rootFolder, this._workspaces);

    }
    /**
     * The absolute path to the tsconfig of this project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    readonly tsConfig?: string;

    /**
     * The source files
     *
     * @type {SourceFiles}
     */
    readonly sourceFiles: SourceFiles;

    /**
     * The output files
     *
     * @type {OutputFiles}
     */
    readonly outputFiles: OutputFiles;


    /**
     * The root folder
     *
     * @readonly
     */
    get root() {
        return this._rootFolder;
    }
}
