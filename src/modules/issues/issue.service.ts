import { pool } from "../../db/index.js";
import type { IIssue } from "./issue.interface.js";

const createIssueIntoDB = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;

    const result = await pool.query(`
        INSERT INTO 
            issues (title, description, type, reporter_id) 
            VALUES ($1, $2, $3, $4) 
        RETURNING * 
        `,
        [title, description, type, reporter_id]
    );

    return result.rows[0];
}

// const getAllIssuesFromDB = async (sort: string = 'newest', type?: string, status?: string) => {
//     let query = `SELECT * FROM issues`;
//     const values: any[] = [];
//     const conditions: string[] = [];

//     if (type) {
//         values.push(type);
//         conditions.push(`type = $${values.length}`);
//     }

//     if (status) {
//         values.push(status);
//         conditions.push(`status = $${values.length}`);
//     }

//     if (conditions.length > 0) {
//         query += ` WHERE ` + conditions.join(' AND ');
//     }

//     if (sort === 'oldest') {
//         query += ` ORDER BY created_at ASC`;
//     } else {
//         query += ` ORDER BY created_at DESC`;
//     }

//     const result = await pool.query(query, values);
//     return result;
// }

// const getSingleIssueFromDB = async (id: number) => {
//     const result = await pool.query(
//         `SELECT * FROM issues WHERE id = $1`,
//         [id]
//     )
//     return result;
// }

// const updateIssueInDB = async (id: number, payload: IIssue) => {
//     const { title, description, type, status } = payload;

//     const result = await pool.query(
//         `UPDATE issues SET 
//         title = COALESCE($1, title), 
//         description = COALESCE($2, description), 
//         type = COALESCE($3, type), 
//         status = COALESCE($4, status),
//         updated_at = NOW()
//         WHERE id = $5 
//         RETURNING *`,
//         [title, description, type, status, id]
//     );

//     return result.rows[0];
// }

// const deleteIssueFromDB = async (id: number) => {
//     const result = await pool.query(
//         `DELETE FROM issues WHERE id = $1 RETURNING *`,
//         [id]
//     );
//     return result.rows[0];
// }

export const issueService = {
    createIssueIntoDB,
//     getAllIssuesFromDB,
//     getSingleIssueFromDB,
//     updateIssueInDB,
//     deleteIssueFromDB
}