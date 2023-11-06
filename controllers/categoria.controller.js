import { pool } from "../database.js";


export const listarCategoria = async (req, res) => {

  try {
    pool.query(
      "SELECT CONVERT(id_categoria,char)AS id_categoria, nombre FROM tb_categoria;",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar categoria");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar categoria");
  }
};

export const createCategoria = async (req, res) => {

    const P_nombre = req.body.nombre;

    try {
      pool.query(
        "INSERT INTO tb_categoria (nombre) VALUES(?);",
        [P_nombre],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al crear categoria");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear categoria");
    }
};


export const editarCategoria = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_nombre = req.body.nombre;

  try {
    pool.query(
      "UPDATE tb_categoria set nombre=? WHERE id_categoria=?",
      [P_nombre, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al crear categoria");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al crear categoria");
  }
};

export const deleteCategoria = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "DELETE FROM tb_categoria WHERE id_categoria=?",
      [id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al eliminar categoria");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al eliminar categoria");
  }
};