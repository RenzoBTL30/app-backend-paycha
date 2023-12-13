import { Router } from "express";
import * as puntos from "../controllers/puntos.controller.js";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/aplicar/:id", auth.auth, puntos.aplicarPuntos);
router.post("/canjear/:id", auth.auth, puntos.canjearPuntos);
//router.post("/ganar/:id", auth.auth, puntos.ganarPuntos);
router.put("/actualizar/:id", auth.auth, puntos.actualizarPuntos);

export default router;