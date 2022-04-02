import express, {NextFunction, Request, Response} from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import path from 'path';
import routes from './routes/routes';

require('dotenv').config({ path: __dirname + '/.env'});
const logger = require('morgan');

const app = express();

const PORT:number = Number(process.env.PORT ?? 8080);

const MONGO_URI:string = process.env.MONGO_URI ?? 'mongodb://username:password@host:port/database?options...';

mongoose.connect(MONGO_URI, (error):void => {
    if(error) console.log(error);
    else console.log("Mongo DB Connection successful.");
});



app.use(logger('tiny'));
app.post('*', (req:Request, res:Response, next:NextFunction)=> {
    console.log(req);
    next();
});

app.use(routes);


app.listen(PORT, ():void => console.log(`Server started on ${PORT}`));