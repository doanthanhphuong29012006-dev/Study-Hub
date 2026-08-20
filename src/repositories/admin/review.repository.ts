import pool from "../../config/database";
import * as helpers from "../../helpers/pagination.helper";

export const getAllReviewsGlobal = async (page: number, skip: number, limit: number, keyword: string) => {
    let query = `
        SELECT r.*,
               d.title,
               u.email, u.full_name
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        JOIN documents d ON d.id = r.document_id
        WHERE 1 = 1 
    `;

    let countQuery = `
        SELECT COUNT(*)
        FROM reviews r
        WHERE 1 = 1 
    `;

    let paramsIdx = 1;
    const values: any[] = [];
    const countValues: any[] = [];
    if (keyword !== undefined) {
        const searchCondition = `AND r.comment ILIKE $${paramsIdx} `;
        query += searchCondition;
        countQuery += searchCondition;

        const searchKeyword = `%${keyword}%`;
        values.push(searchKeyword);
        countValues.push(searchKeyword);

        paramsIdx++;
    }

    query += `ORDER BY r.created_at DESC OFFSET $${paramsIdx} LIMIT $${paramsIdx + 1}`;
    values.push(skip, limit);

    const [reviewsQuery, totalCountQuery] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, countValues)
    ]);

    const pagination = helpers.pagination(page, limit, parseInt(totalCountQuery.rows[0].count));

    const reviews = reviewsQuery.rows;

    return { reviews, pagination};
}