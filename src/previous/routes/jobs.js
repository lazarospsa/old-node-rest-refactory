import express from "express";

import {
    getJobs,
    createJob,
    getJob,
    deleteJob,
    updateJob,
} from "../controllers/jobs.js";

const router = express.Router();

router.get("/", getJobs);

router.post("/", createJob);

router.get("/:id", getJob);

router.delete("/:id", deleteJob);

router.patch("/:id", updateJob);

export default router;
