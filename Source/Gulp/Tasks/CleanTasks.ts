/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import del from 'del';
import { TaskFunction } from 'undertaker';
import toUnixPath from 'slash';
import { GulpContext, createTask } from '../../internal';

export class CleanTasks {
    static cleanTasks: CleanTasks

    private _testsCleanTask!: TaskFunction
    private _cleanTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get cleanTask() {
        if (this._cleanTask === undefined) {
            this._cleanTask = createTask(this._context, 'clean', true,  workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => {
                    let outputFolder = projectSources.outputFiles.root!;
                    let projectPackage = workspace? workspace.workspacePackage : this._context.project.rootPackage;
                    if (projectPackage.usesWebpack()) {
                        let wwwroot = require(projectPackage.webpackConfigPath!)().output.path;
                        return del([outputFolder, wwwroot])
                            .then(_ => done())
                            .catch(error => done(error));
                    }
                    else return del(outputFolder)
                        .then(_ => done())
                        .catch(error => done(error));
                };    
            });
        }

        return this._cleanTask;
    }


    get testsCleanTask() {
        if (this._testsCleanTask === undefined) {
            this._testsCleanTask = createTask(this._context, 'test-clean', true, workspace => {
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                return done => del(`${toUnixPath(projectSources.outputFiles.root!)}/**/for_*`).then(_ => done()).catch(error => done(error));
            });
        }
    
        return this._testsCleanTask;
    }
    get allTasks() {
        return [this.cleanTask, this.testsCleanTask];
    }
}

export function getCleanTasks(context: GulpContext) {
    if (CleanTasks.cleanTasks === undefined) CleanTasks.cleanTasks = new CleanTasks(context);
    return CleanTasks.cleanTasks;
}