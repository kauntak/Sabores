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
        const log: IEmployeeLog|null = await EmployeeLog.findByIdAndUpdate({_id:id}, body);
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


export async function getEmployeeLog(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const log:IEmployeeLog|null =  id === 'all' ? null : await EmployeeLog.findOne({_id:id}).exec();
        const logs: IEmployeeLog[] = await EmployeeLog.find();
        res.status(200).json({
            log,
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
        await EmployeeLog.findByIdAndDelete({_id:id});
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
