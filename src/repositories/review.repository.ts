import pool from "../config/database";

export const createNewReview = async (rating: number, comment: string, userId: string, documentId: string) => {
    await pool.query(`
            INSERT INTO reviews (rating, comment, user_id, document_id)
            VALUES ($1, $2, $3, $4)
        `, [rating, comment, userId, documentId]);
}