// import bcrypt from "bcryptjs";
// import config from "../../config";
// import { pool } from "./../../db/index";
// import jwt, { type JwtPayload } from "jsonwebtoken";

// // Login user into DB
// const loginUserIntoDB = async (payload: {
//     email: string;
//     password: string;
// }) => {
//     const { email, password } = payload;

//     // 1. Check if user exists in database
//     const userData = await pool.query(`
//         SELECT * FROM users WHERE email=$1
//     `, [email],
//     );

//     // Handle case: when no user is found for the provided email
//     if (userData.rows.length === 0) {
//         throw new Error("Invalid email or password.");
//     }

//     // 2. Compare provided password with hashed password
//     const user = userData.rows[0];
//     const matchPassword = await bcrypt.compare(password, user.password);

//     if (!matchPassword) {
//         throw new Error("Invalid email or password.");
//     }

//     // 3. Prepare JWT payload with user info
//     const jwtPayload = {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//     };

//     // 4. Generate access token (short‑lived)
//     const token = jwt.sign(jwtPayload, config.secret as string, {
//         expiresIn: "1d",
//     });

//     // 6. Return both tokens
//     return { token };
// };



// export const authService = {
//     loginUserIntoDB,
// };