import { Schema, model } from "mongoose";

export interface IModule {
    name: string
}

export interface IModuleDoc extends Document, IModule {};

const moduleSchema = new Schema<IModule>({
    name: {
        type: String,
        required: true,
    }
});

export const Module = model<IModule>("Module", moduleSchema);
