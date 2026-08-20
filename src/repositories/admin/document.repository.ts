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