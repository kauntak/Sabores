import { Schema, model } from "mongoose";

export interface IModule {
    moduleName: string,
    displayName:string
}

export interface IModuleDoc extends Document, IModule {};

const moduleSchema = new Schema<IModule>({
    moduleName: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true
    }
});

export const Module = model<IModule>("Module", moduleSchema);
