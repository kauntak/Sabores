import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const locationId = new Schema({
    locationId: ObjectId
}, { _id: false });

export interface IEmployee {
    _id:string,
    firstName: string,
    middleName?: string,
    lastName: string,
    password: string,
    role: Types.ObjectId,
    checkedIn: boolean,
    access?: [{locationId: Types.ObjectId}],
    email?: string,
    phone?: string,
    address?: string
}

export interface IEmployeeLoginData {
    id: string,
    password: string
}


export interface IEmployeeDoc extends Document, Omit<IEmployee, "_id"> {};



const employeeSchema = new Schema<IEmployee>({
    // _id:Types.ObjectId,
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
        _id: false,
        type: ObjectId,
        ref: "Role",
        required: true,
    },
    password: {
        type:String,
        required: true},
    checkedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    access: [locationId],
    email: String,
    phone: String,
    address: String
});

export const Employee = model<IEmployee>("Employee", employeeSchema);
