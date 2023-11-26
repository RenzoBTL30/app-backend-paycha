import { Router } from "express";
import * as puntos from "../controllers/puntos.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/canjear/:id", auth.auth, puntos.canjearPuntos);
router.post("/ganar/:id", auth.auth, puntos.ganarPuntos);
router.get("/actualizar/:id", auth.auth, puntos.actualizarPuntos);


export default router;