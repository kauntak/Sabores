import { Response, Request } from "express";

import { Order, IOrder, IOrderDoc } from "../../models/order";
import { IError, returnError } from "../../models/error";

export async function createOrder(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const order = new Order(body);
        const newOrder = await order.save();
        const orders = await Order.find();
        res.status(201).json({
            order: newOrder,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateOrder(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const order: IOrder|null = await Order.findByIdAndUpdate({'_id':id}, body, {new:true});
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            order,
            orders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function completeOrders(req: Request, res: Response): Promise<void>{
    try {
        const {params: {ids}, query:{completedBatchId}} = req;
        const result:ReturnType<typeof Order.updateMany> = Order.updateMany({'_id':{$in:ids.split(",")}}, {completedBatchId, isCompleted:true, expire_at:new Date()});
        if(!((await result).acknowledged)){

        }
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            orders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}



export async function getOrders(req: Request, res:Response):Promise<void>{
    try{
        const orders: IOrder[] = await Order.find({}, {}, {sort:{createdAt:"desc"}});
        res.status(200).json({
            orders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getOrder(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const order:IOrder|null = await Order.findOne({'_id':id}).exec();
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            order,
            orders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getActiveOrderByLocation(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        let order:IOrder|null =  await Order.findOne({location:id, isFulfilled:false}).exec();
        console.log(order, id);
        if(order===null)
            order = await Order.create({
                location:id
            });
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            order,
            orders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteOrder(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Order.findByIdAndDelete({'_id':id});
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            orders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}