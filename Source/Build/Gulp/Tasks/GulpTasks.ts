// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import gulp from 'gulp';
import { TaskFunction } from 'undertaker';
import { GulpContext} from '../';
import { getCleanTasks, getTestTasks, getLintTasks } from './';
import { YarnWorkspace } from '../../Project';
import { getStaticFilesTasks } from './StaticFilesTasks';

class GulpTasks {
    static gulpTask: GulpTasks;

    constructor(private _context: GulpContext) {}

    get cleanTasks() {
        return getCleanTasks(this._context);
    }

    get lintTasks() {
        return getLintTasks(this._context);
    }

    get staticFilesTasks() {
        return getStaticFilesTasks(this._context);
    }

    get testTasks() {
        return getTestTasks(this._context);
    }

    get allTasks() {
        return [...this.cleanTasks.allTasks, ...this.lintTasks.allTasks, ...this.testTasks.allTasks, ...this.staticFilesTasks.allTasks];
    }
}

export function getGulpTasks(context: GulpContext) {
    if (GulpTasks.gulpTask === undefined) GulpTasks.gulpTask = new GulpTasks(context);
    return GulpTasks.gulpTask;
}

export function createTask(context: GulpContext, taskName: string, parallel: boolean, createTaskCallback: (workspace?: YarnWorkspace) => TaskFunction) {
    let task: TaskFunction;
    if (context.project.workspaces.length > 0) {
        const workspaceTasks: TaskFunction[] = [];
        context.project.workspaces.forEach(_ => {
            const workspaceTask = createTaskCallback(_);
            workspaceTask.displayName = `${taskName}:${_.workspacePackage.packageObject.name}`;
            workspaceTasks.push(workspaceTask);
        });
        task = parallel ? gulp.parallel(workspaceTasks) : gulp.series(workspaceTasks);
        task.displayName = taskName;
    } else {
        task = createTaskCallback();
        task.displayName = taskName;
    }

    return task;
}
