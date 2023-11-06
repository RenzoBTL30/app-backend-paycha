import { Router } from "express";
import * as categoria from "../controllers/categoria.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/crear", auth.auth, categoria.createCategoria);
router.get("/listar", categoria.listarCategoria);
router.put("/actualizar/:id", auth.auth, categoria.editarCategoria);
router.delete("/delete/:id", auth.auth, categoria.deleteCategoria);


export default router;