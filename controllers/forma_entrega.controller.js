import { pool } from "../database.js";

export const getFormaEntrega = async (req, res) => {
    try {
      pool.query(
        "SELECT CONVERT(id_forma_entrega, char) as id_forma_entrega, descripcion FROM tb_forma_entrega;",
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