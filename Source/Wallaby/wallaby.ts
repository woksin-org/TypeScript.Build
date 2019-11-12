/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {Project, ProjectSources} from '@dolittle/typescript.build';
import fs from 'fs';
import path from 'path';
import { WallabySettingsCallback, SetupCallback, WallabySettings, WallabySetup } from '../internal';

export function wallaby(settingsCallback?: WallabySettingsCallback, setupCallback?: SetupCallback) {
    return (wallaby: any) => {
        let project = new Project(process.cwd());
        let setup = new WallabySetup(wallaby, project, setupCallback)
        let settings = new WallabySettings(wallaby, project, setup, settingsCallback);
        
        setNodePath(wallaby, project)

        if (typeof settingsCallback === 'function') settingsCallback(wallaby, settings);
        return settings.settings;
    };
}

function setNodePath(w: any, project: Project) {
    let nodePath: string = w.projectCacheDir;
    if (fs.existsSync(path.join(project.sources.rootFolder, ProjectSources.sourceFileFolderName))) {
        nodePath = path.join(nodePath, ProjectSources.sourceFileFolderName);
    }

    process.env.NODE_PATH = nodePath;
}