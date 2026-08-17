import pool from "../config/database"

export const getUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * from users WHERE email = $1',
        [email]
    );
    return result;
}

export const createUser = async (email: string, fullName: string, password: string) => {
    await pool.query(
        `INSERT INTO users (email, password_hash, full_name) 
        VALUES ($1, $2, $3)
        `, 
        [email, password, fullName]
    );
}

export const getInfoUserById = async (userId: string) => {
    const userQuery = await pool.query(`
        SELECT id, email, full_name, avatar FROM users 
        WHERE id = $1`, 
        [userId]
    );

    if (userQuery.rowCount === 0) {
        throw Error("User_Not_Found");
    }

    const user = userQuery.rows[0];

    return user;
}

export const updateInfoUserById = async (userId: string, fullName?: string, avatar?: string) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramsIdx = 1;

    if (fullName !== undefined) {
        updates.push(`full_name = $${paramsIdx}`);
        values.push(fullName);
        paramsIdx++;
    }

    if (avatar !== undefined) {
        updates.push(`avatar = $${paramsIdx}`);
        values.push(avatar);
        paramsIdx++;
    }

    if (updates.length == 0) {
        return;
    }

    let query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramsIdx}
    `;

    values.push(userId);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        throw Error("User_Not_Found");
    }
}

export const getMyDocument = async (userId: string) => {
    const documents = await pool.query(`
        SELECT d.*,
            c.name AS category_title, 
            COUNT (r.id) AS review_count,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
        FROM documents d
        LEFT JOIN categories c ON c.id = d.category_id
        LEFT JOIN reviews r ON r.document_id = d.id 
        WHERE d.uploader_id = $1
        GROUP BY d.id, c.name
        ORDER BY d.created_at DESC
        `, 
        [userId]
    );

    return documents.rows;
}