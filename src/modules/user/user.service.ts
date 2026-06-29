import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, role } = payload;

    // Password Hashing
    const hashPassword = await bcrypt.hash(password, 10);

    // Query
    const result = await pool.query(`
        INSERT INTO users(name, email, password, role) 
            VALUES($1,$2,$3, COALESCE($4,'contributor')) 
        RETURNING *
        `,
        [name, email, hashPassword, role],
    );

    // Delete password
    delete result.rows[0].password;
    return result;
};

export const userService = {
    createUserIntoDB,
};