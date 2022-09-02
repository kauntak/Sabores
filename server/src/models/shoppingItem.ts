import { Schema, model, Types } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IShoppingItem {
    category: Types.ObjectId,
    name: string,
    description?: string,
    orderItem?: Types.ObjectId
}


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
