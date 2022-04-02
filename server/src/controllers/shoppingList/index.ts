import { Response, Request } from "express";

import { ShoppingList, IShoppingList, IShoppingListDoc } from "../../models/shoppingList";
import { IError, returnError } from "../../models/error";

export async function createShoppingList(req: Request, res: Response): Promise<void>{
    try {
        const body = req.body;
        const shoppingList = new ShoppingList(body);
        const newShoppingList = await shoppingList.save();
        const shoppingLists = await ShoppingList.find();
        res.status(201).json({
            shoppingList: newShoppingList,
            shoppingLists: shoppingLists
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateShoppingList(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const shoppingList: IShoppingList|null = await ShoppingList.findByIdAndUpdate({_id:id}, body);
        const shoppingLists: IShoppingList[] = await ShoppingList.find();
        res.status(200).json({
            shoppingList,
            shoppingLists
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getShoppingList(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req.body;
        const shoppingList:IShoppingList|null =  id === 'all' ? null : await ShoppingList.findOne({_id:id}).exec();
        const shoppingLists: IShoppingList[] = await ShoppingList.find();
        res.status(200).json({
            shoppingList,
            shoppingLists
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteShoppingList(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await ShoppingList.findByIdAndDelete({_id:id});
        const shoppingLists: IShoppingList[] = await ShoppingList.find();
        res.status(200).json({
            shoppingLists
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}