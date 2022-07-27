import { Schema, model, Document } from "mongoose";

export interface ISupplier {
    _id?: string,
    name: string,
    description? : string
}

export interface IOrderCategoryDoc extends Document, Omit<ISupplier, "_id"> {};

const orderCategorySchema = new Schema<ISupplier>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

export const OrderCategory = model<ISupplier>('OrderCategory', orderCategorySchema);