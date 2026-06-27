import bcrypt from "bcryptjs";
import config from "../../config";
import { pool } from "./../../db/index";
import jwt, { type JwtPayload } from "jsonwebtoken";

const loginUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
    const { email, password } = payload;

    // Check if user exists in database
    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
    `, [email],
    );


    if (userData.rows.length === 0) {
        throw new Error("Invalid email or password.");
    }

    // 2. Compare password 
    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new Error("Invalid email or password.");
    }

    // Prepare JWT payload 
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    // Generate token
    const token = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: "1d",
    });

    // Delete password
    delete user.password;

    return { token, user };
};


export const authService = {
    loginUserIntoDB,
};