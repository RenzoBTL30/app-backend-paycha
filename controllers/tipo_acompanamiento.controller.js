import { pool } from "../database.js";


export const listarTipoAcomp = async (req, res) => {

  try {
    pool.query(
      "SELECT CONVERT(id_tipo_acompanamiento,char)AS id_tipo_acompanamiento, tipo FROM tb_tipo_acompanamiento;",
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

export const createTipoAcomp = async (req, res) => {

    const P_tipo = req.body.tipo;

    try {
      pool.query(
        "INSERT INTO tb_tipo_acompanamiento (tipo) VALUES(?);",
        [P_tipo],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al crear tipo acompanamiento");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear tipo acompanamiento");
    }
};


export const editarTipoAcomp = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_tipo = req.body.tipo;

  try {
    pool.query(
      "UPDATE tb_tipo_acompanamiento set tipo=? WHERE id_tipo_acompanamiento=?",
      [P_tipo, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al editar tipo");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al editar tipo");
  }
};

export const deleteTipoAcomp = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "DELETE FROM tb_tipo_acompanamiento WHERE id_tipo_acompanamiento=?",
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