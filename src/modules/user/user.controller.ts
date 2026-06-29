import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserIntoDB(req.body);

        // Success response
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User registered successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: error,
        });
    }
}

export const userController = {
    createUser,
};