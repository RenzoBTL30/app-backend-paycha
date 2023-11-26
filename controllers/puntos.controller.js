import { pool } from "../database.js";


export const canjearPuntos = async (req, res) => {

    const id = parseInt(req.params.id);
    const P_puntos = req.body.puntos;
  
    // Canjear puntos por medio de un procedimiento almacenado en MySQL
    try {
      pool.query(
        "UPDATE tb_usuario set nombre=? WHERE id_categoria=?",
        [P_nombre, id],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al canjear puntos");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al canjear puntos");
    }
};


export const ganarPuntos = async (req, res) => {

    const id = parseInt(req.params.id);
    const P_puntos = req.body.puntos;
  
    // Ganar puntos por medio de un procedimiento almacenado en MySQL
    try {
      pool.query(
        "UPDATE tb_usuario set nombre=? WHERE id_categoria=?",
        [P_nombre, id],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al ganar puntos");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al ganar puntos");
    }
};


export const actualizarPuntos = async (req, res) => {

    const id = parseInt(req.params.id);
    const P_puntos = req.body.puntos;
    const operacion = req.body.operacion;

    // Actualizar puntos por medio de un procedimiento almacenado en MySQL
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
            return res.status(500).json("Error al actualizar puntos");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error error al actualizar puntos");
    }
};