import { Router } from "express";
import * as rol from "../controllers/rol.controller.js";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/asignar/:id", rol.asignarRolUsuario);
router.post("/crear", auth.auth, rol.crearRol);
router.put("/updaterolusuario/:id", auth.auth, rol.updateRolUsuario);
router.put("/update/:id", auth.auth, rol.updateRol);
router.get("/listar", auth.auth, rol.listarRol);
router.get("/listartrabajador", auth.auth, rol.listarRolTrabajador);


export default router;