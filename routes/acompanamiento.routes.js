import { Router } from "express";
import * as acompanamiento from "../controllers/acompanamiento.controller.js";
import * as auth from "../middlewares/authenticate.js"
import passport from "passport";
const router = Router();

router.post("/crear", auth.auth, acompanamiento.createAcomp);
router.get("/listar", acompanamiento.listarAcomp);
router.put("/actualizar/:id", auth.auth, acompanamiento.editarAcomp);
router.put("/delete/:id", auth.auth, acompanamiento.deleteAcomp);

router.post("/crear/prodacomp", auth.auth, acompanamiento.asignarAcompProducto);
//router.put("/actualizar/prodacomp/:id", acompanamiento.editarAcompProducto);
router.get("/listar/prodacomp/:id", acompanamiento.listarAcompProducto);
router.get("/listar/acompsprod/:id", acompanamiento.listarProductoAcomps);
router.get("/listar/prodsporacomp/:id", acompanamiento.listarProductosPorAcomps);


export default router;