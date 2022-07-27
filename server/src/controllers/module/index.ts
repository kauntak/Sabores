import { Response, Request } from "express";

import { Module, IModule, IModuleDoc } from "../../models/module";
import { IError, returnError } from "../../models/error";

export async function createModule(req: Request, res: Response): Promise<void>{
    try {
        const {body} = req;
        console.log(body);
        const module = new Module(body);
        const newModule = await module.save();
        const modules = await Module.find();
        res.status(201).json({
            module: newModule,
            modules: modules
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateModule(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const module: IModule|null = await Module.findByIdAndUpdate({'_id':id}, body);
        const modules: IModule[] = await Module.find();
        res.status(200).json({
            module,
            modules
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function getModules(req: Request, res:Response):Promise<void>{
    try{
        const modules: IModule[] = await Module.find();
        res.status(200).json({
            modules
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteModule(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Module.findByIdAndDelete({'_id':id});
        const modules: IModule[] = await Module.find();
        res.status(200).json({
            modules
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}