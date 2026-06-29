import { pool } from "../../db/index.js";
import type { IIssue } from "./issue.interface.js";

// Create new issue
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

// Get all issues
// const getAllIssuesFromDB = async ( sort: string = "newest", type?: string, status?: string) => {
//     // 1. Build base query for issues
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
//         query += ` WHERE ` + conditions.join(" AND ");
//     }

//     query += sort === "oldest"  ? ` ORDER BY created_at ASC`  : ` ORDER BY created_at DESC`;

//     // 2. Fetch issues
//     const issuesResult = await pool.query(query, values);
//     const issues = issuesResult.rows;

//     if (issues.length === 0) return [];

//     // 3. Collect reporter_ids
//     const reporterIds = issues.map((issue) => issue.reporter_id);

//     // 4. Fetch reporter details in batch
//     const reportersResult = await pool.query(
//         `SELECT id, name, role FROM users WHERE id = ANY($1)`,
//         [reporterIds]
//     );
//     const reporters = reportersResult.rows;

//     // 5. Merge reporter details into issues
//     const enrichedIssues = issues.map((issue) => {
//         const reporter = reporters.find((r) => r.id === issue.reporter_id);
//         return {
//             ...issue,
//             reporter: reporter
//                 ? {
//                     id: reporter.id,
//                     name: reporter.name,
//                     role: reporter.role,
//                 }
//                 : null,
//         };
//     });

//     return enrichedIssues;
// };




// const getAllIssuesFromDB = async (sort: string = 'newest', type?: string, status?: string) => {
//     // Query
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
    getAllIssuesFromDB,
    //     getSingleIssueFromDB,
    //     updateIssueInDB,
    //     deleteIssueFromDB
}