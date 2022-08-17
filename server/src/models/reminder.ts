import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IReminder {
    _id?:Types.ObjectId,
    description: string,
    role: Types.ObjectId
}

export interface IReminderDoc extends Document, Omit<IReminder, "_id"> {};

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