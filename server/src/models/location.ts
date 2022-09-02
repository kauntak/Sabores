import { Schema, model } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export interface ILocation {
    name: string,
    isMain?: boolean
}


const locationSchema = new Schema<ILocation>({
    name: {
        type: String,
        required: true
    },
    isMain: {
        type: Boolean,
        default: false
    }
});

export const Location = model<ILocation>("Location", locationSchema);
