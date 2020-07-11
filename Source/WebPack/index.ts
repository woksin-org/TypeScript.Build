// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Configuration } from 'webpack';
import { WebpackConfiguration } from './WebpackConfiguration';

export * from './WebpackEnvironment';
export * from './WebpackArguments';

export function webpack(dirname: string, settingsCallback?: (config: Configuration) => void) {
    return () => {
      const config = new WebpackConfiguration(dirname, process.env, process.argv).createConfiguration();
      if (typeof settingsCallback === 'function') settingsCallback(config);
      return config;
    };
}
