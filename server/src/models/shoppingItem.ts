import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IShoppingItem {
    category: Types.ObjectId,
    name: string,
    description?: string
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
});

export const ShoppingItem = model<IShoppingItem>("ShoppingItem", shoppingItemSchema);
