import routes from '../backend/routes/routes.js';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { error } from 'console';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


dotenv.config();
const app = express();
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname,'../../frontend')));
const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGOURL;

const connect = ()=>{mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls:true
    }).then(()=>{
        console.log('Database Connected Successfully!');

        app.listen(PORT,()=>{
            console.log(`Server running on address: http://localhost:${PORT}`);
        });
    }).catch((error)=>{
        console.log('Database connection failed!');
        console.error(error);
        process.exit(1);
    });
};
connect();


const allowedOrigins = ['http://localhost:3000','http://localhost:5500','http://127.0.0.1:5500'];

app.use(cors({
    origin:function (origin,callback){
        if (!origin || allowedOrigins.includes(origin)){
            callback (null,true);
        }
        else{
            callback(new Error('Not allowed by CORS.'));
        }
    }
}));

app.use("/alphaQuest",routes);
app.get("/",(req,res)=>{
    return res.write(`<h1>In root Directory!<\h1>`)
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});