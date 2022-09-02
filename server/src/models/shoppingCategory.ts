import { Schema, model } from "mongoose";

export interface IShoppingCategory {
    name: string,
    description?: string
}


const shoppingCategorySchema = new Schema<IShoppingCategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type:String
    }
});

export const ShoppingCategory = model<IShoppingCategory>('ShoppingCategory', shoppingCategorySchema);