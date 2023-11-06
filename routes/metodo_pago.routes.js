import { Router } from "express";
import * as metodoPago from "../controllers/metodo_pago.controller.js";
import passport from "passport";
const router = Router();

router.get("/listar", metodoPago.getMetodoPago);
//router.post("/crear", lugar.createLugar);
//router.put("/update/:id", lugar.updateLugar);
//router.put("/delete/:id", lugar.deleteLugar);

export default router;