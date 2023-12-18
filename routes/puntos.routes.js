import { Router } from "express";
import * as puntos from "../controllers/puntos.controller.js";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/aplicar/:id", auth.auth, puntos.aplicarPuntosParaDescuento);
//router.post("/calcular", auth.auth, puntos.calcularPuntosGanados);
router.post("/canjear/:id", auth.auth, puntos.canjearPuntos);
router.put("/actualizar/:id", auth.auth, puntos.actualizarPuntos);

export default router;