const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { GetUsers, GetUserByEmail, AddUser } = require('../models/User.js');
const {secret} = require('../../config.js');

const generateAccessToken = (id, email) => 
{
    const payload = {
        id: id,
        email: email
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

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
            const condidate = await GetUserByEmail(email);
            if(condidate.length != 0)
            {
                return res.status(400).json({message: "User with this email already exists"})
            }
            const passwordHash = bcrypt.hashSync(password, 5);
            const result = await AddUser(email, passwordHash);
            res.status(200).json(result);
        }
        catch(e)
        {
            console.log(e);
            res.status(500).json({message: "Registration error"});
        }
    }

    async login(req, res)
    {
        try
        {
            const {email, password} = req.body;
            const [ user ] = await GetUserByEmail(email);
            console.log(user)
            if(!user)
            {
                res.status(400).json({message: "User not found"});
            }

            const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
            if(!isPasswordValid)
            {
                res.status(400).json({message: "Password is invalid"});
            }

            const token = generateAccessToken(user.idUser, user.email);
            return res.status(200).json({token});
        }
        catch(e)
        {
            console.log(e);
            res.status(500).json({message: "Login error"});
        }
    }

    async getUsers(req, res)
    {
        try
        {
            const result = await GetUsers();
            res.json(result);
        }
        catch(e)
        {
            console.log(e);
            res.status(500).json({message: "Get User error"});
        }
    }
}

module.exports = new authController()