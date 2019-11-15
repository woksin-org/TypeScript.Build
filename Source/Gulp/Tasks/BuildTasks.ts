/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';
import gulp from 'gulp';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import gutil from 'gulp-util';
import { TaskFunction } from 'undertaker';
import { GulpContext, getCleanTasks, createTask } from '../../internal'
import { Readable } from 'stream';


export class BuildTasks {
    static buildTasks: BuildTasks

    private _buildTask!: TaskFunction
    private _copyStaticTask!: TaskFunction

    constructor(private _context: GulpContext) {}

    get buildTask() {
        if (this._buildTask === undefined) {
            this._buildTask = this.createBuildTask();
        }
        return this._buildTask;
    }

    get allTasks() {
        return [this.buildTask];
    }
    
    private createBuildTask() {
        let task: TaskFunction
        if (this._context.project.workspaces.length > 0) {
            task = gulp.series(getCleanTasks(this._context).cleanTask, this.createWorkspacesBuildTask(), this.createCopyStaticTask());
        }
        else {
            if (/*this._context.project.rootPackage.usesWebpack()*/ false) {
                let taskFunction: TaskFunction = done => {
                    done();
                    // let webpackConfig = require(this._context.project.rootPackage.webpackConfigPath!);
                    // let webpack = require(path.join(this._context.project.root, 'node_modules', 'webpack'));
                    // webpack(webpackConfig, (error: Error, stats: any) => {
                    //     if (error) throw new gutil.PluginError('webpack', error);
                    //     gutil.log("[webpack]", stats.toString())
                    //     done();
                    // });
                }

                taskFunction.displayName = `build:${this._context.project.rootPackage.packageObject.name}`;
                task = gulp.series(getCleanTasks(this._context).cleanTask, taskFunction, this.createCopyStaticTask());
            }
            else {
                let projectSources = this._context.project.sources;
                let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
                let sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
                let excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);

                let destination = projectSources.outputFiles.root!;
                let taskFunction: TaskFunction = done => {
                    let tsResult = gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                        .pipe(gulpSourcemaps.init())
                        .pipe(tsProject());
                    tsResult.dts
                        .pipe(gulp.dest(destination));
                    return tsResult.js
                        .pipe(gulpSourcemaps.write())
                        .pipe(gulp.dest(destination))
                        .on('end', _ => done())
                        .on('error', err => done(err));
                };
                taskFunction.displayName = `build:${this._context.project.rootPackage.packageObject.name}`;
                task = gulp.series(getCleanTasks(this._context).cleanTask, taskFunction, this.createCopyStaticTask());
            }
            
                
        }
        task.displayName = 'build';
        return task;
    }

    private createWorkspacesBuildTask() {
        let tasks: TaskFunction[] = [];
        let streams: {stream: Readable, dest: string}[] = [];

        this._context.project.workspaces.forEach(workspace => {
            if (/*workspace.workspacePackage.usesWebpack()*/ false) {
                let taskFunction: TaskFunction = done => {
                    done();
                    // let webpackConfig = require(workspace.workspacePackage.webpackConfigPath!);
                    // let webpack = require(path.join(this._context.project.root, 'node_modules', 'webpack'));
                    // webpack(webpackConfig, (error: Error, stats: any) => {
                    //     if (error) throw new gutil.PluginError('webpack', error);
                    //     gutil.log("[webpack]", stats.toString())
                    //     done();
                    // });
                }

                taskFunction.displayName = `build:${workspace.workspacePackage.packageObject.name}`;
                tasks.push(taskFunction);
            }
            else {
                let projectSources = workspace.sources;
                let tsProject = gulpTypescript.createProject(projectSources.tsConfig!);
                let sourceFiles = projectSources.sourceFiles.sourceFileGlobs.includes.map(_ => _.absolute);
                let excludedSourceFiles = projectSources.sourceFiles.sourceFileGlobs.excludes.map(_ => _.absolute);
                
                let destination = projectSources.outputFiles.root!;
                let taskFunction: TaskFunction = done => {
                    let tsResult = gulp.src(sourceFiles.concat(excludedSourceFiles.map(_ => '!' + _)))
                        .pipe(gulpSourcemaps.init())
                        .pipe(tsProject());
                        
                    streams.push({stream: tsResult.js, dest: destination});
                    streams.push({stream: tsResult.dts, dest: destination});
                    tsResult
                        .on('end', _ => done())
                        .on('error', err => done(err));
                    return tsResult;
                };
                taskFunction.displayName = `build:${workspace.workspacePackage.packageObject.name}`;
                tasks.push(taskFunction);
            }
        });
        let writeFilesTask: TaskFunction = done => {
            let counter = 0;
            for (let _ of streams) {
                let stream = _.stream
                    .pipe(gulp.dest(_.dest))
                    .on('end', _ => {
                        counter += 1;
                        if (counter === streams.length) done();
                    })
                    .on('error', err => done(err));
            }
        };
        writeFilesTask.displayName = 'build-write-files';
        let parallelBuild = gulp.parallel(tasks);
        parallelBuild.displayName = 'build-parallel';
        let task = gulp.series(parallelBuild, writeFilesTask);

        return task;
    }

    private createCopyStaticTask() {
        if (this._copyStaticTask === undefined) {
            this._copyStaticTask = createTask(this._context, 'copy', true,  workspace => {
                let usesWebPack = workspace? workspace.workspacePackage.usesWebpack() : this._context.project.rootPackage.usesWebpack();
                if (usesWebPack) return done => done();
                let projectSources = workspace !== undefined? workspace.sources : this._context.project.sources;
                let staticFiles = projectSources.sourceFiles.staticSourceFileGlobs.includes.map(_ => _.absolute);
                let excludedStaticFiles = projectSources.sourceFiles.staticSourceFileGlobs.excludes.map(_ => _.absolute);
                let destination = projectSources.outputFiles.root!;
                return done => gulp.src(staticFiles.concat(excludedStaticFiles.map(_ => '!' + _)))
                                    .pipe(gulp.dest(destination))
                                    .on('end', done);
            });
        }

        return this._copyStaticTask;
    }
}

export function getBuildTasks(context: GulpContext) {
    if (BuildTasks.buildTasks === undefined) BuildTasks.buildTasks = new BuildTasks(context);
    return BuildTasks.buildTasks;
}