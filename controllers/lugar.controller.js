import { pool } from "../database.js";

export const getLugares = async (req, res) => {
    try {
      pool.query(
        "SELECT CONVERT(id_lugar, char) as id_lugar, lugar, comision FROM tb_lugar WHERE estado='1';",
        function (err, result) {

          result.forEach((row) => {
            row.comision = parseFloat(row.comision);
          });

          try {
            return res.status(200).json(result);
          } catch (error) {
            return res.status(500).json("Error");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error");
    }
};

// Este get es para mostrar todos los lugares en el sistema web
// se hizo con el objetivo de mostrar la comisión con sus 2 decimales, al omitir el result.foreach
export const getLugaresWeb = async (req, res) => {
  try {
    pool.query(
      "SELECT CONVERT(id_lugar, char) as id_lugar, lugar, comision FROM tb_lugar WHERE estado='1';",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error");
  }
};

export const createLugar = async (req, res) => {

  const P_lugar = req.body.lugar;
  const P_comision = req.body.comision;

  try {
    pool.query(
      "INSERT INTO tb_lugar (lugar, comision) VALUES(?, ?);",
      [P_lugar, P_comision],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al crear lugar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al crear lugar");
  }
};


export const updateLugar = async (req, res) => {

const id = parseInt(req.params.id);
const P_lugar = req.body.lugar;
const P_comision = req.body.comision;

try {
  pool.query(
    "UPDATE tb_lugar set lugar=?, comision=? WHERE id_lugar=?",
    [P_lugar, P_comision, id],
    function (err, result) {
      try {
        return res.status(200).json({
          success: true,
        });
      } catch (error) {
        return res.status(500).json("Error al editar lugar");
      }
    }
  );
} catch (error) {
  return res.status(500).json("Error al editar lugar");
}
};

export const deleteLugar = async (req, res) => {

const id = parseInt(req.params.id);

try {
  pool.query(
    "UPDATE tb_lugar set estado=0 WHERE id_lugar=?",
    [id],
    function (err, result) {
      try {
        return res.status(200).json({
          success: true,
        });
      } catch (error) {
        return res.status(500).json("Error al eliminar lugar");
      }
    }
  );
} catch (error) {
  return res.status(500).json("Error al eliminar lugar");
}
};