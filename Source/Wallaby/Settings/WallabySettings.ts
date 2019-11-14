/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import toUnixPath from 'slash';
import { WallabySetup, Project, Sources } from "../../internal";

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
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => this._files.push(...this.getFilesFromSources(_.sources)));   
        }
        else this._files.push(...this.getFilesFromSources(this._project.sources));
    }

    private createTests() {
        this._tests = [];
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => this._tests.push(...this.getTestsFromSources(_.sources)));   
        }
        else this._tests.push(...this.getTestsFromSources(this._project.sources));
    }


    private getFilesFromSources(sources: Sources) {
        let files: WallabyFilePattern[] = [];
        let sourceRoot = this.pathAsRelativeGlobFromRoot(sources.sourceFiles.root);
        let outputRoot = this.pathAsRelativeGlobFromRoot(sources.outputFiles.root!);
        files.push({pattern: `${outputRoot}/**/*`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/!(given)/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/given/*.@(ts|js)`, instrument: false});
        files.push({pattern: `${sourceRoot}/**/*.@(ts|js)`});
        return files;

    }

    private getTestsFromSources(sources: Sources) {
        let files: WallabyFilePattern[] = [];
        let sourceRoot = this.pathAsRelativeGlobFromRoot(sources.sourceFiles.root);
        let outputRoot = this.pathAsRelativeGlobFromRoot(sources.outputFiles.root!);
        files.push({pattern: `${outputRoot}/**/*`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/given/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/*.@(ts|js)`});
        files.push({pattern: `${sourceRoot}/**/for_*/**/!(given)/*.@(ts|js)`});
        return files;
    }

    private createCompilers() {
        this._compilers = {
            '**/*.@(js|ts)': this._wallaby.compilers.typeScript({//Should read and parse tsconfig
                module: 'commonjs',
                downlevelIteration: true,
                allowJs: true,
                experimentalDecorators: true,
                esModuleInterop: true,
                target: 'es6'
            })
        };
    }

    private getBaseFiles() {
        let baseFiles: WallabyFilePattern[] = [{ pattern: 'package.json', instrument: false}];
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => {
                let root = this.pathAsRelativeGlobFromRoot(_.sources.root);
                baseFiles.push({pattern: `${root}/node_modules`, ignore: true});
                baseFiles.push({pattern: `${root}/package.json`, instrument: false});
            });
        }
        return baseFiles.concat([
            { pattern: 'node_modules/chai', instrument: false},
            { pattern: 'node_modules/chai-as-promised', instrument: false },
            { pattern: 'node_modules/sinon', instrument: false },
            { pattern: 'node_modules/sinon-chai', instrument: false },
            { pattern: 'node_modules/@dolittle/typescript.build', instrument: false }
        ]);
    }

    private pathAsRelativeGlobFromRoot(path: string) {
        path = toUnixPath(path);
        let root = toUnixPath(this._project.sources.root);
        return root === path? '' : path.replace(`${root}/`, '');
    }
}
