// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import gulp, { dest } from 'gulp';
import { TaskFunction } from 'undertaker';
import { createTask } from './';
import { GulpContext } from '../';
const gulpEslint = require('gulp-eslint');
const gulpIf = require('gulp-if');

export class LintTasks {
    /**
     * The singleton instance of {LintTasks}
     *
     * @static
     * @type {LintTasks}
     */
    static lintTasks: LintTasks;

    private _lintTask!: TaskFunction;
    private _lintFixTask!: TaskFunction;

    constructor(private _context: GulpContext) {}

    /**
     * The task for linting
     *
     * @readonly
     */
    get lintTask() {
        if (this._lintTask === undefined) {
            this._lintTask = this.createLintTask(false);
        }
        return this._lintTask;
    }

    /**
     * The task for linting and fixing
     *
     * @readonly
     */
    get lintFixTask() {
        if (this._lintFixTask === undefined) {
            this._lintFixTask = this.createLintTask(true);
        }
        return this._lintFixTask;
    }

    /**
     * Gets all the tasks
     *
     * @readonly
     */
    get allTasks() {
        return [this.lintTask, this.lintFixTask];
    }

    private createLintTask(fix: boolean) {
        const task = createTask(this._context, fix ? 'lint-fix' : 'lint', true, workspace => {
            const projectSources = workspace !== undefined ? workspace.sources : this._context.project.sources;
            const sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
            const excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);
            const destination = projectSources.sourceFiles.root!;
            return done => gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                .pipe(gulpEslint({ fix }))
                .pipe(gulpEslint.format())
                .pipe(gulpEslint.failAfterError())
                .pipe(gulpIf(fix, dest(destination)))
                .on('end', done);
        });
        return task;
    }

}

export function getLintTasks(context: GulpContext) {
    if (LintTasks.lintTasks === undefined) LintTasks.lintTasks = new LintTasks(context);
    return LintTasks.lintTasks;
}
