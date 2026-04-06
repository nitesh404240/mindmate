import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { change_accesstoken_and_refreshtoken,updateAddress, changepassword, checkAuth, loginuser, logoutuser, registeruser, updateprofile } from "../controllers/usercontroller.js";
import { verifyJWT } from "../middleware/auth.js";
const router = Router()
//these will be my api for login
router.route("/register").post(upload.single("Avatar"),registeruser)
//http://localhost:8005/mindmate/users/register
router.route("/login").post(loginuser);
//http://localhost:8005/mindmate/users/login
router.route("/logout").post(verifyJWT,logoutuser)
//http://localhost:8005/mindmate/users/logout
router.route("/change-password").post(verifyJWT,changepassword);
router.route("/change-address").patch(verifyJWT,updateAddress);
//http://localhost:8005/mindmate/users/change-password
router.route("/update-profile").patch(upload.fields([{name : "Avatar",maxcount : 1}]),verifyJWT,updateprofile);
//http://localhost:8005/mindmate/users/update-profile
router.route("/change-tokens").get(change_accesstoken_and_refreshtoken);
///http://localhost:8005/mindmate/users/change-tokens
router.route("/check").get(checkAuth);
export default router