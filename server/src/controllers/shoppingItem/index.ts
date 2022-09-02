import { Response, Request } from "express";

import { ShoppingItem, IShoppingItem } from "../../models/shoppingItem";
import { returnError } from "../../models/error";

export async function createShoppingItem(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const shoppingItem = new ShoppingItem(body);
        const newShoppingItem = await shoppingItem.save();
        const shoppingItems = await ShoppingItem.find();
        res.status(201).json({
            shoppingItem: newShoppingItem,
            shoppingItems: shoppingItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateShoppingItem(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const shoppingItem: IShoppingItem|null = await ShoppingItem.findByIdAndUpdate({'_id':id}, body, {new:true});
        const shoppingItems: IShoppingItem[] = await ShoppingItem.find();
        res.status(200).json({
            shoppingItem,
            shoppingItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getShoppingItems(req: Request, res:Response):Promise<void>{
    try{
        const shoppingItems: IShoppingItem[] = await ShoppingItem.find();
        res.status(200).json({
            shoppingItems
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getShoppingItem(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const shoppingItem:IShoppingItem|null =  await ShoppingItem.findOne({'_id':id}).exec();
        const shoppingItems: IShoppingItem[] = await ShoppingItem.find();
        res.status(200).json({
            shoppingItem,
            shoppingItems
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteShoppingItem(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await ShoppingItem.findByIdAndDelete({'_id':id});
        const shoppingItems: IShoppingItem[] = await ShoppingItem.find();
        res.status(200).json({
            shoppingItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}