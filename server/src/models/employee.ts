import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IEmployee {
    firstName: string,
    middleName?: string,
    lastName: string,
    role: Types.ObjectId,
    access: [{module: Types.ObjectId}],
    email?: string,
    phone?: string,
    address?: string
}

export interface IEmployeeDoc extends Document, IEmployee {};

const employeeSchema = new Schema<IEmployee>({
    firstName: {
        type: String,
        required: true,
    },
    middleName: String,
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: ObjectId,
        ref: "Role",
        required: true,
    },
    access: [
        {
            module: {
                type: ObjectId,
                ref: "Module",
            },
        },
    ],
    email: String,
    phone: String,
    address: String
});

export const Employee = model<IEmployee>("Employee", employeeSchema);
