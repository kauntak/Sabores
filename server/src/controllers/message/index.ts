import { Response, Request } from "express";

import { Message, IMessage, IMessageDoc } from "../../models/message";
import { IError, returnError } from "../../models/error";

export async function createMessage(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const message = new Message(body);
        const newMessage = await message.save();
        const messages = await Message.find();
        res.status(201).json({
            message: newMessage,
            messages: messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateMessage(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const message: IMessage|null = await Message.findByIdAndUpdate({'_id':id}, body, {new:true});
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            message,
            messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function readMessage(req:Request, res: Response): Promise<void>{
    try {
        const {params: {id} } = req;
        const message: IMessage|null = await Message.findByIdAndUpdate({'_id':id}, {isRead:true, expireAt:Date.now()}, {new:true});
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            message,
            messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function lockMessage(req:Request, res: Response): Promise<void>{
    try {
        const {params: {id} } = req;
        const message: IMessage|null = await Message.findByIdAndUpdate({'_id':id}, {$unset:{expireAt:undefined}, $set:{isLocked:true}}, {new: true});
        console.log(message);
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            message,
            messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function unlockMessage(req:Request, res: Response): Promise<void>{
    try {
        const {params: {id} } = req;
        const message: IMessage|null = await Message.findByIdAndUpdate({'_id':id}, {$set:{isLocked:false, expireAt:Date.now()}}, {new: true});
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            message,
            messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getMessagesByDateRange(req:Request, res:Response):Promise<void>{
    try {
        const {params: {startDate, endDate}} = req;

        const start = startDate?new Date(startDate):new Date();
        const end = endDate?new Date(endDate):new Date();
        const messages: IMessage[]|null = await Message.find({$gte:start, $lte:end}).exec();
        res.status(200).json({
            messages
        })
    } catch(error) {
        res.status(500).json({
            error:returnError(error)
        });
    }
}

export async function getMessagesByEmployee(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const messages: IMessage[] = await Message.find({to:id});
        res.status(200).json({
            messages
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getMessage(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const message:IMessage|null =  await Message.findOne({'_id':id}).exec();
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            message,
            messages
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteMessage(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Message.findByIdAndDelete({'_id':id});
        const messages: IMessage[] = await Message.find();
        res.status(200).json({
            messages
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}