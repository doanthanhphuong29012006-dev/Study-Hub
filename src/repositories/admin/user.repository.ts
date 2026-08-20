import pool from "../../config/database";
import * as helpers from '../../helpers/pagination.helper';

export const getAllUser = async (limit: number, page: number, email: string) => {
    const skip = (page - 1) * limit;

    let query = `
        SELECT id, email, full_name, role, status, created_at, avatar
        FROM users 
        WHERE 1 = 1 
    `;
    let countQuery = `
        SELECT COUNT(*) 
        FROM users 
        WHERE 1 = 1 
    `;
    let paramsIdx = 1;
    const values: any[] = [];
    const countValues: any[] = [];
    
    if (email !== undefined && email.trim() !== "") {
        const emailCondition = `AND email ILIKE $${paramsIdx} `
        query += emailCondition;
        countQuery += emailCondition;
        paramsIdx++;
        const searchKeyword = `%${email}%`;
        values.push(searchKeyword);
        countValues.push(searchKeyword);
    }

    query += `ORDER BY created_at DESC OFFSET $${paramsIdx} LIMIT $${paramsIdx + 1}`;
    values.push(skip);
    values.push(limit);

    const [queryUsers, queryCount] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, countValues)
    ]);

    let users = [];
    let pagination = null;

    const totalCount = parseInt(queryCount.rows[0].count);
    if (totalCount > 0) {
        users = queryUsers.rows;
        pagination = helpers.pagination(page, limit, totalCount);
    }

    return { users, pagination };
}