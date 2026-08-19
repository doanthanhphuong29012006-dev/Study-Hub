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

export const deleteCategoryById = async (categoryId: string) => {
    const checkQuery = await pool.query('SELECT 1 FROM documents WHERE category_id = $1 LIMIT 1', [categoryId]);
    if (checkQuery.rowCount && checkQuery.rowCount > 0) {
        throw Error("Category_In_Use");
    }

    const result = await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
    if (result.rowCount === 0) {
        throw Error("Category_Not_Found");
    }
}

export const updateCategoryById = async (categoryId: string, name: string, slug: string, description: string) => {
    const existCategory = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    if (existCategory.rowCount === 0) {
        throw Error("Category_Not_Found");
    }

    await pool.query(`
        UPDATE categories
        SET name = COALESCE($1, name),
            slug = COALESCE($2, slug),
            description = COALESCE($3, description)
        WHERE id = $4
    `, [name || null, slug || null, description || null, categoryId]);
}