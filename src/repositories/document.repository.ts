import pool from "../config/database"

export const findAllDocument = async (limit: number, skip: number) => {
    const result = await pool.query('SELECT * FROM documents OFFSET $1 LIMIT $2', [skip, limit]);

    const documents = result.rows;

    const totalQuery = await pool.query('SELECT COUNT(*) FROM documents');

    const totalCount = totalQuery.rows[0].count;

    return { documents, totalCount};
}

export const findAllDocumentByStatus = async () => {

}