import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

// protected
router.post('/', auth(USER_ROLE.contributor, USER_ROLE.maintainer), issueController.createIssue);

// public 
router.get('/', issueController.getAllIssues);
router.get('/:id', issueController.getSingleIssue);

// protected
router.patch('/:id', auth(USER_ROLE.contributor, USER_ROLE.maintainer), issueController.updateIssue);
router.delete('/:id',auth(USER_ROLE.maintainer), issueController.deleteIssue)

export const issueRoute = router;