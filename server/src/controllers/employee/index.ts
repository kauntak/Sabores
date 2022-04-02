import { Response, Request } from "express";

import { Employee, IEmployee } from "../../models/employee";
import { IError, returnError } from "../../models/error";

export async function createEmployee(req: Request, res: Response): Promise<void>{
    try {
        const body = req.body;
        const employee = new Employee(body);
        const newEmployee = await employee.save();
        const employees = await Employee.find();
        res.status(201).json({
            employee: newEmployee,
            employees: employees
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateEmployee(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const updateEmployee: IEmployee|null = await Employee.findByIdAndUpdate({_id:id}, body);
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employee: updateEmployee,
            employees: allEmployees
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getEmployee(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req.body;
        const employee:IEmployee|null =  id === 'all' ? null : await Employee.findOne({_id:id}).exec();
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employee: employee,
            employees: allEmployees
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteEmployee(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Employee.findByIdAndDelete({_id:id});
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employees: allEmployees
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}
