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
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty())
            {
                const message = "Error occured via registration";
                const errors = Array.from(validationErrors.errors).map((err) => err.msg)
                return res.status(400).json({ message, errors })
            }

            const {email, password} = req.body
            const condidate = await GetUserByEmail(email);
            if(condidate.length != 0)
            {
                const message = "User with this email already exists";
                const errors = ["Пользователь с данной почтой уже существует"];
                return res.status(400).json({message, errors})
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
            if(!user)
            {
                const message = "User not found";
                const errors = ["Данный пользователь не был найден"];
                return res.status(400).json({message, errors});
            }

            const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
            if(!isPasswordValid)
            {
                const message = "Password is invalid";
                const errors = ["Неверный пароль"];
                return res.status(400).json({message, errors});
            }

            const token = generateAccessToken(user.idUser, user.email);
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ message: "Login succcessful"});
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