/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import isGlob from 'is-glob';
import path from 'path';
import toUnixPath from 'slash';
import { Package } from "../internal";


/**
 * Represents a project
 *
 * @export
 * @class Project
 */
export class ProjectSources {
    
    static get sourceFileFolderNames() { return ['Source']; }
    static get outputFolderName() { return 'Distribution'; }

    private _allSourceFilesGlobs: string[] = []
    private _declarationFilesGlobs: string[] = []
    private _testFileGlobs: string[] = []
    private _testSetupFileGlobs: string[] = []
    private _compiledFilesGlobs: string[] = []

    private _compiledTestsGlob?: string
    private _outputFolder?: string
    private _declarationsOutputFolder?: string
    private _tsConfig?: string

    constructor(private _rootFolder: string, private _workspacePackages: Package[] = []) {
        this.setOutputFolder();
        this.setDeclarationsOutputFolder();
        this.setTsConfig();
        this.setCompiledTestsGlob();
        this.createAllSourceFileGlobs();
        this.createDeclarationFilesGlobs();
        this.createTestFileGlobs();
        this.createTestSetupFileGlobs();
        this.createCompiledFilesGlobs();
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
     * Gets the glob for all compiled tests in the project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    get compiledTestsGlobs() {
        return this._compiledTestsGlob;
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
     * Gets the absolute path to the output folder for declaration files for this project. If this project has workspaces thi field is undefined.
     *
     * @readonly
     */
    get declarationsOutputFolder() {
        return this._declarationsOutputFolder;
    }

    /**
     * Gets the absolute path to the tsconfig of this project. If this project has workspaces this field is undefined
     *
     * @readonly
     */
    get tsConfig() {
        return this._tsConfig;
    }

    private setOutputFolder() {
        this._outputFolder = this._workspacePackages.length > 0?
                                undefined : path.join(this._rootFolder, ProjectSources.outputFolderName);
    }
    setDeclarationsOutputFolder() {
        let sourceFolder: string | undefined;
        for (let folderName of ProjectSources.sourceFileFolderNames) {
            let folderPath = path.join(this._rootFolder, folderName);
            if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
                sourceFolder = folderName;
            }
        }
        let sourceFilesRoot = sourceFolder === undefined? this._rootFolder : path.join(this._rootFolder, sourceFolder);
        this._declarationsOutputFolder = this._workspacePackages.length > 0?
                                undefined : sourceFilesRoot;
    }
    private setCompiledTestsGlob() {
        this._compiledTestsGlob = this._workspacePackages.length > 0?
                                undefined : toUnixPath(`${path.join(this._rootFolder, ProjectSources.outputFolderName)}/**/for_*`);
    }
    private setTsConfig() {
        this._tsConfig = this._workspacePackages.length > 0?
                                undefined : path.join(this._rootFolder, 'tsconfig.json');
    }
    private createAllSourceFileGlobs() {
        this.createSourceFileGlobs(this._allSourceFilesGlobs, '**/*.ts');
    }
    private createDeclarationFilesGlobs() {
        this.createSourceFileGlobs(this._declarationFilesGlobs, '**/*.d.ts');
    }
    private createTestFileGlobs() {
        this.createSourceFileGlobs(this._testFileGlobs, '**/for_*/**/!(given)/*.ts', '**/for_*/*.ts')
    }
    private createTestSetupFileGlobs() {
        this.createSourceFileGlobs(this._testSetupFileGlobs, '**/for_*/**/given/**/*.ts')
    }
    private createCompiledFilesGlobs() {
        this._compiledFilesGlobs = [];
        if (this._workspacePackages.length > 0) {
            this._workspacePackages.forEach(workspacePackage => {
                this._compiledFilesGlobs.push(`${toUnixPath(path.join(workspacePackage.rootFolder, ProjectSources.outputFolderName))}/**`);
            });
        } else {
            this._compiledFilesGlobs.push(`${toUnixPath(path.join(this._rootFolder, ProjectSources.outputFolderName))}/**`);
        }
    }

    private createSourceFileGlobs(globs: string[], ...globPatterns: string[]) {
        globPatterns.forEach(globPattern => {
            if (!isGlob(globPattern)) throw new Error(`'${globPattern}' is not a valid glob pattern`);
        });
        if (this._workspacePackages.length > 0) {
            this._workspacePackages.forEach(workspacePackage => this.pushGlobs(workspacePackage.rootFolder, globs, globPatterns));
        }
        else {
            let sourceFolder: string | undefined;
            for (let folderName of ProjectSources.sourceFileFolderNames) {
                let folderPath = path.join(this._rootFolder, folderName);
                if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
                    sourceFolder = folderName;
                }
            }
            let sourceFilesRoot = sourceFolder === undefined? this._rootFolder : path.join(this._rootFolder, sourceFolder);
            this.pushGlobs(sourceFilesRoot, globs, globPatterns);
            
        }
    }
    private pushGlobs(rootFolder: string, globs: string[], globPatterns: string[]) {
        globPatterns.forEach(globPattern => globs.push(`${toUnixPath(rootFolder)}/${globPattern}`));
    }
}
