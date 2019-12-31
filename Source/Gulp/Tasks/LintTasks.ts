/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import tslint from 'gulp-tslint';
import { TaskFunction } from 'undertaker';
import { GulpContext } from '../../internal';
import { createTask } from './GulpTasks';


export class LintTasks {
    /**
     * The singleton instance of {LintTasks}
     *
     * @static
     * @type {LintTasks}
     */
    static lintTasks: LintTasks;

    private _lintTask!: TaskFunction;

    constructor(private _context: GulpContext) {}

    /**
     * The task for linting
     *
     * @readonly
     */
    get lintTask() {
        if (this._lintTask === undefined) {
            this._lintTask = this.createLintTask();
        }
        return this._lintTask;
    }

    /**
     * Gets all the tasks
     *
     * @readonly
     */
    get allTasks() {
        return [this.lintTask];
    }

    private createLintTask() {
        const task = createTask(this._context, 'lint', true, workspace => {
            const projectSources = workspace !== undefined ? workspace.sources : this._context.project.sources;
            const tsLintConfigPath = workspace ? workspace.tsLint : this._context.project.tsLint;
            const sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
            const excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);

            return done => gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                .pipe(tslint({
                    formatter: 'verbose',
                    fix: false,
                    configuration: tsLintConfigPath
                }))
                .pipe(tslint.report({
                    summarizeFailureOutput: true
                }))
                .on('end', done);
        });

        return task;
    }

}

export function getLintTasks(context: GulpContext) {
    if (LintTasks.lintTasks === undefined) LintTasks.lintTasks = new LintTasks(context);
    return LintTasks.lintTasks;
}
