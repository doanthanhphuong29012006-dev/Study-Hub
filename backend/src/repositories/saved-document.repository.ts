import pool from "../config/database"
import * as helpers from "../helpers/pagination.helper";

export const saveDocument = async (documentId: string, userId: string) => {
    const documentQuery = await pool.query('SELECT status FROM documents WHERE id = $1', [documentId]);

    if (documentQuery.rowCount === 0) {
        throw new Error("Document_Not_Found");
    }

    const doc = documentQuery.rows[0];

    if (doc.status !== 'approved') {
        throw new Error("Document_Not_Allow");
    }

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
        SELECT COUNT(sd.document_id)
        FROM saved_documents sd
        JOIN documents d ON d.id = sd.document_id
        WHERE sd.user_id = $1 AND d.status = 'approved'
    `, [userId]);

    const totalCount = parseInt(savedDocumentsCount.rows[0].count);
    if (totalCount === 0) {
        return {
            savedDocuments: [],
            pagination: helpers.pagination(page, limit, 0)
        };
    }

    const savedDocumentsQuery = await pool.query(`
        SELECT d.id, d.title, d.description, d.file_type, d.file_size, d.status, 
            d.view_count, d.download_count, d.created_at, d.category_id, d.uploader_id, 
            sd.created_at AS saved_at 
        FROM saved_documents sd
        JOIN documents d ON d.id = sd.document_id
        WHERE sd.user_id = $1 AND d.status = 'approved'
        ORDER BY sd.created_at DESC
        OFFSET $2 LIMIT $3
        `, [userId, skip, limit]
    );

    const savedDocuments = savedDocumentsQuery.rows;

    const pagination = helpers.pagination(page, limit, totalCount);

    return { savedDocuments, pagination }
}

export const checkSaveStatus = async (userId: string, documentId: string) => {
    const result = await pool.query(`
        SELECT 1 
        FROM saved_documents 
        WHERE document_id = $1 AND user_id = $2`, 
        [documentId, userId]
    );

    if (result.rowCount === 0) {
        return false;
    }

    return true;
}