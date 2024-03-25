import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", auth.login);
router.post("/logintrabajador", auth.loginTrabajador);

router.post("/enviar-link-recuperacion-contra", auth.enviarLinkRecuperacionContra);
router.put("/restablecer-contra/:id/:token", auth.restablecerContra);
//router.post("/id", auth.findById);


export default router;