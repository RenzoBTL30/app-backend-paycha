import { pool } from "../database.js";
import * as usuario from "./usuario.controller.js";

export const asignarRolUsuario = async (req, res) => {

    const id = parseInt(req.params.id); //id_usuario
    const P_id_rol = req.body.id_rol;

    try {
      pool.query(
        "INSERT INTO tb_usuario_rol (id_usuario, id_rol) VALUES(?, ?);",
        [id, P_id_rol],
        function (err, result) {
          try {
            return res.status(200).json(result);
          } catch (error) {
            return res.status(500).json("Error al insertar");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al insertar");
    }
};


export const crearRol = async (req, res) => {

  const P_nombre = req.body.nombre;

  try {
    pool.query(
      "INSERT INTO tb_rol (nombre) VALUES(?);",
      [P_nombre],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al insertar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al insertar");
  }
};

export const updateRolUsuario = async (req, res) => {

  const P_id_rol = req.body.id_rol;
  const id = parseInt(req.params.id); //id_usuario

  try {
    pool.query(
      "UPDATE tb_usuario_rol SET id_rol=? WHERE id_usuario=?;",
      [P_id_rol, id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al insertar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al insertar");
  }
};


export const updateRol = async (req, res) => {

  const P_nombre = req.body.nombre;
  const id = parseInt(req.params.id); //id_rol

  try {
    pool.query(
      "UPDATE tb_rol SET nombre=? WHERE id_rol=?;",
      [P_nombre, id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al actualizar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al actualizar");
  }
};


export const listarRol = async (req, res) => {

  try {
    pool.query(
      "SELECT * FROM tb_rol;",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar rol");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar rol");
  }
};

export const listarRolTrabajador = async (req, res) => {

  try {
    pool.query(
      "SELECT * FROM tb_rol WHERE nombre != 'Cliente';",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar rol");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar rol");
  }
};

/*
export const deleteRol = async (req, res) => {

  const id = parseInt(req.params.id); //id_rol

  try {
    pool.query(
      "UPDATE tb_rol SET estado=0 WHERE id_rol=?;",
      [id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al eliminar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al eliminar");
  }
};
*/