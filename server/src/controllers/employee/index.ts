import { Response, Request } from "express";

import { Employee, IEmployee, IEmployeeLoginData } from "../../models/employee";
import { IError, returnError } from "../../models/error";

import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcrypt";

import {config} from 'dotenv';
config({ path: __dirname + '/./../../.env'});

const JWT_KEY = process.env.JWT_KEY || "super secret key";
const tokenExpirySeconds:number = parseInt(process.env.TOKEN_EXPIRY_SECONDS||"0") || 290;


export async function createEmployee(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        body.password = await hash(body.password, 10);
        const employee = new Employee(body);
        console.log(employee);
        const newEmployee = await employee.save();
        const employees = await Employee.find();
        
        res.status(201).json({
            employee: newEmployee,
            employees: filterEmployeesData(employees)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateEmployee(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        if(body.password !== undefined){
            body.password = await hash(body.password, 10);
        }
        const updateEmployee: IEmployee|null = await Employee.findByIdAndUpdate({'_id':id}, body, {new:true});
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employee: updateEmployee,
            employees: filterEmployeesData(allEmployees)
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getEmployees(req: Request, res:Response):Promise<void>{
    try{
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employees: filterEmployeesData(allEmployees)
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getEmployee(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const employee:IEmployee|null =  await Employee.findOne({'_id':id}).exec();
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employee: employee,
            employees: filterEmployeesData(allEmployees)
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function authenticateEmployee(req: Request, res:Response):Promise<void>{
    try{
        const employeeLoginData:IEmployeeLoginData = req.body;
        const employee: IEmployee|null = await Employee.findOne({_id:employeeLoginData.id}).exec();
        console.log(employee);
        if(employee === null){
            res.status(401).json({
                error: returnError("Employee not found.")
            });
            return;
        }
        compare(employeeLoginData.password, employee!.password)
            .then((isMatching:boolean) => {
                if(isMatching){
                    sign(
                        {id:employeeLoginData.id},
                        JWT_KEY,
                        {expiresIn:tokenExpirySeconds},
                        (err, token) => {
                            if(err) {
                                return res.status(401).json({
                                    error: returnError(err)
                                });
                            }
                            const returnEmployee = {
                                _id:employee._id,
                                firstName:employee.firstName,
                                lastName:employee.lastName,
                                role:employee.role,
                                access:employee.access,
                                checkedIn: employee.checkedIn
                            };
                            return res.status(200).json({
                                token: `Bearer ${token}`,
                                employee: returnEmployee
                            });
                        }
                    )
                } else {
                    return res.status(401).json({
                        error: returnError("Invalid password.")
                    })
                }
            })
    } catch(err) {
        res.status(401).json({
            error: returnError(err)
        });
    }
}

export async function deleteEmployee(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Employee.findByIdAndDelete({'_id':id});
        const allEmployees: IEmployee[] = await Employee.find();
        res.status(200).json({
            employees: filterEmployeesData(allEmployees)
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

function filterEmployeesData(employees:IEmployee[]):Omit<IEmployee, "password"|"role"|"checkedIn">[] {
    const filteredEmployeeList:Omit<IEmployee, "password"|"role"|"checkedIn">[] = employees.map(employee => {
        return {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
            _id:employee._id,
            access: employee.access
        };
    });
    return filteredEmployeeList;
}