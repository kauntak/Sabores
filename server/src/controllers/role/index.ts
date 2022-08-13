import { Response, Request } from "express";

import { Role, IRole, IRoleDoc } from "../../models/role";
import { IError, returnError } from "../../models/error";

export async function createRole(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        const role = new Role(body);
        const newRole = await role.save();
        const roles = await Role.find();
        res.status(201).json({
            role: newRole,
            roles: roles
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateRole(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const role: IRole|null = await Role.findByIdAndUpdate({'_id':id}, body, {new:true});
        const roles: IRole[] = await Role.find();
        res.status(200).json({
            role,
            roles
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getRoles(req: Request, res:Response):Promise<void>{
    try{
        const roles: IRole[] = await Role.find();
        res.status(200).json({
            roles
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getRole(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        const role:IRole|null = await Role.findOne({'_id':id}).exec();
        const roles: IRole[] = await Role.find();
        res.status(200).json({
            role,
            roles
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteRole(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Role.findByIdAndDelete({'_id':id});
        const roles: IRole[] = await Role.find();
        res.status(200).json({
            roles
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}