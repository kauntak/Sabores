import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IOrderItem {
    name: string,
    description?: string,
    category: Types.ObjectId
}

export interface IOrderItemDoc extends Document, IOrderItem {};

const orderItemSchema = new Schema<IOrderItem>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: ObjectId,
        ref: 'OrderCategory',
        required: true
    }
});

export const OrderItem = model<IOrderItem>('OrderItem', orderItemSchema);