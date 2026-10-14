import pool from "../../config/database";

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

export const updateCategoryById = async (categoryId: string, name?: string, slug?: string, description?: string) => {
    const existCategory = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    if (existCategory.rowCount === 0) {
        throw Error("Category_Not_Found");
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramsIdx = 1;

    if (name !== undefined) {
        updates.push(`name = $${paramsIdx}`);
        values.push(name);
        paramsIdx++;
    }

    if (slug !== undefined) {
        updates.push(`slug = $${paramsIdx}`);
        values.push(slug);
        paramsIdx++;
    }

    if (description !== undefined) {
        updates.push(`description = $${paramsIdx}`);
        values.push(description);
        paramsIdx++;
    }

    if (updates.length === 0) {
        return;
    }

    values.push(categoryId);

    const query = `
        UPDATE categories
        SET ${updates.join(', ')}
        WHERE id = $${paramsIdx}
    `;

    await pool.query(query, values);
}