import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IOrder {
    location: Types.ObjectId,
    requestedBy: Types.ObjectId,
    requestDate: Date,
    requestComment? : string,
    fulfilledBy?: Types.ObjectId,
    fulfillDate?: Date,
    fulfillComment?: string,
    items: [
        {
            item: Types.ObjectId,
            quantity: Number
        }
    ]
}

export interface IOrderDoc extends Document, IOrder {};

const orderSchema = new Schema<IOrder>({
    location: {
        type: ObjectId,
        ref: 'Location',
        required: true,
    },
    requestedBy: {
        type: ObjectId,
        ref: "Employee",
        required: true,
    },
    requestDate:{
        type:Date,
        default: Date.now,
        required:true
    },
    requestComment: {
      type: String  
    },
    fulfilledBy:{
        type: ObjectId,
        ref: "Employee"
    },
    fulfillDate:{
        type:Date
    },
    fulfillComment: {
      type: String  
    },
    items: [
        {
            item: {
                type: ObjectId,
                ref: "OrderItem",
                required: true
            },
            quantity:{
                type:Number,
                required: true
            }
        },
    ],
});

export const Order = model<IOrder>("Order", orderSchema);
