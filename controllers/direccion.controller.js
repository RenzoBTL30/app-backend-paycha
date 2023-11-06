import { pool } from "../database.js";


export const findByUsuario = async (req, res) => {

    const id = parseInt(req.params.id);

    try {
      pool.query(
        "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, CONVERT(l.id_lugar,char) AS id_lugar, l.lugar, l.comision, CONVERT(d.id_usuario,char)AS id_usuario FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar WHERE d.id_usuario=?;",
        [id],
        function (err, result) {

          
          result.forEach((row) => {
            row.comision = parseFloat(row.comision);
          });
          
          
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


export const findById = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, CONVERT(l.id_lugar,char) AS id_lugar, l.lugar, l.comision, CONVERT(d.id_usuario,char)AS id_usuario FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar WHERE d.id_direccion=?;",
      [id],
      function (err, result) {

        
        result.forEach((row) => {
          row.comision = parseFloat(row.comision);
        });
        
        
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar direccion");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar direccion");
  }
};



export const listarDireccion = async (req, res) => {

  try {
    pool.query(
      "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, l.lugar FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar;",
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

export const createDireccion = async (req, res) => {

    const P_direccion = req.body.direccion;
    const P_idLugar = req.body.id_lugar;
    const P_idUsuario = req.body.id_usuario;

    try {
      pool.query(
        "INSERT INTO tb_direccion (direccion, id_lugar, id_usuario) VALUES(?,?,?);",
        [P_direccion,P_idLugar,P_idUsuario],
        function (err, result) {
          try {
            return res.status(200).json({
              data: result.insertId,
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al crear direccion");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear direccion");
    }
};


export const editarDireccion = async (req, res) => {

  const id = parseInt(req.params.id); //id_direccion
  const P_id_lugar = req.body.id_lugar;
  const P_direccion = req.body.direccion;

  try {
    pool.query(
      "UPDATE tb_direccion set direccion=?, id_lugar=? WHERE id_direccion=?",
      [P_direccion, P_id_lugar, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al editar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al editar");
  }
}