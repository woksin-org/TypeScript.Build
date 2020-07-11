// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import gulp from 'gulp';
import { TaskFunction } from 'undertaker';
import { GulpContext } from '../';
import { createTask } from './';


export class StaticFilesTasks {
    static staticFilesTasks: StaticFilesTasks;

    private _copyStaticTask!: TaskFunction;

    constructor(private _context: GulpContext) {}

    get copyStaticTask() {
        if (this._copyStaticTask === undefined) {
            this._copyStaticTask = this.createCopyStaticTask();
        }
        return this._copyStaticTask;
    }

    get allTasks() {
        return [this.copyStaticTask];
    }

    private createCopyStaticTask() {
        if (this._copyStaticTask === undefined) {
            this._copyStaticTask = createTask(this._context, 'copy', true,  workspace => {
                const usesWebPack = workspace ? workspace.workspacePackage.usesWebpack() : this._context.project.rootPackage.usesWebpack();
                if (usesWebPack) return done => done();
                const projectSources = workspace !== undefined ? workspace.sources : this._context.project.sources;
                const staticFiles = projectSources.sourceFiles.staticSourceFileGlobs.includes.map(_ => _.absolute);
                const excludedStaticFiles = projectSources.sourceFiles.staticSourceFileGlobs.excludes.map(_ => _.absolute);
                const destination = projectSources.outputFiles.root!;
                return done => gulp.src(staticFiles.concat(excludedStaticFiles.map(_ => '!' + _)))
                                    .pipe(gulp.dest(destination))
                                    .on('end', done);
            });
        }

        return this._copyStaticTask;
    }
}

export function getStaticFilesTasks(context: GulpContext) {
    if (StaticFilesTasks.staticFilesTasks === undefined) StaticFilesTasks.staticFilesTasks = new StaticFilesTasks(context);
    return StaticFilesTasks.staticFilesTasks;
}
