import { pool } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import { secretOrKey } from '../keys.js';



export const login = (req, res) => {

  const {email,contrasenia} = req.body;
  
  findByEmail( email, async (err, miUsuario) => {
  
      if (err) {
          return res.status(501).json({
              success: false,
              message: 'Hubo un error',
              error: err
          });
      }

      if (!miUsuario) {
          return res.status(401).json({
              success: false,
              message: 'El email no fue encontrado',
          });
      }

      const isPasswordValid = await bcrypt.compare(contrasenia, miUsuario.contrasenia);

      if (isPasswordValid) {
          const token = jwt.sign({id_usuario: miUsuario.id_usuario, email: miUsuario.email}, process.env.secretOrKey, {});

          const data = {
              id_usuario: `${miUsuario.id_usuario}`,
              email: miUsuario.email,
              nombre: miUsuario.nombre,
              apellidos: miUsuario.apellidos,
              celular: miUsuario.celular,
              estado: miUsuario.estado,
              rol: miUsuario.rol,
              session_token: `JWT ${token}`
          }

          return res.status(201).json({
              success: true,
              message: 'El usuario fue autenticado',
              data: data
          });
      }

      else {
          return res.status(401).json({
              success: false,
              message: 'La contraseña es incorrecta'
          });
      }

      
  });

};

export const findById = (id, result) => {

  // El CONVERT convierte el int a char, esto se hace porque da un error de type 'int' is not a subtype of type 'String?' cuando se traen los datos a la vista de editar usuario con el id.
    pool.query(
      "SELECT CONVERT(U.id_usuario, char) AS id_usuario, U.email, U.nombre, U.apellidos, U.celular, U.contrasenia, R.nombre AS rol FROM tb_usuario AS U INNER JOIN tb_usuario_rol AS UR ON U.id_usuario = UR.id_usuario INNER JOIN tb_rol AS R ON UR.id_rol = R.id_rol WHERE U.id_usuario=?;",
      [id],
      function (err, usuario) {
        if (err) {
          console.log("Error");
          result(err, null);
  
        } else {
          //console.log("Usuario obtenido: ", usuario[0]);
          result(null, usuario[0]);
        }
      }
    );
};


const findByEmail = (email, result) => {

  pool.query(
    "SELECT U.id_usuario, U.email, U.nombre, U.apellidos, U.celular, U.contrasenia, R.nombre AS rol FROM tb_usuario AS U INNER JOIN tb_usuario_rol AS UR ON U.id_usuario = UR.id_usuario INNER JOIN tb_rol AS R ON UR.id_rol = R.id_rol WHERE U.email=?;",
    [email],
    function (err, usuario) {
      if (err) {
        console.log("Error");
        result(err, null);

      } else {
        console.log("Usuario obtenido: ", usuario[0]);
        result(null, usuario[0]);
      }
    }
  );
};



