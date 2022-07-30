import { Schema, model, Document } from "mongoose";

export interface ISupplier {
    _id?: string,
    name: string,
    description? : string
}

export interface ISupplierDoc extends Document, Omit<ISupplier, "_id"> {};

const supplierSchema = new Schema<ISupplier>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

export const Supplier = model<ISupplier>('Supplier', supplierSchema);