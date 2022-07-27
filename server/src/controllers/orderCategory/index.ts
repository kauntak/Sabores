import { Response, Request } from "express";

import { OrderCategory, IOrderCategory, IOrderCategoryDoc } from "../../models/orderCategory";
import { IError, returnError } from "../../models/error";

export async function createOrderCategory(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const orderCategory = new OrderCategory(body);
        const newOrderCategory = await orderCategory.save();
        const orderCategories = await OrderCategory.find();
        res.status(201).json({
            orderCategory: newOrderCategory,
            orderCategories: orderCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateOrderCategory(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const orderCategory: IOrderCategory|null = await OrderCategory.findByIdAndUpdate({'_id':id}, body);
        const orderCategories: IOrderCategory[] = await OrderCategory.find();
        res.status(200).json({
            orderCategory,
            orderCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getOrderCategories(req: Request, res:Response):Promise<void>{
    try{
        const orderCategories: IOrderCategory[]|null = await OrderCategory.find();
        res.status(200).json({
            orderCategories
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteOrderCategory(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await OrderCategory.findByIdAndDelete({'_id':id});
        const orderCategories: IOrderCategory[] = await OrderCategory.find();
        res.status(200).json({
            orderCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}