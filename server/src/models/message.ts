import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IMessage {
    to:string,
    subject: string,
    message: string,
    employee: Types.ObjectId,
    date: Date,
    isRead: boolean,
    isLocked: boolean,
    expire_at?:Date
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
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    expire_at:{
        type:Date,
        expires: "30d"
    }
});

export const Message = model<IMessage>('Message', messageSchema);