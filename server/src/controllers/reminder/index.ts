import { Response, Request } from "express";

import { Reminder, IReminder, IReminderDoc } from "../../models/reminder";
import { IError, returnError } from "../../models/error";

export async function createReminder(req: Request, res: Response): Promise<void>{
    try {
        const body = req.body;
        const reminder = new Reminder(body);
        const newReminder = await reminder.save();
        const reminders = await Reminder.find();
        res.status(201).json({
            reminder: newReminder,
            reminders: reminders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateReminder(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const reminder: IReminder|null = await Reminder.findByIdAndUpdate({_id:id}, body);
        const reminders: IReminder[] = await Reminder.find();
        res.status(200).json({
            reminder,
            reminders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getReminder(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req.body;
        const reminder:IReminder|null =  id === 'all' ? null : await Reminder.findOne({_id:id}).exec();
        const reminders: IReminder[] = await Reminder.find();
        res.status(200).json({
            reminder,
            reminders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteReminder(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Reminder.findByIdAndDelete({_id:id});
        const reminders: IReminder[] = await Reminder.find();
        res.status(200).json({
            reminders
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}