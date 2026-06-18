const dotenv = require("dotenv");
dotenv.config();
const app = require("./app.js");
const pool = require('./db.js');
const authRouter = require('../routes/authRouter.js');
const PORT = process.env.PORT || 5000;


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