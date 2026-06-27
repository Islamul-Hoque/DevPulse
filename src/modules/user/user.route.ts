import { Router } from "express";
import { userController } from "./user.controller";
// import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

// New user Create ==> "POST" 
router.post("/signup", userController.createUser);

// // "GET" All User
// router.get("/signup", auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user), userController.getAllUsers);

// // "GET" Single user
// router.get("/signup/:id", userController.getSingleUser);

// // Update user info using "PUT" method
// router.put("/signup/:id", userController.updateUser);

// // "DELETE" a user
// router.delete("/signup/:id", userController.deleteUser);


export const userRoute = router;