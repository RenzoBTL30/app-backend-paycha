import { Router } from "express";
import * as usuario from "../controllers/usuario.controller.js";
import * as auth from "../middlewares/authenticate.js"
const router = Router();

router.post("/crear", usuario.createUsuario);
router.put("/actualizar/:id", auth.auth, usuario.updateUsuario);
router.put("/actualizar/contra/:id", auth.auth, usuario.updateUsuarioContra);
router.put("/updatepuntos/:id", auth.auth, usuario.updatePuntosDescUsuario);
router.put("/delete/:id", auth.auth, usuario.deleteUsuario);
router.get("/listartrabajador", auth.auth, usuario.listarUsuariosEmpresa);
router.get("/listarusuarioporid/:id", usuario.listarUsuarioPorId);
router.get("/listarcliente", usuario.listarUsuariosCliente);





export default router;