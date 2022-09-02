import { Response, Request } from "express";

import { EmployeeLog, IEmployeeLog } from "../../models/employeeLog";
import { Employee, IEmployee } from "../../models/employee";
import { Reminder, IReminder } from "../../models/reminder";

import { returnError } from "../../models/error";

export async function createEmployeeLog(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const log = new EmployeeLog({
            body
        })
        const newLog = await log.save();
        const logs = await EmployeeLog.find();
        res.status(201).json({
            log: newLog,
            logs: logs
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateEmployeeLog(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const log: (IEmployeeLog & {_id:string})|null = await EmployeeLog.findByIdAndUpdate({'_id':id}, body , {new: true, runValidators:true});
        const logs: IEmployeeLog[] = await EmployeeLog.find();
        res.status(200).json({
            log,
            logs
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getEmployeesMostRecentLog(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        let log:IEmployeeLog|null =  await EmployeeLog.findOne({employee:id, checkOutTime:{$exists:false}},{}, {sort:{checkInTime:-1}}).exec();
        let createNewLog:boolean = false;
        if(log !== null 
            && log.checkInTime!== undefined 
            && (Date.now() - log.checkInTime.getTime()) > 54000000
        ){
            log.checkOutTime = new Date(log.checkInTime.getTime() + 54000000);
            await EmployeeLog.findOneAndUpdate({_id:log._id}, log).exec();
            createNewLog = true;
        }
        if(log===null || createNewLog) {
            const employee:IEmployee|null = await Employee.findById({_id:id});
            if(employee===null) {
                res.status(500).json({error: returnError("Employee not found")});
                return;
            }
            const reminders:IReminder[] = await Reminder.find({role:employee.role});
            log = await EmployeeLog.create({
                employee:id,
                reminder:reminders.map(reminder => {
                    return {
                        reminderId: reminder._id,
                        isCompleted: false
                    };
                })
            });
        }
        res.status(200).json({
            log
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getEmployeesLog(req: Request, res:Response):Promise<void>{
    try{
        const {params: {employeeId}} = req;
        const logs:IEmployeeLog[]|null =  await EmployeeLog.find({employee:employeeId}).exec();
        res.status(200).json({
            logs
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getEmployeeLogsByDateRange(req:Request, res:Response):Promise<void>{
    try {
        const {params: {startDate, endDate}} = req;

        const start = startDate?new Date(startDate):new Date();
        const end = endDate?new Date(endDate):new Date();
        const logs: IEmployeeLog[]|null = await EmployeeLog.find({$gte:start, $lte:end}).exec();
        res.status(200).json({
            logs
        });
    } catch(error) {
        res.status(500).json({
            error:returnError(error)
        });
    }
}


export async function getEmployeeLogs(req: Request, res:Response):Promise<void>{
    try{
        const logs: IEmployeeLog[] = await EmployeeLog.find();
        res.status(200).json({
            logs
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteEmployeeLog(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await EmployeeLog.findByIdAndDelete({'_id':id});
        const logs: IEmployeeLog[] = await EmployeeLog.find();
        res.status(200).json({
            logs
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}
