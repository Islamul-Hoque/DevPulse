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
const getAllIssuesFromDB = async (sort: string = "newest", type?: string, status?: string) => {

    let query = `SELECT * FROM issues`;
    const values: any[] = [];
    const conditions: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) query += ` WHERE ` + conditions.join(" AND ");

    // Query parameter for sorting 
    query += sort === "oldest"
        ? ` ORDER BY created_at ASC`
        : ` ORDER BY created_at DESC`;

    // Issues fetch and empty case handle
    const issuesResult = await pool.query(query, values);
    const issues = issuesResult.rows;

    if (issues.length === 0) return [];

    // Collect reporter_ids
    const reporterIds = issues.map((issue) => issue.reporter_id);

    // Fetch reporter details in batch
    const reportersResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1)`,
        [reporterIds]
    );
    const reporters = reportersResult.rows;

    // Merge reporter details into issues
    const enrichedIssues = issues.map(({ reporter_id, created_at, updated_at, ...issue }) => {
        const reporter = reporters.find((r) => r.id === reporter_id);
        return {
            ...issue,
            reporter: reporter
                ? {
                    id: reporter.id,
                    name: reporter.name,
                    role: reporter.role,
                }
                : null,
            created_at,
            updated_at,
        };
    });

    return enrichedIssues;
};

// Get single issue by ID
const getSingleIssueFromDB = async (id: number) => {

    // Issue fetch by ID
    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );
    const issue = issueResult.rows[0];

    // Handle not found issue
    if (!issue) return null;

    // Fetch reporter details
    const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );
    const reporter = reporterResult.rows[0];

    // // Merge reporter details
    const { reporter_id, created_at, updated_at, ...rest } = issue;

    return {
        ...rest,
        reporter: reporter
            ? {
                id: reporter.id,
                name: reporter.name,
                role: reporter.role,
            }
            : null,
        created_at,
        updated_at,
    };
};

// Update issue
const updateIssueInDB = async (id: number, payload: IIssue) => {
    const { title, description, type, status } = payload;

    const result = await pool.query(`
        UPDATE issues SET 
            title = COALESCE($1, title), 
            description = COALESCE($2, description), 
            type = COALESCE($3, type), 
            status = COALESCE($4, status),
            updated_at = NOW()
        WHERE id = $5 
        RETURNING *`,
        [title, description, type, status, id]
    );

    return result.rows[0];
}

// Delete issue (Maintainer only)
const deleteIssueFromDB = async (id: number) => {
    const result = await pool.query(`
        DELETE FROM issues 
            WHERE id = $1 
        RETURNING *
        `, [id]
    );
    return result.rows[0];
}

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueInDB,
    deleteIssueFromDB
}