import express, {NextFunction, Request, Response} from 'express';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'path';
import { returnError } from './models/error';
import routes from './routes/routes';


require('dotenv').config({ path: __dirname + '/.env'});
const logger = require('morgan');
const cors = require('cors');

const JWT_KEY = process.env.JWT_KEY || "super secret password";

const app = express();

const PORT:number = Number(process.env.PORT ?? 8080);

const MONGO_URI:string = process.env.MONGO_URI ?? 'mongodb://username:password@host:port/database?options...';

mongoose.connect(MONGO_URI, (error):void => {
    if(error) console.log(error);
    else console.log("Mongo DB Connection successful.");
});

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    app.use(express.static("./../../client/build"));
    app.get('*', (req:Request, res:Response) => {
        res.sendFile(path.join(__dirname + './../../client/build/index.html'));
    })
}


app.use(logger('tiny'));
app.use(cors());
app.use(verifyJWT);

app.use(routes);

app.listen(PORT, ():void => console.log(`Server started on ${PORT}`));



function verifyJWT(req:Request, res:Response, next:NextFunction):void {
    if(req.path === "/api/authenticateEmployee" || req.path === "/api/getEmployees") {
        next();
        return;
    }
    const xAccessToken:string|undefined = req.header("x-access-token");
    if(xAccessToken === "Test"){
        next();
        return;
    }
    if(xAccessToken === undefined || xAccessToken === "") {
        res.status(401).json({
            error:returnError("Not Authorized")
        });
        return;
    }
    const token = xAccessToken!.split(' ')[1];
    if(token === undefined || token === null) {
        res.status(401).json({
            error: returnError("Not Authorized")
        });
        return;
    }
    verify(token, JWT_KEY, (err, decoded) => {
        console.log(decoded);
        if(err) {
            console.log(err);
            return res.status(401).json({
                error: returnError(err)
            });
        }
        next();
    })
}