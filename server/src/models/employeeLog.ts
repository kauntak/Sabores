import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IEmployeeLog {
    _id?:Types.ObjectId,
    description: string,
    employee: Types.ObjectId,
    checkInTime?: Date,
    checkOutTime?: Date,
    comment?: string,
    reminder?: [{
        reminderId:Types.ObjectId,
        isCompleted:boolean
    }]
}

export interface IEmployeeLogDoc extends Document, Omit<IEmployeeLog, "_id"> {};

const employeeLogSchema = new Schema<IEmployeeLog>({
    description: {
        type: String,
        required: true
    },
    employee: {
        _id: false,
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    checkInTime: {
        type: Date,
        default: Date.now
    },
    checkOutTime: {
        type: Date
    },
    comment: {
        type: String
    },
    reminder: [
        {
        reminderId: {
            _id:false,
            type: ObjectId,
            ref: 'Reminder',
            required:true
        },
        isCompleted: {
            type: Boolean,
            required:true,
            default:false
        }
    }]
});

export const EmployeeLog = model<IEmployeeLog>('EmployeeLog', employeeLogSchema);