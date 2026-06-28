import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            // Extract token from request headers
            const token = req.headers.authorization;

            // Check if the token exists
            if (!token) {
            return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Access denied. Authorization token is missing.",
                })
            }

            // JWT Verification
            const decoded = jwt.verify(
                token as string,
                config.secret as string,
            ) as JwtPayload;

            // Query database to find user by decoded email
            const userData = await pool.query( `
                SELECT * FROM users 
                WHERE email=$1   
            `,
                [decoded.email],
            );

            // User Not Found Handling
            if (userData.rows.length === 0) {
            return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "No user account associated with this token.",
                })
            }

            const user = userData.rows[0];

            // Enforce role-based access control
            if (roles.length && !roles.includes(user.role)) {
            return sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Access denied. Your role does not have permission to access this resource.",
                })
            }

            // Attach Decoded Payload
            req.user = decoded;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;