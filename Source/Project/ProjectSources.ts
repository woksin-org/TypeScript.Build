/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import isGlob from 'is-glob';
import path from 'path';
import toUnixPath from 'slash';
import { YarnWorkspace } from "../internal";


/**
 * Represents a project
 *
 * @export
 * @class Project
 */
export class ProjectSources {
    
    static get sourceFileFolderName() { return 'Source'; }
    static get outputFolderName() { return 'Distribution'; }

    sourceFilesGlobPatterns = ['**/*.@(ts|js)'];
    compiledSourceFilesGlobPatterns = ['**/*.js'];
    declarationFilesGlobPatterns = ['**/*.d.ts'];
    testFilesGlobPatterns = ['**/for_*/**/!(given)/*.@(ts|js)', '**/for_*/*.@(ts|js)'];
    compiledTestFilesGlobPatterns = ['**/for_*/**/!(given)/*.js', '**/for_*/*.js'];
    testSetupFilesGlobPatterns = ['**/for_*/**/given/**/*.@(ts|js)'];

    private _sourceFilesRoot: string
    private _outputFolder?: string
    private _tsConfig?: string

    private _allSourceFilesGlobs: string[]
    private _declarationFilesGlobs: string[]
    private _testFileGlobs: string[]
    private _testSetupFileGlobs: string[]
    private _compiledFilesGlobs: string[]
    private _compiledTestsGlobs: string[]

    constructor(private _rootFolder: string, private _workspaces: YarnWorkspace[] = []) {
        this._sourceFilesRoot = this.getSourceFilesRoot();
        this._outputFolder = this.getOutputFolder();
        this._tsConfig = this.getTsConfig();
        
        this._allSourceFilesGlobs = this.createSourceFileGlobs(...this.sourceFilesGlobPatterns);
        this._declarationFilesGlobs = this.createCompiledFileGlobs(...this.declarationFilesGlobPatterns);
        this._testFileGlobs = this.createSourceFileGlobs(...this.testFilesGlobPatterns);
        this._testSetupFileGlobs = this.createSourceFileGlobs(...this.testSetupFilesGlobPatterns);
        this._compiledFilesGlobs = this.createCompiledFileGlobs(...this.compiledSourceFilesGlobPatterns);
        this._compiledTestsGlobs = this.createCompiledFileGlobs(...this.compiledTestFilesGlobPatterns);
    }

    /**
     * Gets the root folder
     *
     * @readonly
     */
    get rootFolder() {
        return this._rootFolder;
    }
    /**
     * Gets the root folder for the source files
     *
     * @readonly
     */
    get sourceFilesRoot() {
        return this._sourceFilesRoot;
    }

    /**
     * Gets the globs for all the source files in the project
     *
     * @readonly
     */
    get sourceFileGlobs() {
        return this._allSourceFilesGlobs;
    }

    /**
     * Gets the globs for all the compiled files in the project
     *
     * @readonly
     */
    get compiledFilesGlobs() {
        return this._compiledFilesGlobs;
    }

    /**
     * Gets the globs for the declaration files in the project
     *
     * @readonly
     */
    get declarationFilesGlobs() {
        return this._declarationFilesGlobs;
    }

    /**
     * Gets the globs for all test files in the project
     *
     * @readonly
     */
    get testFileGlobs() {
        return this._testFileGlobs;
    }

    /**
     * Gets the globs for all the test setup files in the project
     *
     * @readonly
     */
    get testSetupFileGlobs() {
        return this._testSetupFileGlobs;
    }

    /**
     * Gets the globs for all compiled tests in the project.
     *
     * @readonly
     */
    get compiledTestsGlobs() {
        return this._compiledTestsGlobs;
    }

    /**
     * Gets the absolute path to the output folder of this project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    get outputFolder() {
        return this._outputFolder;
    }

    /**
     * Gets the absolute path to the tsconfig of this project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    get tsConfig() {
        return this._tsConfig;
    }

    private getSourceFilesRoot() {
        let sourceFolder = path.join(this._rootFolder, ProjectSources.sourceFileFolderName);
        return fs.existsSync(sourceFolder) && fs.statSync(sourceFolder).isDirectory()? sourceFolder : this._rootFolder;
    }
    
    private getOutputFolder() {
        return this._workspaces.length > 0? undefined : path.join(this._rootFolder, ProjectSources.outputFolderName);
    }

    private getTsConfig() {
        return this._workspaces.length > 0? undefined : path.join(this._rootFolder, 'tsconfig.json');
    }
    
    private createCompiledFileGlobs(...globPatterns: string[]) {
        if (this._workspaces.length > 0) {
            let globs: string[] = []
            this._workspaces.forEach(workspace => globs.push(...this.createProjectFileGlobs(workspace.sources.outputFolder!, globPatterns)));
            return globs;
        } else {
            return this.createProjectFileGlobs(this.outputFolder!, globPatterns)
        }
    }

    private createSourceFileGlobs(...globPatterns: string[]) {
        let globs = [];

        if (this._workspaces.length > 0)
            this._workspaces.forEach(workspace => globs.push(...this.createProjectFileGlobs(workspace.sources.sourceFilesRoot, globPatterns)));
        else 
            globs.push(...this.createProjectFileGlobs(this.sourceFilesRoot, globPatterns));

        globs.push('!**/node_modules/**/*', `!${toUnixPath(this.rootFolder)}/wallaby.conf.js`, `!${toUnixPath(this.rootFolder)}/Gulpfile.js`, `!${toUnixPath(this.rootFolder)}/gulpfile.js`);
        return globs;
    }

    private createProjectFileGlobs(rootFolderAbsolutePath: string, globPatterns: string[]) {
        globPatterns.forEach(globPattern => {
            if (!isGlob(globPattern)) throw new Error(`'${globPattern}' is not a valid glob pattern`);
        });
        return this.getAbsoluteGlobs(rootFolderAbsolutePath, globPatterns);
    }

    private getAbsoluteGlobs(rootFolder: string, globPatterns: string[]) {
        let globs: string[] = [];
        globPatterns.forEach(globPattern => globs.push(`${toUnixPath(rootFolder)}/${globPattern}`));
        return globs;
    }
}
