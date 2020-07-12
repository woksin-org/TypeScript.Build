// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import gulp from 'gulp';
import gulpMocha from 'gulp-mocha';
import { TaskFunction } from 'undertaker';
import { GulpContext } from '../';
import { createTask } from './';
import { YarnWorkspace } from '../../Project';

export class TestTasks {
    static testTasks: TestTasks;

    private _runTestsTask!: TaskFunction;
    private _testTask!: TaskFunction;

    constructor(private _context: GulpContext) {}

    get runTestsTask() {
        if (this._runTestsTask === undefined) {
            this._runTestsTask = createTask(this._context, 'test-run', false, (workspace: YarnWorkspace) => {
                const projectSources = workspace !== undefined ? workspace.sources : this._context.project.sources;
                const compiledTests = projectSources.outputFiles.compiledTestsGlobs.includes.map(_ => _.absolute);
                const excludedCompiledTests = projectSources.outputFiles.compiledTestsGlobs.excludes.map(_ => _.absolute);
                return done => gulp.src(compiledTests.concat(excludedCompiledTests.map(_ => '!' + _)), {read: false})
                                .pipe(gulpMocha({reporter: 'spec', require: ['jsdom-global/register', '@dolittle/typescript.build/mocha.opts',]}))
                                .on('end', done);
            });
        }
        return this._runTestsTask;
    }

    get allTasks() {
        return [this.runTestsTask];
    }

}

export function getTestTasks(context: GulpContext) {
    if (TestTasks.testTasks === undefined) TestTasks.testTasks = new TestTasks(context);
    return TestTasks.testTasks;
}
