import { pool } from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import nodemailer from "nodemailer";
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
              message: 'Datos incorrectos',
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
              message: 'Datos incorrectos'
          });
      }

      
  });

};


export const loginTrabajador = (req, res) => {

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
              message: 'Datos incorrectos',
          });
      }

      if (miUsuario.rol == 'Cliente') {
        return res.status(401).json({
            success: false,
            message: 'No estás autorizado para ingresar',
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
              message: 'Datos incorrectos'
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


export const enviarLinkRecuperacionContra = async (req, res) => {

  const P_email = req.body.email;

  if (await validarEmail(P_email)) {
    // Aplicar puntos por medio de un procedimiento almacenado en MySQL

    const usuario = await findIdUsuarioAndNameByEmail(P_email);
    
    try {
      
      const token = jwt.sign({id: usuario.id_usuario}, process.env.secretOrKey, {expiresIn: "5m"});

      const transporter = nodemailer.createTransport({
        host: "mail.lapaycha.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "no-reply@lapaycha.com",
          pass: "5J*?o+2DF+9?",
        },
      });

      const mailOptions = {
        from: 'no-reply@lapaycha.com',
        to: `${P_email}`,
        subject: 'Restablece tu contraseña',
        html: 
        `
        <h2> Hola ${usuario.nombre} </h2>
        <p>Se realizó una solicitud de restablecimiento de contraseña, si no fuiste tú, ignora este email.</p>
        <p>El siguiente enlace tiene una duración de <b> 5 minutos. <b></p>
        <p><a href="http://localhost:4200/reset-password/${usuario.id_usuario}/${token}">Haz clic aquí para restablecer tu contraseña</a></p>
        `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return res.status(500).json('Error inesperado, el correo no se pudo enviar',error);
          //console.log(error);
        } else {
          return res.status(200).json({ success: true });
          //console.log('Email sent: ' + info.response);
        }
      });

    } catch (error) {
      return res.status(500).json('Error',error);
    }
    
    
  } else {
    return res.status(500).json('Email inválido');
  }
};


const validarEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
          "CALL validarEmail(?, @resultado);",
          [email],
          (err, result) => {
            if (err) {
              console.error('Error al validar el email: ', err);
              reject(err);
            }
    
            pool.query('SELECT @resultado AS resultado', (err, result) => {
              if (err) {
                console.error('Error al obtener el resultado del procedimiento almacenado: ', err);
                //return res.status(500).json('Error al aplicar puntos');
              }
    
              const resultado = result[0].resultado;
              if (resultado == 1) {
                resolve(true);
              } else {
                resolve(false);
              }
            }); 
          }
        );
    });
};


const findIdUsuarioAndNameByEmail = (email) => {
  return new Promise((resolve, reject) => {
      pool.query(
        "SELECT id_usuario, nombre FROM tb_usuario WHERE email=?;",
        [email],
        (err, result) => {
          if (err) {
            console.error('Error al buscar:', err);
            reject(err);
          } else {
            resolve(result[0]);
          }
        }
      );
  });
};


export const restablecerContra = async (req, res) => {

  const id = parseInt(req.params.id);
  const token = req.params.token;

  const contrasenia = req.body.contrasenia;

  try {

    jwt.verify(token, process.env.secretOrKey, async (err, decoded) => {

      if (err) {
        return res.status(500).json('El link es inválido o ha expirado');
      } else {

        const hash = await bcrypt.hash(contrasenia, 10);

        pool.query(
          "UPDATE tb_usuario SET contrasenia=? WHERE id_usuario=?;",
          [hash, id],
          function (err, result) {
            try {
              return res.status(200).json({
                  success: true,
              });
            } catch (error) {
              return res.status(500).json('Error al restablecer');
            }
          }
        );
      }

    });

    
  } catch (error) {
    return res.status(500).json('Error');
  }
};