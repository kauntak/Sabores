import { Schema, model } from "mongoose";

type accessRoleType = "Administrator"| "Manager" | "Employee";


export interface IRole {
    name: string,
    description?: string,
    type: accessRoleType
}


const roleSchema = new Schema<IRole>({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    type:{
        type:String,
        required: true
    }
});

export const Role = model<IRole>('Role', roleSchema);