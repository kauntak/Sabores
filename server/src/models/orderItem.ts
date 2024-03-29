import { Schema, model, Types } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IOrderItem {
    name: string,
    description?: string,
    category: Types.ObjectId,
    supplier?: Types.ObjectId
}


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
    },
    supplier: {
        type: ObjectId,
        ref: 'Supplier',
        required: false
    }
});

export const OrderItem = model<IOrderItem>('OrderItem', orderItemSchema);