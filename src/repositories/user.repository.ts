import pool from "../config/database"

export const getUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * from users WHERE email = $1',
        [email]
    );
    return result;
}

export const createUser = async (email: string, fullName: string, password: string) => {
    await pool.query(
        `INSERT INTO users (email, password_hash, full_name) 
        VALUES ($1, $2, $3)
        `, 
        [email, password, fullName]
    );
}