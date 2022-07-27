import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IEmployeeLog {
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

export interface IEmployeeLogDoc extends Document, IEmployeeLog {};

const employeeLogSchema = new Schema<IEmployeeLog>({
    description: {
        type: String,
        required: true
    },
    employee: {
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