import { type Request, type Response } from 'express'
import sendResponse from '../../utility/sendResponse';
import { issueService } from './issue.service';

// Create new issue
const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;

        // Get reporter_id
        const reporter_id = req.user?.id;

        // If reporter_id is missing,
        if (!reporter_id) {
            return sendResponse(res, {
                statusCode: 401,
                success: false,
                message: "Unauthorized"
            });
        }

        // insert new issue into database
        const result = await issueService.createIssueIntoDB({ title, description, type, reporter_id });

        // success response
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        })
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
            error: error
        })
    }
}

// Get all issues
const getAllIssues = async (req: Request, res: Response) => {
    try {

        // Query extraction
        const { sort, type, status } = req.query;

        // Service call
        const result = await issueService.getAllIssuesFromDB(
            (sort as string) || 'newest',
            type as string,
            status as string
        );

        // Handle empty result
        if (result.length === 0) {
            return sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "No issues found matching your filters.",
                data: []
            });
        }

        // Success response
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong.",
            error: error
        })
    }
}

// const getSingleIssue = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const result = await issueService.getSingleIssueFromDB(Number(id))

//         if (result.rows.length === 0) {
//             return sendResponse(res, {
//                 statusCode: 404,
//                 success: false,
//                 message: "Issue not found",
//             })
//         }

//         const issue = result.rows[0];
//         const userResult = await userService.getSingleUserFromDB(issue.reporter_id);
//         const user = userResult.rows[0];

//         const formattedIssue = {
//             id: issue.id,
//             title: issue.title,
//             description: issue.description,
//             type: issue.type,
//             status: issue.status,
//             reporter: {
//                 id: user.id,
//                 name: user.name,
//                 role: user.role
//             },
//             created_at: issue.created_at,
//             updated_at: issue.updated_at
//         };


//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             data: formattedIssue
//         })

//     } catch (error) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error instanceof Error ? error.message : "An unknown error occurred",
//             error: error
//         })
//     }
// }

// const updateIssue = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const existingIssueResult = await issueService.getSingleIssueFromDB(Number(id));

//         if (existingIssueResult.rows.length === 0) {
//             return sendResponse(res, {
//                 statusCode: 404,
//                 success: false,
//                 message: 'Issue not found'
//             })
//         }

//         const existingIssue = existingIssueResult.rows[0];

//         const loggedInUserId = (req as any).user?.id;
//         const userRole = (req as any).user?.role;

//         if (!loggedInUserId) {
//             return sendResponse(res, {
//                 statusCode: 401,
//                 success: false,
//                 message: 'Unauthorized'
//             })
//         }

//         if (userRole === 'contributor') {
//             if (existingIssue.reporter_id !== loggedInUserId) {
//                 return sendResponse(res, {
//                     statusCode: 403,
//                     success: false,
//                     message: 'You are not authorized to update this issue'
//                 })
//             }
//             if (existingIssue.status !== 'open') {
//                 return sendResponse(res, {
//                     statusCode: 403,
//                     success: false,
//                     message: "You can only update issues with an 'open' status"
//                 })
//             }
//         }


//         const result = await issueService.updateIssueInDB(Number(id), req.body);

//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Issue updated successfully",
//             data: result
//         })
//     } catch (error) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error instanceof Error ? error.message : "An unknown error occurred",
//             error: error
//         })
//     }
// }

// const deleteIssue = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const userRole = (req as any).user?.role;
//         if (userRole !== 'maintainer') {
//             return sendResponse(res, {
//                 statusCode: 403,
//                 success: false,
//                 message: "You are not maintainer to delete this issue"
//             })
//         }

//         const result = await issueService.deleteIssueFromDB(Number(id));

//         sendResponse(res, {
//             statusCode: 200,
//             success: true,
//             message: "Issue deleted successfully"
//         })
//     } catch (error) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error instanceof Error ? error.message : "An unknown error occurred",
//             error: error
//         })
//     }
// }


export const issueController = {
    createIssue,
    getAllIssues,
    // getSingleIssue,
    // updateIssue,
    // deleteIssue
}