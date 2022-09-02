import { Schema, model, Types } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IEmployeeLog {
    _id?:Types.ObjectId,
    employee: Types.ObjectId,
    checkInTime?: Date,
    checkOutTime?: Date,
    comment?: string,
    reminder?: [{
        reminderId:Types.ObjectId,
        isCompleted:boolean
    }],
    expire_at?: Date
}


const employeeLogSchema = new Schema<IEmployeeLog>({
    employee: {
        _id: false,
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    comment: {
        type: String
    },
    reminder: [
        {
            _id: false,
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
        }
    ],
    expire_at:{
        type: Date,
        required: false,
        expires: "120d"
    }
});

export const EmployeeLog = model<IEmployeeLog>('EmployeeLog', employeeLogSchema);