import { pool } from "../database.js";

export const getMetodoPago = async (req, res) => {
    try {
      pool.query(
        "SELECT CONVERT(id_metodo_pago, char) as id_metodo_pago, nombre FROM tb_metodo_pago;",
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