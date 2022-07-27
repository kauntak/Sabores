import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IShoppingItem {
    category: Types.ObjectId,
    name: string,
    description?: string,
    orderItem?: Types.ObjectId
}

export interface IShoppingItemDoc extends Document, IShoppingItem {};

const shoppingItemSchema = new Schema<IShoppingItem>({
    category: {
        type: ObjectId,
        ref: "ShoppingCategory",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    orderItem:{
        type: ObjectId,
        ref: "OrderItem"
    }
});

export const ShoppingItem = model<IShoppingItem>("ShoppingItem", shoppingItemSchema);
