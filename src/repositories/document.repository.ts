import pool from "../config/database"

export const findAllDocument = async (limit: number, skip: number, categoryId?: any, sortedBy?: any, order?: any) => {
    let query = `
        SELECT d.*, COUNT(r.id) AS review_count
        FROM documents d
        LEFT JOIN reviews r ON d.id = r.document_id 
        WHERE 1 = 1 
    `;

    let countQuery = `SELECT COUNT(id) FROM documents WHERE 1 = 1 `;

    const values: any[] = [];
    const countValues: any[] = []
    let paramsIdx = 1;

    if (categoryId) {
        values.push(categoryId);
        countValues.push(categoryId);
        query += `AND d.category_id = $${paramsIdx} `;
        countQuery += `AND category_id = $${paramsIdx}`
        paramsIdx++;
    }

    query += `GROUP BY d.id `;

    const allowedSortFields = ['created_at', 'review_count', 'view_count', 'download_count'];
    const allowedOrderFields = ['ASC', 'DESC'];

    const safeSortBy = allowedSortFields.includes(sortedBy) ? sortedBy : 'created_at';
    const safeOrderBy = allowedOrderFields.includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'DESC';

    query += `ORDER BY ${safeSortBy} ${safeOrderBy} `;

    query += `OFFSET $${paramsIdx} LIMIT $${paramsIdx + 1}`;
    values.push(skip, limit);

    const result = await pool.query(query, values);

    const documents = result.rows;

    const totalQuery = await pool.query(countQuery, countValues);

    const totalCount = totalQuery.rows[0].count;

    return { documents, totalCount};
}

export const createNewDocument = async (
    fileUrl: string, 
    fileSize: number,
    fileType: string, 
    title: string,
    description: string,
    categoryId: string,
    userId: string
) => {
    const userQuery = await pool.query(`
        SELECT full_name, email, role, avatar 
        FROM users 
        WHERE id = $1`, 
        [userId]
    );

    const user = userQuery.rows[0];
    if (!user) {
        throw Error("Does_Not_Exist_User")
    }

    const categoryQuery = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    const category = categoryQuery.rows[0];
    if (!category) {
        throw Error("Does_Not_Exist_Category")
    }

    await pool.query(`
            INSERT INTO documents (
                file_url, 
                file_size,
                file_type, 
                title,
                description,
                category_id,
                uploader_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [fileUrl, fileSize, fileType, title, description, categoryId, userId]);
}