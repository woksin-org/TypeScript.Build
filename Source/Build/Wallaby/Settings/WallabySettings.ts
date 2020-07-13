// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import toUnixPath from 'slash';
import ts, { CompilerOptions } from 'typescript';
import { Project } from '../../Project';
import { Sources, SourceFiles } from '../../Project/Sources';
import { WallabySetup } from './WallabySetup';

type WallabyFilePattern = string | {
    pattern: string,
    instrument?: boolean,
    ignore?: boolean
};

const INSTRUMENTED_NODE_MODULES = [
    'chai',
    'chai-as-promised',
    'sinon',
    'sinon-chai',
    '@dolittle/typescript.build'
];

export type WallabySettingsCallback = (wallaby: any, settings: any) => void;

export class WallabySettings {

    private _files!: WallabyFilePattern[];
    private _tests!: WallabyFilePattern[];
    private _compilers!: any;


    constructor(
        private _wallaby: any,
        private _project: Project,
        private _setup: WallabySetup,
        private  _settingsCallback?: WallabySettingsCallback,
        private _compilerOptions?: CompilerOptions
    ) {
        this._compilerOptions = this._compilerOptions || {
            module: ts.ModuleKind.CommonJS,
            downlevelIteration: true,
            allowJs: true,
            experimentalDecorators: true,
            esModuleInterop: true,
            target: ts.ScriptTarget.ES2015
        };
        this.createFiles();
        this.createTests();
        this.createCompilers();
    }

    get settings() {
        const settings = {
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
        this._files.push(...this.getBaseIgnoredFiles(), ...this.getBaseInstrumentedFiles());
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => this._files.push(...this.getFilesFromSources(_.sources)));
        }
        else this._files.push(...this.getFilesFromSources(this._project.sources));
    }

    private createTests() {
        this._tests = this.getBaseIgnoredFiles();
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => this._tests.push(...this.getTestsFromSources(_.sources)));
        }
        else this._tests.push(...this.getTestsFromSources(this._project.sources));
    }


    private getFilesFromSources(sources: Sources) {
        const files: WallabyFilePattern[] = [];
        const sourceRoot = this.pathAsRelativeGlobFromRoot(sources.sourceFiles.root);
        const outputRoot = this.pathAsRelativeGlobFromRoot(sources.outputFiles.root!);
        files.push({pattern: `${outputRoot}/**/*`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/!(given)/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/given/*.@(ts|js)`, instrument: false});
        files.push({pattern: `${sourceRoot}/**/*.@(ts|js)`});
        return files;

    }

    private getTestsFromSources(sources: Sources) {
        const files: WallabyFilePattern[] = [];
        const sourceRoot = this.pathAsRelativeGlobFromRoot(sources.sourceFiles.root);
        const outputRoot = this.pathAsRelativeGlobFromRoot(sources.outputFiles.root!);
        files.push({pattern: `${outputRoot}/**/*`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/**/given/*.@(ts|js)`, ignore: true});
        files.push({pattern: `${sourceRoot}/**/for_*/*.@(ts|js)`});
        files.push({pattern: `${sourceRoot}/**/for_*/**/!(given)/*.@(ts|js)`});
        return files;
    }

    private createCompilers() {

        this._compilers = {
            '**/*.@(js|ts)': this._wallaby.compilers.typeScript(this._compilerOptions)
        };
    }

    private getBaseInstrumentedFiles() {
        const baseFiles: WallabyFilePattern[] = [{ pattern: 'package.json', instrument: false}];
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach((_: any) => {
                const root = this.pathAsRelativeGlobFromRoot(_.sources.root);
                baseFiles.push({pattern: `${root}/package.json`, instrument: false});
            });
        }
        return baseFiles.concat(INSTRUMENTED_NODE_MODULES.map(_ => {
            return {pattern: `node_modules/${_}`, instrument: false};
        }));
    }

    private getBaseIgnoredFiles() {
        const baseFiles: WallabyFilePattern[] = [];
        if (this._project.workspaces.length > 0) {
            this._project.workspaces.forEach(_ => {
                const root = this.pathAsRelativeGlobFromRoot(_.sources.root);
                baseFiles.push({pattern: `${root}/node_modules`, ignore: true});
                if (_.workspacePackage.usesWebpack()) {
                    SourceFiles.getWebpackSpecificExcludes(_.workspacePackage).forEach(pattern => {
                        baseFiles.push({pattern: `${root}/${pattern}`, ignore: true});
                    });
                }
            });
        }
        else {
            const rootPackage = this._project.rootPackage;
            if (rootPackage.usesWebpack()) {
                SourceFiles.getWebpackSpecificExcludes(rootPackage).forEach((pattern: any) => {
                    baseFiles.push({pattern, ignore: true});
                });
            }
        }
        const scopedPackages = INSTRUMENTED_NODE_MODULES.filter(_ => _.startsWith('@'));
        const unscopedPackages = INSTRUMENTED_NODE_MODULES.filter(_ => !_.startsWith('@'));
        baseFiles.push({pattern: `node_modules/!(${unscopedPackages.join('|')})`, ignore: true});
        scopedPackages.forEach(_ => {
            const splitPackage = _.split('/');
            const scope = splitPackage[0], packageName = splitPackage[1];
            baseFiles.push({pattern: `node_modules/${scope}/!(${packageName})`, ignore: true});
        });

        return baseFiles;
    }


    private pathAsRelativeGlobFromRoot(path: string) {
        path = toUnixPath(path);
        const root = toUnixPath(this._project.sources.root);
        return root === path ? '.' : path.replace(`${root}/`, '');
    }
}
