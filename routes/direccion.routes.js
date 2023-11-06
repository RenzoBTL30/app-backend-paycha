import { Router } from "express";
import * as direccion from "../controllers/direccion.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"

const router = Router();

router.post("/crear", auth.auth, direccion.createDireccion);
router.get("/buscarPorUsuario/:id", direccion.findByUsuario);
router.get("/buscarporid/:id", direccion.findById);
router.put("/actualizar/:id", auth.auth, direccion.editarDireccion);


export default router;