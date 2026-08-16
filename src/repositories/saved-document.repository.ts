import pool from "../config/database"

export const saveDocument = async (documentId: string, userId: string) => {
    await pool.query(`
        INSERT INTO saved_documents (document_id, user_id) 
        VALUES ($1, $2)`, 
        [documentId, userId]
    );
}