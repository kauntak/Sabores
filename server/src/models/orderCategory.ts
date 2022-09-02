import { Schema, model } from "mongoose";

export interface IOrderCategory {
    name: string,
    description? : string
}


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