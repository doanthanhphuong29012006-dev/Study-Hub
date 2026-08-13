import pool from "../config/database"

export const findAllCategories = async () => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
}

export const getCategoryBySlug = async (slug: string) => {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return result.rows[0];
}