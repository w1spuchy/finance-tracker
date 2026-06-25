const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./db.js');
const PORT = process.env.PORT || 5000;

const authRouter = require('./routes/authRouter.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/auth", authRouter);

app.listen(PORT, async ()=>
{
    try
    {
        console.log("server is running");
    }
    catch(e)
    {
        console.log(e);
    }
})