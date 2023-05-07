import express from "express";
import testUser from '../middleware/testUser.js';
import {
    createJob,
    getAllJobs,
    updateJob,
    deleteJob,
    showStats,
} from "../controllers/jobController.js";

const router = express.Router();

router.route("/").post(testUser, createJob).get(getAllJobs);
// remember about :id
router.route("/stats").get(showStats);
router.route("/:id").delete(testUser, deleteJob).patch(testUser, updateJob);

export default router;
