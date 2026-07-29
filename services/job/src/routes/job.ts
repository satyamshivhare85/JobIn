import express from "express"
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";
import { createCompany, createJob, deleteCOmpany, getAllActiveJobs, getAllApplicationForJob, getAllCompany, getCompanyDetails, getSingleJob, updateApplication, updateJob } from "../controllers/job.js";

const router=express.Router();

router.post('/company/new',isAuth,uploadFile,createCompany);
router.delete('/company/:companyId',isAuth,deleteCOmpany)
router.post("/new",isAuth,createJob)

router.put('/update/:jobId', isAuth, updateJob)
router.get('/company/all',isAuth,getAllCompany)
router.get('/company/:id',isAuth,getCompanyDetails)
router.get('/all',getAllActiveJobs);
router.get("/:jobId",getSingleJob);
router.get("/application/:jobId",isAuth,getAllApplicationForJob)
router.put('/application/update/:id',isAuth,updateApplication);
export default router;