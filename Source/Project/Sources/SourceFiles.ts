/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import toUnixPath from 'slash';
import { YarnWorkspace, Globs, toPatternsThatIgnoreNodeModules, asPossibleFileExtensionsPattern, createGlobPatterns, globAsAbsoluteGlob, StaticFiles } from "../../internal";


/**
 * Represents the source files
 *
 * @export
 * @class SourceFiles
 */
export class SourceFiles {
    /**
     * The name that the Source folder should have, if any
     *
     * @readonly
     * @static
     */
    static get FOLDER_NAME() { return 'Source'; }
    
    /**
     * The list of valid source file extensions 
     *
     * @readonly
     * @static
     */
    static get FILE_EXTENSIONS() { return ['ts', 'js'] }

    /**
     * The list of source file glob patterns
     *
     * @static
     */
    static sourceFilesGlobPatterns = toPatternsThatIgnoreNodeModules(`*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`);

    
    /**
     * The list of test source file glob patterns
     *
     * @static
     */
    static testFilesGlobPatterns = [
        ...toPatternsThatIgnoreNodeModules(`for_*/**/!(given)/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`), 
        ...toPatternsThatIgnoreNodeModules(`for_*/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`)
    ];
    /**
     * The list of test setup source file glob patterns
     *
     * @static
     */
    static testSetupFilesGlobPatterns = [
        ...toPatternsThatIgnoreNodeModules(`for_*/**/given/**/*${asPossibleFileExtensionsPattern(SourceFiles.FILE_EXTENSIONS)}`)
    ];

    private _underSourceFolder: boolean = false
    /**
     * Instantiates an instance of {SourceFiles}.
     * @param {string} _projectRootFolder
     * @param {YarnWorkspace[]} [_workspaces=[]]
     */
    constructor(private _projectRootFolder: string, private _workspaces: YarnWorkspace[] = []) {
        this.root = this._projectRootFolder
        
        let sourceFolder = path.resolve(this._projectRootFolder, SourceFiles.FOLDER_NAME);
        if (fs.existsSync(sourceFolder) && fs.statSync(sourceFolder).isDirectory()) {
            this._underSourceFolder = true
            this.root = sourceFolder;
        }

        this.sourceFileGlobs = this.createSourceFileGlobs(...SourceFiles.sourceFilesGlobPatterns);
        this.staticSourceFileGlobs = this.createSourceFileGlobs(...StaticFiles.staticSourceFilesGlobPatterns);
        this.testFileGlobs = this.createSourceFileGlobs(...SourceFiles.testFilesGlobPatterns);
        this.testSetupFileGlobs = this.createSourceFileGlobs(...SourceFiles.testSetupFilesGlobPatterns);
    }

    /**
     * The root folder for the source files
     *
     * @readonly
     */
    readonly root: string

    /**
     * The globs for all the source files
     *
     * @readonly
     */
    readonly sourceFileGlobs: Globs

    /**
     * The globs for all the static source files
     *
     * @readonly
     */
    readonly staticSourceFileGlobs: Globs

    /**
     * The globs for all test files
     *
     * @readonly
     */
    readonly testFileGlobs: Globs

    /**
     * The globs for all the test setup files
     *
     * @readonly
     */
    readonly testSetupFileGlobs: Globs

    private createSourceFileGlobs(...globPatterns: string[]) {
        let globs: Globs = {
            includes: [],
            excludes: []
        }
        if (this._workspaces.length > 0) this._workspaces.forEach(_ => {
            globs.includes.push(...createGlobPatterns(_.sources.sourceFiles.root, globPatterns, toUnixPath(_.sources.sourceFiles.root.replace(this._projectRootFolder, ''))))
        });
        else globs.includes.push(...createGlobPatterns(this.root, globPatterns, this._underSourceFolder === true? SourceFiles.FOLDER_NAME : undefined));

        let excludePatterns = ['node_modules/**/*', '**/node_modules/**/*', 'wallaby.conf.js', 'Gulpfile.js', 'gulpfile.js'];
        excludePatterns.forEach(globPattern => {
            globs.excludes.push({relative: globPattern, absolute: globAsAbsoluteGlob(this._projectRootFolder, globPattern)})
        });
        return globs;
    }
    
}
