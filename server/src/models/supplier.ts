import { Schema, model } from "mongoose";

export interface ISupplier {
    _id?: string,
    name: string,
    description? : string
}


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