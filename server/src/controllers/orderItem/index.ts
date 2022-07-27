import { Response, Request } from "express";

import { OrderItem, IOrderItem, IOrderItemDoc } from "../../models/orderItem";
import { IError, returnError } from "../../models/error";

export async function createOrderItem(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const orderItem = new OrderItem(body);
        const newOrderItem = await orderItem.save();
        const orderItems = await OrderItem.find();
        res.status(201).json({
            orderItem: newOrderItem,
            orderItems: orderItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateOrderItem(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const orderItem: IOrderItem|null = await OrderItem.findByIdAndUpdate({'_id':id}, body);
        const orderItems: IOrderItem[] = await OrderItem.find();
        res.status(200).json({
            orderItem,
            orderItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}



export async function getOrderItems(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const orderItems: IOrderItem[] = await OrderItem.find();
        res.status(200).json({
            orderItems
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}



export async function getOrderItem(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const orderItem: IOrderItem|null = await OrderItem.findOne({_id:id});
        const orderItems: IOrderItem[] = await OrderItem.find();
        res.status(200).json({
            orderItem,
            orderItems
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteOrderItem(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await OrderItem.findByIdAndDelete({'_id':id});
        const orderItems: IOrderItem[] = await OrderItem.find();
        res.status(200).json({
            orderItems
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}