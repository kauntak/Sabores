import { Schema, model } from "mongoose";


export interface IRole {
    name: string,
    description?: string
}

export interface IRoleDoc extends Document, IRole {};

const roleSchema = new Schema<IRole>({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String
    }
});

export const Role = model<IRole>('Role', roleSchema);