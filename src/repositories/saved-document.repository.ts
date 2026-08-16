import pool from "../config/database"
import * as helpers from "../helpers/pagination.helper";

export const saveDocument = async (documentId: string, userId: string) => {
    await pool.query(`
        INSERT INTO saved_documents (document_id, user_id) 
        VALUES ($1, $2)`, 
        [documentId, userId]
    );
}

export const unsaveDocument = async (documentId: string, userId: string) => {
    const result = await pool.query(`
        DELETE FROM saved_documents WHERE document_id = $1 AND user_id = $2`, 
        [documentId, userId]
    );

    if (result.rowCount === 0) {
        throw Error("Saved_Document_Error");
    }
}

export const getDocumentUserSaved = async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const savedDocumentsCount = await pool.query(`
        SELECT COUNT(*) 
        FROM saved_documents 
        WHERE user_id = $1
        `, [userId]
    );

    const totalCount = parseInt(savedDocumentsCount.rows[0].count);
    if (totalCount === 0) {
        return {
            savedDocuments: [],
            pagination: helpers.pagination(page, limit, 0)
        };
    }

    const savedDocumentsQuery = await pool.query(`
        SELECT d.*, sd.created_at AS saved_at 
        FROM saved_documents sd
        JOIN documents d ON d.id = sd.document_id
        WHERE sd.user_id = $1
        ORDER BY sd.created_at DESC
        OFFSET $2 LIMIT $3
        `, [userId, skip, limit]
    );

    const savedDocuments = savedDocumentsQuery.rows;

    const pagination = helpers.pagination(page, limit, savedDocumentsCount.rows[0].count);

    return { savedDocuments, pagination }
}