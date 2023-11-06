import { Router } from "express";
import * as formaEntrega from "../controllers/forma_entrega.controller.js";
import passport from "passport";
const router = Router();

router.get("/listar", formaEntrega.getFormaEntrega);
//router.post("/crear", lugar.createLugar);
//router.put("/update/:id", lugar.updateLugar);
//router.put("/delete/:id", lugar.deleteLugar);

export default router;