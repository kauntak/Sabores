import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IReminder {
    description: string,
    role: Types.ObjectId
}

export interface IReminderDoc extends Document, IReminder {};

const reminderSchema = new Schema<IReminder>({
    description: {
        type: String,
        required: true
    },
    role: {
        type: ObjectId,
        ref: 'role',
        required: true
    }
});

export const Reminder = model<IReminder>('Reminder', reminderSchema);