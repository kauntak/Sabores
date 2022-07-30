import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IOrder {
    location: Types.ObjectId,
    requestDate: Date,
    requestComment? : string,
    fulfilledBy?: Types.ObjectId,
    isFulfilled?: boolean,
    deliverByDate:Date,
    fulfillDate?: Date,
    fulfillComment?: string,
    items: [
        {
            item: Types.ObjectId,
            quantity: Number,
            employee: Types.ObjectId
        }
    ]
}

export interface IOrderDoc extends Document, IOrder {};

const orderSchema = new Schema<IOrder>({
    location: {
        _id: false,
        type: ObjectId,
        ref: 'Location',
        required: true,
    },
    requestDate:{
        type:Date,
        default: Date.now,
        required:true
    },
    isFulfilled: {
        type: Boolean,
        required: false
    },
    requestComment: {
      type: String  
    },
    fulfilledBy:{
        type: ObjectId,
        ref: "Employee"
    },
    deliverByDate:{
        type: Date
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
            },
            employee:{
                type: ObjectId,
                ref: "Employee",
                required: true,
            }
        },
    ],
});

export const Order = model<IOrder>("Order", orderSchema);
