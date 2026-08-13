import pool from "../config/database"

export const findAllCategories = async () => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
}