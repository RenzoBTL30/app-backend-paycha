import { pool } from "../database.js";

export const aplicarPuntos = async (req, res) => {

  const id = parseInt(req.params.id); //id_usuario
  const P_puntos = req.body.puntos;
  const P_total = req.body.total;

  if (await validarPuntos(id, P_puntos)) {
    // Aplicar puntos por medio de un procedimiento almacenado en MySQL
    try {
      pool.query(
        'CALL aplicarPuntos(?, ?, @descuento, @puntos_ganados)',
        [P_puntos, P_total],
        (err, result) => {
          if (err) {
            console.error('Error al ejecutar el procedimiento almacenado: ', err);
            return res.status(500).json('Error al aplicar puntos');
          }

          // Obtener el resultado del procedimiento almacenado
          pool.query('SELECT @descuento AS descuento, @puntos_ganados AS puntos_ganados', (err, results) => {
            if (err) {
              console.error('Error al obtener el resultado del procedimiento almacenado: ', err);
              return res.status(500).json('Error al aplicar puntos');
            }

            const descuento = results[0].descuento;
            const puntos_ganados = results[0].puntos_ganados;

            // Ahora puedes aplicar el descuento en tu lógica de negocios
            // Por ejemplo, puedes devolver el descuento como parte de la respuesta JSON
            return res.status(200).json({
              success: true,
              descuento: descuento,
              puntos_ganados: puntos_ganados,
            });
          });
        }
      );
    } catch (error) {
      console.error('Error al aplicar puntos: ', error);
      return res.status(500).json('Error al aplicar puntos');
    }
  } else {    
    return res.status(500).json('Los puntos que ingresaste son mayores a tus puntos actuales');
  }
};

const validarPuntos = (id, puntos) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT puntos_descuento FROM tb_usuario WHERE id_usuario = ?;",
      [id],
      (err, result) => {
        if (err) {
          console.error('Error al realizar la consulta de puntos: ', err);
          reject(err);
        }

        const puntos_usuario = result[0].puntos_descuento;
        if (puntos_usuario >= puntos) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

export const canjearPuntos = async (req, res) => {

  const id = parseInt(req.params.id); //id_usuario
  const P_puntos = req.body.puntos;

  if (await validarPuntos(id, P_puntos)) {
    // Aplicar puntos por medio de un procedimiento almacenado en MySQL
    try {
      pool.query(
        'CALL canjearPuntos(?, ?)',
        [id, P_puntos],
        (err, result) => {
          if (err) {
            console.error('Error al ejecutar el procedimiento almacenado: ', err);
            return res.status(500).json('Error al canjear puntos');
          }

          return res.status(200).json({
            success: true
          });
        }
      );
    } catch (error) {
      console.error('Error al canjear puntos: ', error);
      return res.status(500).json('Error al canjear puntos');
    }
  } else {    
    return res.status(500).json('Los puntos del usuario son mayores a sus puntos actuales');
  }
};

/*
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
*/

export const actualizarPuntos = async (req, res) => {

    const id = parseInt(req.params.id); //id_usuario
    const P_puntos_descuento = req.body.puntos;
    console.log(id);
    console.log(P_puntos_descuento);

    try {
      pool.query(
        "UPDATE tb_usuario SET puntos_descuento = ? WHERE id_usuario = ?",
        [P_puntos_descuento, id],
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