import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", auth.login);
//router.post("/id", auth.findById);


export default router;