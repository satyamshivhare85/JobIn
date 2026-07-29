import express from "express"
import { isAuth } from "../middleware/auth.js";
import { addSkillToUser, applyForJob, deleteSkillFromUser, getAllaplications, getUserProfile, myProfile, updatedProfilePic, updateResume, updateUserProfile } from "../controllers/user.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();
router.put('/resume',isAuth,uploadFile,updateResume);
router.get('/me',isAuth,myProfile);
router.get('/:userId',isAuth,getUserProfile);
router.put(`/updatePic`,isAuth,uploadFile,updatedProfilePic)
router.put('/update/profile',isAuth,updateUserProfile)
router.post("/apply/job",isAuth,applyForJob)
router.get("/application/all",isAuth,getAllaplications)


router.post('/skill/add',isAuth,addSkillToUser);
router.put('/skill/delete',isAuth,deleteSkillFromUser);

export default router;