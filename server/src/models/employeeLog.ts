import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IEmployeeLog {
    description: string,
    employee: Types.ObjectId,
    checkInTime?: Date,
    checkOutTime?: Date,
    comment?: string,
    reminder?: Types.ObjectId
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
    reminder: {
        type: ObjectId,
        ref: 'Reminder'
    }
});

export const EmployeeLog = model<IEmployeeLog>('EmployeeLog', employeeLogSchema);