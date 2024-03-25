import { Router } from "express";
import * as dashboard from "../controllers/dashboard.controller.js";
import passport from "passport";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.get("/ventas-completadas/:fecha_inicio/:fecha_fin", auth.auth, dashboard.ventasCompletadasPorFecha);
router.get("/ventas-canceladas/:fecha_inicio/:fecha_fin", auth.auth, dashboard.ventasCanceladasPorFecha);

export default router;