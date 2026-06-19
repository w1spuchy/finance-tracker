const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const pool = require('./db.js');
const PORT = process.env.PORT || 5000;

const authRouter = require('./routes/authRouter.js');

const app = express();
app.use(express.json());
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