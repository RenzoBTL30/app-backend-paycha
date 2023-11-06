import { pool } from "../database.js";
import { promisify } from 'util';

export const listarAcomp = async (req, res) => {

  try {
    pool.query(
      "SELECT CONVERT(a.id_acompanamiento,char)AS id_acompanamiento, a.nombre, a.precio, a.estado, CONVERT(ta.id_tipo_acompanamiento, char ) AS id_tipo_acompanamiento, ta.tipo FROM tb_acompanamiento as a JOIN tb_tipo_acompanamiento as ta ON a.id_tipo_acompanamiento = ta.id_tipo_acompanamiento WHERE a.estado=1;",
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

export const createAcomp = async (req, res) => {

    const P_nombre = req.body.nombre;
    const P_precio = req.body.precio;
    const P_id_tipo_acompanamiento = req.body.id_tipo_acompanamiento;

    try {
      pool.query(
        "INSERT INTO tb_acompanamiento (nombre, precio, id_tipo_acompanamiento, estado) VALUES(?,?,?,'1');",
        [P_nombre, P_precio, P_id_tipo_acompanamiento],
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


export const editarAcomp = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_nombre = req.body.nombre;
  const P_precio = req.body.precio;
  const P_id_tipo_acompanamiento = req.body.id_tipo_acompanamiento;

  try {
    pool.query(
      "UPDATE tb_acompanamiento set nombre=?, precio=?, id_tipo_acompanamiento=? WHERE id_acompanamiento=?",
      [P_nombre, P_precio, P_id_tipo_acompanamiento, id],
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

export const deleteAcomp = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "UPDATE tb_acompanamiento set estado=0 WHERE id_acompanamiento=?",
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



export const listarAcompProducto = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT CONVERT(ta.id_producto,char) as id_producto, p.nombre, c.nombre as categoria, CONVERT(ta.id_acompanamiento,char) as id_acompanamiento FROM tb_producto_acompanamiento as ta JOIN tb_producto as p ON p.id_producto = ta.id_producto JOIN tb_categoria as c ON p.id_categoria = c.id_categoria WHERE ta.id_acompanamiento = ?;",
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


export const listarProductoAcomps = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT CONVERT(pa.id_producto,char) as id_producto, p.nombre, CONVERT(pa.id_acompanamiento,char) as id_acompanamiento, a.nombre as acompanamiento, a.precio, ta.tipo as tipo FROM tb_producto_acompanamiento as pa JOIN tb_producto as p ON p.id_producto = pa.id_producto JOIN tb_acompanamiento as a ON a.id_acompanamiento = pa.id_acompanamiento JOIN tb_tipo_acompanamiento as ta ON a.id_tipo_acompanamiento = ta.id_tipo_acompanamiento WHERE pa.id_producto = ?;",
      [id],
      function (err, result) {

        result.forEach((row) => {
          row.precio = parseFloat(row.precio);
        });

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



export const asignarAcompProducto = async (req, res) => {

  const P_id_acompanamiento = req.body.id_acompanamiento;

  //Promisify la función pool.query()
  const queryAsync = promisify(pool.query).bind(pool);
  
  try {
    for (const id_producto of req.body.id_productos) {
      //console.log(id_producto); Esta linea imprime los id_producto del req.body.id_productos

      const query = "INSERT INTO tb_producto_acompanamiento (id_producto, id_acompanamiento) VALUES (?, ?);";
      await queryAsync(query, [id_producto, P_id_acompanamiento]);
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error al crear acompanamiento:", error);
    return res.status(500).json("Error al crear acompanamiento");
  }
  
  /*
  for (const id_producto of req.body.id_productos) {
    console.log(id_producto);
    
    try {
      pool.query(
        "INSERT INTO tb_producto_acompanamiento (id_producto, id_acompanamiento) VALUES(?,?);",
        [id_producto, P_id_acompanamiento],
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

  }*/

};

export const editarAcompProducto = async (req, res) => {

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


export const listarProductosPorAcomps = async (req, res) => {

  const id = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT CONVERT(pa.id_acompanamiento,char) as id_acompanamiento, a.nombre as acompanamiento, a.precio, ta.tipo as tipo FROM tb_producto_acompanamiento as pa JOIN tb_producto as p ON p.id_producto = pa.id_producto JOIN tb_acompanamiento as a ON a.id_acompanamiento = pa.id_acompanamiento JOIN tb_tipo_acompanamiento as ta ON a.id_tipo_acompanamiento = ta.id_tipo_acompanamiento WHERE a.estado = 1 AND pa.id_producto = ?;",
      [id],
      function (err, result) {

        result.forEach((row) => {
          row.precio = parseFloat(row.precio);
        });

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