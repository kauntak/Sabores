import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface IShoppingList {
    createdAt:Date,
    comment?: string,
    isCompleted?: boolean,
    location: Types.ObjectId,
    items: [
        {
            item: Types.ObjectId,
            quantity: Number,
            employee: Types.ObjectId
        }
    ],
    expire_at?: Date
}

export interface IShoppingListDoc extends Document, IShoppingList {};

const shoppingListSchema = new Schema<IShoppingList>({
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    comment: {
        type:String
    },
    location: {
        type: ObjectId,
        ref: "Location",
        required: true
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
    ],
    expire_at:{
        type:Date,
        default: Date.now,
        expires: "60d"
    }
});

export const ShoppingList = model<IShoppingList>('ShoppingList', shoppingListSchema);