import {Router} from "express"
import {register, login, getMyDetails, getRefreshToken} from "../controllers/auth.controller.ts"
import {authenticate} from "../middleware/auth.ts"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", getRefreshToken)
router.get("/me", authenticate, getMyDetails)

export default router