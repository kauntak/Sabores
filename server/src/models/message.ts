import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IMessage {
    message: string,
    employee: Types.ObjectId,
    date: Date
}

export interface IMessageDoc extends Document, IMessage {};

const messageSchema = new Schema<IMessage>({
     message: {
        type: String,
        required: true
    },
    employee: {
        type: ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Message = model<IMessage>('Message', messageSchema);