// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import log from 'fancy-log';
import { GulpContext } from './';
import { getGulpTasks } from './Tasks';

/**
 * Setup the tasks from this package
 * @param {any} originalExports The original exports object in the scope of the gulpfile importing this
 */
export default function setupGulp(originalExports: any) {
    log.info('Creating tasks...');
    const context = new GulpContext();
    const gulpTasks = getGulpTasks(context);
    for (const task of gulpTasks.allTasks) {
        if (task.displayName === undefined) throw new Error('Task missing displayName!');
        originalExports[task.displayName] = task;
    }
    originalExports.default = (done: (error?: Error) => void) => {
        console.info('There is no default task');
        done();
        process.exit(0);
    };

    log.info('Executing task...');
}
