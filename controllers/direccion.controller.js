import { pool } from "../database.js";


export const findByUsuario = async (req, res) => {

    const id = parseInt(req.params.id);

    try {
      pool.query(
        "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, CONVERT(l.id_lugar,char) AS id_lugar, l.lugar, l.comision, CONVERT(d.id_usuario,char)AS id_usuario FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar WHERE d.id_usuario=? AND d.estado=1;",
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
      "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, CONVERT(l.id_lugar,char) AS id_lugar, l.lugar, l.comision, CONVERT(d.id_usuario,char)AS id_usuario FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar WHERE d.id_direccion=? AND d.estado=1;",
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
      "SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, l.lugar FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar SELECT CONVERT(d.id_direccion,char)AS id_direccion, d.direccion, CONVERT(l.id_lugar,char) AS id_lugar, l.lugar, l.comision, CONVERT(d.id_usuario,char)AS id_usuario FROM tb_direccion as d JOIN tb_lugar as l ON d.id_lugar = l.id_lugar WHERE d.estado=1;",
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

    if (await validarCantidadDirecciones(P_idUsuario)) {

      try {
        pool.query(
          "INSERT INTO tb_direccion (direccion, id_lugar, id_usuario, estado) VALUES(?,?,?,'1');",
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

    } else {
      return res.status(500).json('No puedes registrar más direcciones porque haz alcanzado el límite de 10');
    }
};

export const deleteDireccion = async (req, res) => {

  const id = parseInt(req.params.id); //id_direccion

  try {
    pool.query(
      "UPDATE tb_direccion SET estado=0 WHERE id_direccion=?;",
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


/*
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
*/

const validarCantidadDirecciones = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CALL validarCantidadDirecciones(?, @resultado);",
      [id],
      (err, result) => {
        if (err) {
          console.error('Error al validar la cantidad de direcciones: ', err);
          reject(err);
        }

        // Obtener el resultado del procedimiento almacenado
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

