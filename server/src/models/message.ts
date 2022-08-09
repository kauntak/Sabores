import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IMessage {
    to:string,
    subject: string,
    message: string,
    employee: Types.ObjectId,
    date: Date,
    isRead: boolean
}

export interface IMessageDoc extends Document, IMessage {};

const messageSchema = new Schema<IMessage>({
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        require: true
    },
     message: {
        type: String,
        required: true
    },
    employee: {
        _id: false,
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        expires: "14d"
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

export const Message = model<IMessage>('Message', messageSchema);