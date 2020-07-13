// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { CompilerOptions } from 'typescript';
import { Project } from '../Project';
import { SetupCallback, WallabySetup } from './Settings/WallabySetup';
import { SourceFiles } from '../Project/Sources';
import { WallabySettings, WallabySettingsCallback } from './Settings/WallabySettings';

export type WallabyConfigurationOptions = {
    settingsCallback?: WallabySettingsCallback,
    setupCallback?: SetupCallback,
    compilerOptions?: CompilerOptions
};

export function wallaby(options?: WallabyConfigurationOptions) {
    return (wallaby: any) => {
        const project = new Project(process.cwd());
        const setup = new WallabySetup(wallaby, project, options?.setupCallback);
        const settings = new WallabySettings(wallaby, project, setup, options?.settingsCallback, options?.compilerOptions);

        setNodePath(wallaby, project);

        if (typeof options?.settingsCallback === 'function') options?.settingsCallback(wallaby, settings);
        return settings.settings;
    };
}

function setNodePath(w: any, project: Project) {
    let nodePath: string = w.projectCacheDir;
    const sourcePath = path.join(project.sources.root, SourceFiles.FOLDER_NAME);
    if (project.workspaces.length > 1 && fs.existsSync(sourcePath)) {
        nodePath = path.join(nodePath, SourceFiles.FOLDER_NAME);
    }

    process.env.NODE_PATH = nodePath;
}
