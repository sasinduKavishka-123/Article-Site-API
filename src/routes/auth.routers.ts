import {Router} from "express"
import {register, login, getMyDetails, getRefreshToken, getAllUsersCount} from "../controllers/auth.controller"
import {authenticate} from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", getRefreshToken)
router.get("/me", authenticate, getMyDetails)
router.get("/countAll", getAllUsersCount)

export default router