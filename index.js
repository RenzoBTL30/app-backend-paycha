import dotenv from 'dotenv';
dotenv.config();

import express, { json, urlencoded } from 'express';
import { createServer } from 'http';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import initializePassport from './passport.js';

import usuarioRoutes from "./routes/usuario.routes.js";
import authRoutes from "./routes/auth.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import direccionRoutes from "./routes/direccion.routes.js";
import ordenRoutes from "./routes/orden.routes.js";
import lugarRoutes from "./routes/lugar.routes.js";
import formaEntregaRoutes from "./routes/forma_entrega.routes.js";
import metodoPagoRoutes from "./routes/metodo_pago.routes.js";
import acompRoutes from "./routes/acompanamiento.routes.js";
import tipoacompRoutes from "./routes/tipo_acompanamiento.routes.js";
import comboRoutes from "./routes/combo.routes.js";

const app = express();

const server = createServer(app);

const port = process.env.PORT || 3000;

app.use(express.json({ limit: '300kb' }));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({
    extended: true
}));

app.use(cors());


app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport); // su equivalente en formato Commonjs es: require('./passport.js')(passport); // se tendría q eliminar el import de arriba si se desea usar en Commonjs

app.disable('x-powered-by');

app.set('port', port);




// Routes
app.use("/api/usuario", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rol",rolRoutes);
app.use("/api/categoria",categoriaRoutes);
app.use("/api/producto",productoRoutes);
app.use("/api/direccion",direccionRoutes);
app.use("/api/orden",ordenRoutes);
app.use("/api/lugar",lugarRoutes);
app.use("/api/formaentrega",formaEntregaRoutes);
app.use("/api/metodopago",metodoPagoRoutes);
app.use("/api/acompanamiento",acompRoutes);
app.use("/api/tipoacompanamiento",tipoacompRoutes);
app.use("/api/combo",comboRoutes);





server.listen(port, () => {  
    console.log('Aplicación de Node en puerto ' + port + ' Iniciada...')
    //console.log(process.version);
})

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

//ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

export { app, server };
