import { Response, Request } from "express";

import { ShoppingCategory, IShoppingCategory, IShoppingCategoryDoc } from "../../models/shoppingCategory";
import { IError, returnError } from "../../models/error";

export async function createShoppingCategory(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const shoppingCategory = new ShoppingCategory(body);
        const newShoppingCategory = await shoppingCategory.save();
        const shoppingCategories = await ShoppingCategory.find();
        res.status(201).json({
            shoppingCategory: newShoppingCategory,
            shoppingCategories: shoppingCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateShoppingCategory(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const shoppingCategory: IShoppingCategory|null = await ShoppingCategory.findByIdAndUpdate({'_id':id}, body);
        const shoppingCategories: IShoppingCategory[] = await ShoppingCategory.find();
        res.status(200).json({
            shoppingCategory,
            shoppingCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getShoppingCategories(req: Request, res:Response):Promise<void>{
    try{
        const shoppingCategories: IShoppingCategory[] = await ShoppingCategory.find();
        res.status(200).json({
            shoppingCategories
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getShoppingCategory(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const shoppingCategory:IShoppingCategory|null =  id === 'all' ? null : await ShoppingCategory.findOne({'_id':id}).exec();
        const shoppingCategories: IShoppingCategory[] = await ShoppingCategory.find();
        res.status(200).json({
            shoppingCategory,
            shoppingCategories
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteShoppingCategory(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await ShoppingCategory.findByIdAndDelete({'_id':id});
        const shoppingCategories: IShoppingCategory[] = await ShoppingCategory.find();
        res.status(200).json({
            shoppingCategories
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}