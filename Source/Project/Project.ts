/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';
import fs from 'fs';
import { Package } from "../internal";

export const sourceFileFolderNames = [
    'Source',
    "Features"
]
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

    private _sourceFileGlobs: string[] = []
    private _testFileGlobs: string[] = []
    private _testSetupFileGlobs: string[] = []

    /**
     * Instantiates an instance of {Project}.
     * @param {string} [root] The root folder of the project
     */
    constructor(root?: string) {
        this._root = root !== undefined? path.resolve(root) 
                        : process.env.PWD || process.cwd();
        this._rootPackage = new Package(this._root);

        if (this._rootPackage.hasWorkspaces) {
            this.createWorkspacePackages();
        }
        this.createSourceFileGlobs();
        this.createTestFileGlobs();
        this.createTestSetupFileGlobs();
    }

    get root() {
        return this._root;
    }

    get rootPackage() {
        return this._rootPackage;
    }

    get workspacePackages() {
        return this._workspacePackages;
    }

    get sourceFileGlobs() {
        return this._sourceFileGlobs;
    }

    hasWorkspaces() {
        return this._workspacePackages !== undefined && this._workspacePackages.length > 0;
    }

    isWorkspace() {
        return this._rootPackage.isWorkspace();
    }
    
    private createWorkspacePackages() {
        this._workspacePackages = [];
        let rootPackageObject = this._rootPackage.packageObject;
        rootPackageObject.workspaces!.forEach(_ => {
            if (isGlob(_)) {
                glob.sync(_, {absolute: true, }).forEach(workspacePath => {
                    try {
                        let packagePath = path.join(workspacePath, 'package.json')
                        this._workspacePackages.push(new Package(packagePath, this._rootPackage));
                    } catch (error) {
                        throw Error(`Could not create Package for workspace at path`);
                    }
                });
            }
            else {
                try {
                    let packagePath = path.join(_, 'package.json')
                    this._workspacePackages.push(new Package(packagePath, this._rootPackage));
                } catch (error) {
                    throw Error(`Could not create Package for workspace at path`);
                }
            }
        });
    }

    private createSourceFileGlobs() {
        this.createGlobs(this._sourceFileGlobs, '**/*.ts');
    }
    private createTestFileGlobs() {
        this.createGlobs(this._testFileGlobs, '**/for_*/**/!(given)/*.ts', '**/for_*/*.ts')
    }
    private createTestSetupFileGlobs() {
        this.createGlobs(this._testSetupFileGlobs, '**/for_*/**/given/**/*.ts')
    }

    private createGlobs(globs: string[], ...globPatterns: string[]) {
        globPatterns.forEach(globPattern => {
            if (!isGlob(globPattern)) throw new Error(`'${globPattern}' is not a valid glob pattern`);
        });
        globs = []
        if (this.isWorkspace()) {
            globs.push(...globPatterns);
        } 
        else {
            let sourceFolder: string | undefined;
            let rootAbsolutePath = path.resolve(this._root);
            for (let folderName of sourceFileFolderNames) {
                let folderAbsolutePath = path.join(rootAbsolutePath, folderName);
                if (fs.existsSync(folderAbsolutePath) && fs.statSync(folderAbsolutePath).isDirectory()) {
                    sourceFolder = folderName;
                    break;
                }
            }
            
            if (this.hasWorkspaces()) {
                if (sourceFolder === undefined) 
                    throw new Error(`No source folder matching any of: [${sourceFileFolderNames.join(', ')}] was found in under folder '${rootAbsolutePath}'`)
                this._workspacePackages.forEach(workspacePackage => {
                    globPatterns.forEach(globPattern => {
                        globs.push(`${sourceFolder}/${path.basename(path.dirname(workspacePackage.path))}/${globPattern}`);

                    })
                });
            }
            else {
                if (sourceFolder === undefined) globs.push(...globPatterns);
                else {
                    globPatterns.forEach(globPattern => {
                        globs.push(`${sourceFolder}/${globPattern}`);
                    });
                }
            } 
        } 
    }
}
