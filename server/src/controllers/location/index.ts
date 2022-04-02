import { Response, Request } from "express";

import { Location, ILocation, ILocationDoc } from "../../models/location";
import { IError, returnError } from "../../models/error";

export async function createLocation(req: Request, res: Response): Promise<void>{
    try {
        const body = req.body;
        const location = new Location(body);
        const newLocation = await location.save();
        const locations = await Location.find();
        res.status(201).json({
            location: newLocation,
            locations: locations
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function updateLocation(req: Request, res: Response): Promise<void>{
    try {
        const {params: {id}, body} = req;
        const location: ILocation|null = await Location.findByIdAndUpdate({_id:id}, body);
        const locations: ILocation[] = await Location.find();
        res.status(200).json({
            location,
            locations
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}


export async function getLocation(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req.body;
        const location:ILocation|null =  id === 'all' ? null : await Location.findOne({_id:id}).exec();
        const locations: ILocation[] = await Location.find();
        res.status(200).json({
            location,
            locations
        });
    } catch(error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}

export async function deleteLocation(req: Request, res:Response):Promise<void>{
    try{
        const {params: {id}} = req;
        await Location.findByIdAndDelete({_id:id});
        const locations: ILocation[] = await Location.find();
        res.status(200).json({
            locations
        });
    } catch (error) {
        res.status(500).json({
            error: returnError(error)
        });
    }
}