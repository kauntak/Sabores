import { Response, Request } from "express";

import { Supplier, ISupplier } from "../../models/supplier";
import { returnError } from "../../models/error";

export async function createSupplier(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const supplier = new Supplier(body);
        const newSupplier = await supplier.save();
        const suppliers = await Supplier.find();
        res.status(201).json({
            supplier: newSupplier,
            suppliers: suppliers
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateSupplier(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const supplier: ISupplier|null = await Supplier.findByIdAndUpdate({'_id':id}, body, {new:true});
        const suppliers: ISupplier[] = await Supplier.find();
        res.status(200).json({
            supplier,
            suppliers
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getSuppliers(req: Request, res:Response):Promise<void>{
    try{
        const suppliers: ISupplier[] = await Supplier.find({});
        res.status(200).json({
            suppliers
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getSupplier(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const supplier:ISupplier|null =  await Supplier.findOne({'_id':id}).exec();
        const suppliers: ISupplier[] = await Supplier.find();
        res.status(200).json({
            supplier,
            suppliers
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteSupplier(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Supplier.findByIdAndDelete({'_id':id});
        const suppliers: ISupplier[] = await Supplier.find();
        res.status(200).json({
            suppliers
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}