import pool from "../config/database"

export const findAllCategories = async () => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
}

export const getCategoryBySlug = async (slug: string) => {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return result.rows[0];
}

export const getCategoryByName = async (name: string) => {
    const result = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    return result.rows[0];
}

export const addNewCategory = async (name: string, slug: string, description: string) => {
    await pool.query(`
        INSERT INTO categories (name, slug, description) 
        VALUES ($1, $2, $3)
        `, 
        [name, slug, description]
    );
}