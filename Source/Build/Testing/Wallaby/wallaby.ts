// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import fs from 'fs';
import path from 'path';
import { Project } from '../../Project';
import { SourceFiles } from '../../Project/Sources';
import { WallabySettings, WallabySettingsCallback } from './Settings/WallabySettings';
import { SetupCallback, WallabySetup } from './Settings/WallabySetup';

export function wallaby(settingsCallback?: WallabySettingsCallback, setupCallback?: SetupCallback) {
    console.log('HELLO');
    return (wallaby: any) => {
        const project = new Project(process.cwd());
        const setup = new WallabySetup(wallaby, project, setupCallback);
        const settings = new WallabySettings(wallaby, project, setup, settingsCallback);

        setNodePath(wallaby, project);

        if (typeof settingsCallback === 'function') settingsCallback(wallaby, settings);
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
