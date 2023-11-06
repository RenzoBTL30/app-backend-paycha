import { pool } from "../database.js";
import { promisify } from 'util';

export const listarCombo = async (req, res) => {

  try {
    pool.query(
      "SELECT CONVERT(id_combo, char)AS id_combo, descripcion, precio, estado FROM tb_combo WHERE estado=1;",
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

export const createCombo = async (req, res) => {

    const P_descripcion = req.body.descripcion;
    const P_precio = req.body.precio;

    try {
      pool.query(
        "INSERT INTO tb_combo (descripcion, precio, estado) VALUES(?,?,'1');",
        [P_descripcion, P_precio],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al crear acompanamiento");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear acompanamiento");
    }
};


export const editarCombo = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_descripcion = req.body.descripcion;
  const P_precio = req.body.precio;

  try {
    pool.query(
      "UPDATE tb_combo set descripcion=?, precio=? WHERE id_combo=?",
      [P_descripcion, P_precio, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al editar categoria");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al editar categoria");
  }
};

export const deleteCombo = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "UPDATE tb_combo set estado=0 WHERE id_combo=?",
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

export const listarComboProducto = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT tc.id_producto, p.nombre, c.nombre as categoria, tc.id_combo FROM tb_producto_combo as tc JOIN tb_producto as p ON p.id_producto = tc.id_producto JOIN tb_categoria as c ON p.id_categoria = c.id_categoria WHERE tc.id_combo = ?;",
      [id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar");
  }
};



export const asignarComboProducto = async (req, res) => {

  const P_id_combo = req.body.id_combo;

  //Promisify la función pool.query()
  const queryAsync = promisify(pool.query).bind(pool);
  
  try {
    for (const id_producto of req.body.id_productos) {
      //console.log(id_producto); Esta linea imprime los id_producto del req.body.id_productos

      const query = "INSERT INTO tb_producto_combo (id_producto, id_combo) VALUES (?, ?);";
      await queryAsync(query, [id_producto, P_id_combo]);
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error al asignar combos:", error);
    return res.status(500).json("Error al asignar");
  }

};

/*
export const editarComboProducto = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_id_producto = req.body.id_producto;
  const P_id_acompanamiento = req.body.id_acompanamiento;

  try {
    pool.query(
      "UPDATE tb_producto_acompanamiento SET id_producto=?, id_acompanamiento=? WHERE id_producto_acompanamiento=?;",
      [P_id_producto, P_id_acompanamiento, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al crear acompanamiento");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al crear acompanamiento");
  }
};
*/