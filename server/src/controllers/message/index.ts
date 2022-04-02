import { Response, Request } from "express";

import { Message, IMessage, IMessageDoc } from "../../models/message";
import { IError, returnError } from "../../models/error";

export async function createMessage(req: Request, res: Response): Promise<void>{
    try {
        const body = req.body;
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
        const message: IMessage|null = await Message.findByIdAndUpdate({_id:id}, body);
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


export async function getMessage(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req.body;
        const message:IMessage|null =  id === 'all' ? null : await Message.findOne({_id:id}).exec();
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
        await Message.findByIdAndDelete({_id:id});
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