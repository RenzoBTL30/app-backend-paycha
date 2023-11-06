import { Router } from "express";
import * as tipoAcompanamiento from "../controllers/tipo_acompanamiento.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/crear", auth.auth, tipoAcompanamiento.createTipoAcomp);
router.get("/listar", tipoAcompanamiento.listarTipoAcomp);
router.put("/actualizar/:id", auth.auth, tipoAcompanamiento.editarTipoAcomp);
router.delete("/delete/:id", auth.auth, tipoAcompanamiento.deleteTipoAcomp);


export default router;