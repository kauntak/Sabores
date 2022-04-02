import { Schema, model, Types, Document } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface ILocation {
    name: string
}

export interface ILocationDoc extends Document, ILocation {};

const locationSchema = new Schema<ILocation>({
    name: {
        type: String,
        required: true
    }
});

export const Location = model<ILocation>("Location", locationSchema);
