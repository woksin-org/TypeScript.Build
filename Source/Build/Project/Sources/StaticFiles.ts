// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { toPatternsThatIgnoreNodeModules, asPossibleFileExtensionsPattern } from './';


const NOT_STATIC_FILE_EXTENSIONS = ['js', 'ts', 'd.ts'];
/**
 * Represents the static files
 *
 * @export
 * @class StaticFiles
 */
export class StaticFiles {

    /**
     * The list of static source file glob patterns
     *
     * @static
     */
    static staticSourceFilesGlobPatterns = toPatternsThatIgnoreNodeModules(`*${asPossibleFileExtensionsPattern(NOT_STATIC_FILE_EXTENSIONS, true)}`);

    static  staticOutputFilesGlobPatterns = [`**/*${asPossibleFileExtensionsPattern(NOT_STATIC_FILE_EXTENSIONS, true)}`];
}
