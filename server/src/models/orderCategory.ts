import { Schema, model, Document } from "mongoose";

export interface IOrderCategory {
    name: string,
    description? : string
}

export interface IOrderCategoryDoc extends Document, IOrderCategory {};

const orderCategorySchema = new Schema<IOrderCategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

export const OrderCategory = model<IOrderCategory>('OrderCategory', orderCategorySchema);