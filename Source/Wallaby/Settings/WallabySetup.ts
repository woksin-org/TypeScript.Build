/*---------------------------------------------------------------------------------------------
*  Copyright (c) Dolittle. All rights reserved.
*  Licensed under the MIT License. See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Project } from "@dolittle/typescript.build";

export type SetupCallback = (w: any) => void;


export class WallabySetup {
    
    private _setup!: (wallaby: any) => void

    constructor(private _w: any, private _project: Project, private _setupCallback?: SetupCallback) {}

    get setup() {
        if (this._setup === undefined) this._setup = this.getSetupFunction(); 
        return this._setup;
    }
    
    private getFunctionBody(func: Function) {
        var entire = func.toString();
        var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        return body;
      }
      
    private getSetupFunction(): (wallaby: any) => void {
        let setup = (wallaby: any) => {
            (process.env as any).IS_TESTING = true;
            let Project = require('@dolittle/typescript.build').Project
            let project = new Project(process.cwd());

            if (project.workspaces.length > 0) {
                let aliases: any = {};
                project.workspaces.forEach((workspace: any) => {
                    let packageObject = workspace.workspacePackage.packageObject;
                    let rootFolder = workspace.workspacePackage.rootFolder;
                    aliases[packageObject.name] = rootFolder;
                });
                require('module-alias').addAliases(aliases);
            }
        
            (global as any).expect = chai.expect;
            let should = chai.should();
            (global as any).sinon = require('sinon');
            let sinonChai = require('sinon-chai');
            let chaiAsPromised = require('chai-as-promised');
            chai.use(sinonChai);
            chai.use(chaiAsPromised);
        
            (global as any).mock = require('@fluffy-spoon/substitute').Substitute;
        }
        
        if (typeof this._setupCallback === 'function') {
            var setupBody = this.getFunctionBody(setup);
            var setupCallbackBody = this.getFunctionBody(this._setupCallback);
            var combined = setupBody + '\n' + setupCallbackBody;
            var newFunction = new Function(combined);
            return newFunction as (wallaby: any) => void;
        }
    
        return setup;
    }
}