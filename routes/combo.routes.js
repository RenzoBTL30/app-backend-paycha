import { Router } from "express";
import * as combo from "../controllers/combo.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"

const router = Router();

router.post("/crear", auth.auth, combo.createCombo);
router.get("/listar", combo.listarCombo);
router.put("/actualizar/:id", auth.auth, combo.editarCombo);
router.put("/delete/:id", auth.auth, combo.deleteCombo);

router.post("/crear/prodcombo", auth.auth, combo.asignarComboProducto);
//router.put("/actualizar/prodcombo/:id", combo.editarComboProducto);
router.get("/listar/prodcombo/:id", combo.listarComboProducto);
router.get("/listar/prodsporcombo/:id", combo.listarProductosPorCombo);


export default router;