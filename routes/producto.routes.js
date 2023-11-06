import { Router } from "express";
import * as producto from "../controllers/producto.controller.js";
import multer from "multer";
import * as auth from "../middlewares/authenticate.js"

const upload = multer({
    storage: multer.memoryStorage()
});

const router = Router();

router.post("/crear", upload.array('image',1), producto.createProducto);

router.get("/buscar/productos/:id", producto.findByCategoria);
router.get("/buscar/producto/:id", producto.buscarProducto);
router.get("/listar", producto.listarProducto);
router.put("/update/:id", upload.array('image',1), producto.editarProductoConImagen);
router.put("/updatesinimagen/:id", auth.auth, producto.editarProductoSinImagen);
router.put("/updateestadodis/:id/:estadodis", auth.auth, producto.updateEstadoDisponible);
router.put("/delete/:id", auth.auth, producto.deleteProducto);




export default router;