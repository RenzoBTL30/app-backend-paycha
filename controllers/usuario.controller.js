import { pool } from "../database.js";
import * as auth from "../controllers/auth.controller.js"
import bcrypt from "bcryptjs";

export const createUsuario = async (req, res) => {

    const hash = await bcrypt.hash(req.body.contrasenia, 10);

    const P_email = req.body.email;
    const P_nombre = req.body.nombre;
    const P_apellidos = req.body.apellidos;
    const P_celular = req.body.celular;
    const P_contrasenia = hash;
    const P_puntos = 50;


    try {
      pool.query(
        "INSERT INTO tb_usuario (email, nombre, apellidos, celular, contrasenia, puntos_descuento, estado) VALUES(?, ?, ?, ?, ?, ?, '1');",
        [P_email, P_nombre, P_apellidos, P_celular, P_contrasenia, P_puntos],
        function (err, result) {
          try {
            return res.status(200).json({
                success: true,
                message: "El registro se ha completado correctamente",
                id_usuario: result.insertId
            });
          } catch (error) {
            return res.status(500).json("Error al crear usuarios");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear error al crear usuarios");
    }
};

export const updateUsuario = async (req, res) => {

  const id = parseInt(req.params.id);

  const P_email = req.body.email;
  const P_nombre = req.body.nombre;
  const P_apellidos = req.body.apellidos;
  const P_celular = req.body.celular;

    try {
      pool.query(
        "UPDATE tb_usuario SET email=?, nombre=?, apellidos=?, celular=? WHERE id_usuario=?;",
        [P_email, P_nombre, P_apellidos, P_celular, id],
        function (err, result) {
          try {

            //Se coloca este codigo para que luego de que se actualice el usuario con el UPDATE de arriba, se ejecute este método para almacenar ese usuario actualizado en el myData
            auth.findById(id,(err,myData) => {

              //Se envia nuevamente el token al usuario modificado
              myData.session_token = req.body.session_token;

              //console.log("Usuario modificado: ", myData);
              return res.status(200).json({
                  success: true,
                  message: "La actualización se ha completado correctamente",
                  data: myData,
                  id: id
              });
            })

          } catch (error) {
            return res.status(500).json("Error al actualizar usuario");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al actualizar error al actualizar usuarios");
    }
  

  
};

export const updateUsuarioContra = async (req, res) => {

  const hash = await bcrypt.hash(req.body.contrasenia, 10);

  const id = parseInt(req.params.id);

  const P_contrasenia = hash;
  try {
    pool.query(
      "UPDATE tb_usuario SET contrasenia=? WHERE id_usuario=?;",
      [P_contrasenia, id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "La actualización de contraseña se ha completado correctamente",
          });
        } catch (error) {
          return res.status(500).json("Error al actualizar usuario");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al actualizar error al actualizar usuarios");
  }
};

export const listarUsuariosEmpresa = async (req, res) => {

  try {
    pool.query(
      "SELECT u.id_usuario, u.email, u.nombre, u.apellidos, u.celular, r.id_rol, r.nombre as rol, u.puntos_descuento, u.estado FROM tb_usuario_rol as ur JOIN tb_usuario as u ON ur.id_usuario = u.id_usuario JOIN tb_rol as r ON ur.id_rol = r.id_rol WHERE u.estado = 1 && r.nombre != 'Cliente';",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar usuario");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar usuario");
  }
};

export const listarUsuariosCliente = async (req, res) => {

  try {
    pool.query(
      "SELECT u.id_usuario, u.email, u.nombre, u.apellidos, u.celular, r.id_rol, r.nombre as rol, u.puntos_descuento, u.estado FROM tb_usuario_rol as ur JOIN tb_usuario as u ON ur.id_usuario = u.id_usuario JOIN tb_rol as r ON ur.id_rol = r.id_rol WHERE u.estado = 1 && r.nombre = 'Cliente';",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar usuario");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar usuario");
  }
};

export const listarUsuarioPorId = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT u.id_usuario, u.email, u.nombre, u.apellidos, u.celular, r.id_rol, r.nombre as rol, u.puntos_descuento, u.estado FROM tb_usuario_rol as ur JOIN tb_usuario as u ON ur.id_usuario = u.id_usuario JOIN tb_rol as r ON ur.id_rol = r.id_rol WHERE u.estado = 1 && u.id_usuario = ?;", [id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar usuario");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar usuario");
  }
};

export const deleteUsuario = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "UPDATE tb_usuario SET estado=0 WHERE id_usuario=?;",
      [id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "La eliminacion se ha completado correctamente",
          });
        } catch (error) {
          return res.status(500).json("Error al eliminar usuario");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al eliminar error al eliminar usuarios");
  }
};

export const updatePuntosDescUsuario = (req, res) => {

  const id = parseInt(req.params.id);
  const P_puntos_descuento = req.body.puntos_descuento;


  try {
    pool.query(
      "UPDATE tb_usuario SET puntos_descuento=? WHERE id_usuario=?;",
      [P_puntos_descuento, id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "El registro se ha completado correctamente",
              id_usuario: result.insertId
          });
        } catch (error) {
          return res.status(500).json("Error al crear usuarios");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al crear error al crear usuarios");
  }
};