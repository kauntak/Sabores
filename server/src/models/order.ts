import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IOrder {
    location: Types.ObjectId,
    createdAt: Date,
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
        }?
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
    createdAt:{
        type:Date,
        default: Date.now,
        required:true,
        expires: "60d"
    },
    isFulfilled: {
        type: Boolean,
        required: false,
        default: false
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
            _id: false,
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
