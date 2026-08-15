import pool from "../config/database"

export const findAllDocument = async (limit: number, skip: number, categoryId?: any, sortedBy?: any, order?: any) => {
    let query = `
        SELECT d.*, 
            COUNT(r.id) AS review_count,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
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

export const findDocumentById = async (documentId: string) => {
    const query = `
        WITH update_doc AS (
            UPDATE documents
            SET view_count = view_count + 1
            WHERE id = $1
            RETURNING *
        )
        SELECT d.*,
            u.full_name AS uploader_name,
            u.avatar AS uploader_avatar,
            c.name AS category_title,

            COALESCE((SELECT COUNT(id) FROM reviews WHERE document_id = d.id), 0) AS review_count,

            COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE document_id = d.id), 0) AS average_rating
        FROM update_doc d
        LEFT JOIN users u ON d.uploader_id = u.id
        LEFT JOIN categories c ON d.category_id = c.id
    `;
    const result = await pool.query(query, [documentId]);

    if (result.rows.length === 0) {
        throw new Error("Document_Not_Found");
    }
    return result.rows[0];
}

export const increaseDocumentDownloadCount = async (documentId: string) => {
    const query = `
        UPDATE documents
        SET download_count = download_count + 1
        WHERE id = $1
        RETURNING file_url
    `;

    const result = await pool.query(query, [documentId]);

    if (result.rows.length === 0) {
        throw new Error("Document_Not_Found");
    }

    return result.rows[0].file_url;
}

export const updateDocumentById = async (
    documentId: string,
    title?: string,
    description?: string,
    categoryId?: string
) => {
    const documentQuery = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);

    if (documentQuery.rowCount === 0) {
        throw Error("Document_Not_Found");
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramsIdx = 1;

    if (title !== undefined) {
        updates.push(`title = $${paramsIdx}`);
        values.push(title);
        paramsIdx++;
    }

    if (description !== undefined) {
        updates.push(`description = $${paramsIdx}`);
        values.push(description);
        paramsIdx++;
    }

    if (categoryId !== undefined) {
        updates.push(`category_id = $${paramsIdx}`);
        values.push(categoryId);
        paramsIdx++;
    }

    if (updates.length === 0) return;

    let query = `
        UPDATE documents
        SET ${updates.join(', ')}
        WHERE id = $${paramsIdx}
    `;

    values.push(documentId);

    await pool.query(query, values);
}

export const deleteDocumentById = async (documentId: string) => {
    const query = `
        DELETE FROM documents
        WHERE id = $1
        RETURNING file_url
    `;
    const result = await pool.query(query, [documentId]);

    if (result.rows.length === 0) {
        throw new Error("Document_Not_Found");
    }

    return result.rows[0].file_url;
}