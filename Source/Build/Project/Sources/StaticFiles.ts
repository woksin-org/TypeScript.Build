// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { asPossibleFileExtensionsPattern, toPatternsThatIgnoreNodeModules } from './Globs';

/**
 * Represents the static files
 *
 * @export
 * @class StaticFiles
 */
export class StaticFiles {

    static get notStaticFileExtensions() { return ['js', 'ts', 'd.ts']; }

    /**
     * The list of static source file glob patterns
     *
     * @static
     */
    static staticSourceFilesGlobPatterns = toPatternsThatIgnoreNodeModules(`*${asPossibleFileExtensionsPattern(StaticFiles.notStaticFileExtensions, true)}`);

    static  staticOutputFilesGlobPatterns = [`**/*${asPossibleFileExtensionsPattern(StaticFiles.notStaticFileExtensions, true)}`];
}
