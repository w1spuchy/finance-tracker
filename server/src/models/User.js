const pool = require('../db.js');

async function getUsers()
{
    const [ rows ] = await pool.query(`SELECT * FROM users`);
    return rows;
}

async function getUserByEmail(email)
{
    const [ rows ] = await pool.query(`
        SELECT * FROM users WHERE email = ?
    `, [email]);
    return rows;
}

async function AddUser(email, passwordHash) {
    const [ result ] = await pool.query(
    `
        INSERT INTO users(email, password_hash) VALUES (?,?)
    `,
    [email, passwordHash])
    
    return await getUserByEmail(email);
}

module.exports = { getUsers, getUserByEmail, AddUser };