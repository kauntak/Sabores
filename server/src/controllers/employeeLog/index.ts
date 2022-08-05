import { Response, Request } from "express";

import { EmployeeLog, IEmployeeLog, IEmployeeLogDoc } from "../../models/employeeLog";
import { IError, returnError } from "../../models/error";

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
        const log: IEmployeeLog|null = await EmployeeLog.findByIdAndUpdate({'_id':id}, body);
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
        console.log(log);
        let createNewLog:boolean = false;
        if(log !== null && log.checkInTime!== undefined && (log.checkInTime.getTime() - Date.now()) > 54000000){
            log.checkOutTime = new Date(log.checkInTime.getTime() + 54000000);
            await EmployeeLog.findOneAndUpdate({_id:log._id}, log).exec();
            createNewLog = true;
        }
        if(log===null || createNewLog) {
            log = await EmployeeLog.create({employee:id});
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
