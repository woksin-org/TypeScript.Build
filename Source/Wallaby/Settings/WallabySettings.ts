/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import toUnixPath from 'slash';
import { WallabySetup, Project } from "../../internal";

type WallabyFilePattern = string | {
    pattern: string, 
    instrument?: boolean, 
    ignore?: boolean
};

export type WallabySettingsCallback = (wallaby: any, settings: any) => void;

export class WallabySettings {
    private _files!: WallabyFilePattern[]
    private _tests!: WallabyFilePattern[]
    private _compilers!: any

    constructor(private _wallaby: any, private _project: Project, private _setup: WallabySetup, private  _settingsCallback?: WallabySettingsCallback) {
        this.createFiles();
        this.createTests();
        this.createCompilers();
    }

    get settings() {
        let settings = {
            files: this.files,
            tests: this.tests,
            compilers: this.compilers,
            setup: this._setup.setup,
            
            testFramework: 'mocha',
            env: {
                type: 'node',
                runner: 'node'
            },
        };
        if (typeof this._settingsCallback  === 'function') this._settingsCallback(this._wallaby, settings);
        return settings;
    }

    get files() {
        if (this._files === undefined) this.createFiles();
        return this._files;
    }

    get tests() {
        if (this._tests === undefined) this.createTests();
        return this._tests;
    }

    get compilers() {
        if (this._compilers === undefined) this.createCompilers();
        return this._compilers;
    }

    private createFiles() {
        this._files = [];
        this._files.push(...this.getBaseFiles());
        let sources = this._project.sources;
        sources.outputFiles.declarationFilesGlobs.includes.map(_ => _.relative).forEach(glob => this._files.push({pattern: glob, ignore: true}));
        sources.outputFiles.compiledFilesGlobs.includes.map(_ => _.relative).forEach(glob => this._files.push({pattern: glob, ignore: true}));
        sources.sourceFiles.testFileGlobs.includes.map(_ => _.relative).forEach(glob => this._files.push({pattern: glob, ignore: true}));
        sources.sourceFiles.testSetupFileGlobs.includes.map(_ => _.relative).forEach(glob => this._files.push({pattern: glob, instrument: false}))
        sources.sourceFiles.sourceFileGlobs.includes.map(_ => _.relative).forEach(glob => this._files.push({pattern: glob}));
    }

    private createTests() {
        this._tests = [];
        let sources = this._project.sources;
        sources.outputFiles.declarationFilesGlobs.includes.map(_ => _.relative).forEach(glob => this._tests.push({pattern: glob, ignore: true}));
        sources.outputFiles.compiledFilesGlobs.includes.map(_ => _.relative).forEach(glob => this._tests.push({pattern: glob, ignore: true}));
        sources.sourceFiles.testSetupFileGlobs.includes.map(_ => _.relative).forEach(glob => this._tests.push({pattern: glob, ignore: true}));
        sources.sourceFiles.testFileGlobs.includes.map(_ => _.relative).forEach(glob => this._tests.push({pattern: glob}));
    }

    private createCompilers() {
        this._compilers = {};
        let sources = this._project.sources;
        sources.sourceFiles.sourceFileGlobs.includes.map(_ => _.relative).forEach(glob => {
            this._compilers[glob] = this._wallaby.compilers.typeScript({module: 'cjs', downlevelIteration: true, experimentalDecorators: true, esModuleInterop: true });
        });
    }

    private getBaseFiles() {
        let baseFiles = [{ pattern: 'package.json', instrument: false}];
        if (this._project.workspaces.length > 0) {
            baseFiles.push({pattern: `${this.getRelativePathToSource()}/**/package.json`, instrument: false});
            baseFiles.push({pattern: `${this.getRelativePathToSource()}/**/node_modules/**/*`, instrument: false});
        }
        return baseFiles.concat([
            { pattern: 'node_modules/chai/**/*', instrument: false},
            { pattern: 'node_modules/chai-as-promised/**/*', instrument: false },
            { pattern: 'node_modules/sinon/pkg/**/*', instrument: false },
            { pattern: 'node_modules/sinon-chai/**/*', instrument: false },
            { pattern: 'node_modules/@dolittle/typescript.build/**/*', instrument: false }
        ]);
    }

    private getRelativePathToSource() {
        let sourceFilesRoot = toUnixPath(this._project.sources.sourceFiles.root);

        let root = toUnixPath(this._project.sources.root);
        return root === sourceFilesRoot? '' : sourceFilesRoot.replace(`${root}/`, '');
    }
    
}
