import pool from "../../config/database"

export const changeDocumentStatusById = async (documentId: string, status: string) => {
    const docQuery = await pool.query('SELECT status FROM documents WHERE id = $1', [documentId]);

    if (docQuery.rowCount === 0) {
        throw Error("Document_Not_Found");
    }

    if (docQuery.rows[0].status !== status) {
        await pool.query('UPDATE documents SET status = $1 WHERE id = $2', [status, documentId]);
    }
}

export const findAllDocument = async (
    limit: number, 
    skip: number, 
    categoryId?: any, 
    keyword?: string, 
    sortedBy?: any, 
    order?: any
) => {
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
        countQuery += `AND category_id = $${paramsIdx} `;
        paramsIdx++;
    }

    if (keyword) {
        keyword = keyword.trim();

        const searchPattern = `%${keyword}%`;

        values.push(searchPattern);
        countValues.push(searchPattern);

        query += `AND (d.title ILIKE $${paramsIdx} OR d.description ILIKE $${paramsIdx}) `;
        countQuery += `AND (title ILIKE $${paramsIdx} OR description ILIKE $${paramsIdx}) `;

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