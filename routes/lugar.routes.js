import { Router } from "express";
import * as lugar from "../controllers/lugar.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.get("/listar", lugar.getLugares);
router.get("/listarweb", lugar.getLugaresWeb);
router.post("/crear", auth.auth, lugar.createLugar);
router.put("/update/:id", auth.auth, lugar.updateLugar);
router.put("/delete/:id", auth.auth, lugar.deleteLugar);

export default router;