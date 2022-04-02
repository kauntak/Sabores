import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IShoppingList {
    dateCreated:Date,
    comment: string,
    items: [
        {
            item: Types.ObjectId,
            quantity: Number,
            employee: Types.ObjectId
        }
    ]
}

export interface IShoppingListDoc extends Document, IShoppingList {};

const shoppingListSchema = new Schema<IShoppingList>({
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    comment: {
        type:String
    },
    items:[
        {
            item: {
                type: ObjectId,
                ref: 'ShoppingItem',
                required: true
            },
            quantity: {
                type:Number,
                required: true
            },
            employee: {
                type: ObjectId,
                ref: 'Employee',
                required: true
            }
        }
    ]
});

export const ShoppingList = model<IShoppingList>('ShoppingList', shoppingListSchema);