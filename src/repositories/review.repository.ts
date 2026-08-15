import pool from "../config/database";
import * as helpers from "../helpers/pagination.helper";

export const createNewReview = async (rating: number, comment: string, userId: string, documentId: string) => {
    await pool.query(`
            INSERT INTO reviews (rating, comment, user_id, document_id)
            VALUES ($1, $2, $3, $4)
        `, [rating, comment, userId, documentId]);
}

export const getAllReviewInDocument = async (documentId: string, page: number, skip: number, limit: number) => {
    const documentQuery = await pool.query('SELECT * FROM documents WHERE id = $1', [documentId]);
    if (documentQuery.rowCount === 0) {
        throw Error("Document_Not_Found");
    }

    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at,
               u.id AS user_id, u.full_name, u.avatar
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.document_id = $1
        ORDER BY r.created_at DESC
        OFFSET $2 LIMIT $3
    `;

    const totalCountQuery = await pool.query('SELECT COUNT(id) FROM reviews WHERE document_id = $1', [documentId]);

    const pagination = helpers.pagination(page, limit, parseInt(totalCountQuery.rows[0].count));

    const reviewsQuery = await pool.query(query, [documentId, skip, limit]);
    const reviews = reviewsQuery.rows;

    return { reviews, pagination};
}

export const updateReview = async (reviewId: string, userId: string, rating: number, comment: string) => {
    const reviewQuery = await pool.query(`
            UPDATE reviews
            SET rating = $1,
                comment = $2
            WHERE id = $3 AND user_id = $4
        `, [rating, comment, reviewId, userId]);

    if (reviewQuery.rowCount === 0) {
        throw Error("Update_Review_Error");
    }
}