const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { getUsers, getUserByEmail, AddUser } = require('../models/User.js');

class authController
{
    async registration(req, res)
    {
        try
        {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(400).json(
                {
                    message: "Error occured via registration",
                    errors: errors
                })
            }
            const {email, password} = req.body
            const condidates = await getUserByEmail(email);
            if(condidates.length != 0)
            {
                return res.status(400).json({message: "User with this email already exists!!!!"})
            }
            const passwordHash = bcrypt.hashSync(password, 5);
            const result = await AddUser(email, passwordHash);
            res.status(200).json(result);
        }
        catch(e)
        {
            console.log(e);
            res.status(400).json({message: "Registration error"});
        }
    }

    async login(req, res)
    {
        try
        {

        }
        catch(e)
        {
            console.log(e);
            res.status(400).json({message: "Login error"});
        }
    }

    async getUser(req, res)
    {
        try
        {
            const result = await getUsers();
            res.json(result);
        }
        catch(e)
        {
            console.log(e);
            res.status(400).json({message: "Get User error"});
        }
    }
}

module.exports = new authController()