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

export const getInfoUserById = async (userId: string) => {
    const userQuery = await pool.query(`
        SELECT id, email, full_name, avatar FROM users 
        WHERE id = $1`, 
        [userId]
    );

    if (userQuery.rowCount === 0) {
        throw Error("Get_Info_User_Error");
    }

    const user = userQuery.rows[0];

    return user;
}