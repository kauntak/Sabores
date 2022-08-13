import { Response, Request } from "express";

import { ShoppingList, IShoppingList, IShoppingListDoc } from "../../models/shoppingList";
import { IError, returnError } from "../../models/error";

export async function createShoppingList(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
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

export async function completeShoppingLists(req: Request, res: Response): Promise<void>{
    try {
        const {params: {ids}, query:{completedBatchId}} = req;
        const result:ReturnType<typeof ShoppingList.updateMany> = ShoppingList.updateMany({'_id':{$in:ids.split(",")}}, {completedBatchId, isCompleted:true, expire_at:new Date()});
        if(!((await result).acknowledged)){

        }
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

export async function updateShoppingList(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const shoppingList: IShoppingList|null = await ShoppingList.findByIdAndUpdate({'_id':id}, body, {new:true});
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

export async function getShoppingLists(req: Request, res:Response):Promise<void>{
    try{
        const shoppingLists: IShoppingList[] = await ShoppingList.find({}, null, {sort:{createdAt:'desc'}});
        res.status(200).json({
            shoppingLists
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getShoppingListsByLocation(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const shoppingLists: IShoppingList[] = await ShoppingList.find({location:id}, null, {sort:{createdAt:'desc'}});
        res.status(200).json({
            shoppingLists
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getActiveShoppingListByLocation(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        let shoppingList:IShoppingList|null =  await ShoppingList.findOne({location:id, isCompleted:false}).exec();
        if(shoppingList===null) {
            shoppingList = await ShoppingList.create({
                location:id
            });
        }
        res.status(200).json({
            shoppingList
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}




export async function getShoppingList(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const shoppingList:IShoppingList|null =  await ShoppingList.findOne({'_id':id}).exec();
        res.status(200).json({
            shoppingList
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
        await ShoppingList.findByIdAndDelete({'_id':id});
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