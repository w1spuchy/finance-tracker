const pool = require('../db.js');

async function GetUsers()
{
    const [ rows ] = await pool.query(`SELECT * FROM users`);
    return rows;
}

async function GetUserByEmail(email)
{
    const [ rows ] = await pool.query(`
        SELECT idUser, email, password_hash as passwordHash FROM users WHERE email = ? LIMIT 1
    `, [email]);
    return rows;
}

async function AddUser(email, passwordHash) {
    const [ result ] = await pool.query(
    `
        INSERT INTO users(email, password_hash) VALUES (?,?)
    `,
    [email, passwordHash])
    
    return await GetUserByEmail(email);
}

module.exports = { GetUsers, GetUserByEmail, AddUser };