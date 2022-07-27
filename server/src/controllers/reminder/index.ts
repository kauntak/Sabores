import { Response, Request } from "express";

import { Reminder, IReminder, IReminderDoc } from "../../models/reminder";
import { IError, returnError } from "../../models/error";
import mongoose from "mongoose";

export async function createReminder(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const reminder = new Reminder(body);
        const newReminder = await reminder.save();
        const reminders = await Reminder.find();
        res.status(201).json({
            reminder: newReminder,
            reminders: reminders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateReminder(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const reminder: IReminder|null = await Reminder.findByIdAndUpdate({'_id':id}, body);
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


export async function getReminders(req: Request, res:Response):Promise<void>{
    try{
        const reminders: IReminder[] = await Reminder.find();
        res.status(200).json({
            reminders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getRemindersByIds(req: Request, res:Response):Promise<void>{
    try{
        const {params: {idString}} = req;
        const ids = idString.split(",");
        const reminders: IReminder[] = await Reminder.find({
            _id: { $in : ids.map(id => new mongoose.Types.ObjectId(id))}
        });
        res.status(200).json({
            reminders
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}



export async function getReminderByRoleId(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const reminders:IReminder[]|null = await Reminder.find({role:id}).exec();
        res.status(200).json({
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
        await Reminder.findByIdAndDelete({'_id':id});
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