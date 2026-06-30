import { type Request, type Response } from 'express'
import sendResponse from '../../utility/sendResponse';
import { issueService } from './issue.service';
import { StatusCodes } from 'http-status-codes';

// Create new issue
const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;

        // Get reporter_id
        const reporter_id = req.user?.id;

        // If reporter_id is missing,
        if (!reporter_id) {
            return sendResponse(res, {
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Unauthorized"
            });
        }

        // insert new issue into database
        const result = await issueService.createIssueIntoDB({ title, description, type, reporter_id });

        // success response
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result
        })
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
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
                statusCode: StatusCodes.OK,
                success: true,
                message: "No issues found matching your filters.",
                data: []
            });
        }

        // Success response
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issues retrieved successfully",
            data: result
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong.",
            error: error
        })
    }
}

// Get single issue controller
const getSingleIssue = async (req: Request, res: Response) => {
    try {
        // Extract issue ID 
        const { id } = req.params;
        const issue = await issueService.getSingleIssueFromDB(Number(id));

        // If issue not found
        if (!issue) {
            return sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        // Success response
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue retrieved successfully",
            data: issue,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong.",
            error,
        });
    }
};

// Update issue with role-based access
const updateIssue = async (req: Request, res: Response) => {

    // Extract issue ID 
    const { id } = req.params;

    try {
        // Fetch existing issue from DB
        const existingIssue = await issueService.getSingleIssueFromDB(Number(id));

        // Handle not-found
        if (!existingIssue) {
            return sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: 'Issue not found'
            });
        }

        // Extract logged in user info from request
        const loggedInUserId = req.user?.id;
        const userRole = req.user?.role;

        // If user not authenticated
        if (!loggedInUserId) {
            return sendResponse(res, {
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: 'Unauthorized'
            });
        }

        // role based issue update logic 
        if (userRole === 'contributor') {
            if (existingIssue.reporter?.id !== loggedInUserId) {
                return sendResponse(res, {
                    statusCode: StatusCodes.UNAUTHORIZED,
                    success: false,
                    message: 'You are not authorized to update this issue'
                });
            }
            if (existingIssue.status !== 'open') {
                return sendResponse(res, {
                    statusCode: StatusCodes.UNAUTHORIZED,
                    success: false,
                    message: "You can only update issues with an 'open' status"
                });
            }
        }

        // Perform update operation in DB
        const result = await issueService.updateIssueInDB(Number(id), req.body);

        // Success response
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue updated successfully",
            data: result
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error instanceof Error ? error.message : "Internal server error. Please try again later.",
            error: error
        });
    }
};

// Delete issues (Maintainer only)
const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    // try {
    //     const userRole = req.user?.role;
    //     if (userRole !== 'maintainer') {
    //         return sendResponse(res, {
    //             statusCode: StatusCodes.FORBIDDEN,
    //             success: false,
    //             message: "You are not maintainer to delete this issue"
    //         })
    //     }

    //     const result = await issueService.deleteIssueFromDB(Number(id));

    //     if (!result) {
    //         return sendResponse(res, {
    //             statusCode: StatusCodes.NOT_FOUND,
    //             success: false,
    //             message: "Issue not found"
    //         });
    //     }


    //     // Success response
    //     sendResponse(res, {
    //         statusCode: StatusCodes.OK,
    //         success: true,
    //         message: "Issue deleted successfully"
    //     })
    // } catch (error) {
    //     sendResponse(res, {
    //         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    //         success: false,
    //         message: error instanceof Error ? error.message : "Internal server error.",
    //         error: error
    //     })
    // }
}


export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}