import pool from "../config/database"

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