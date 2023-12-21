import { pool } from "../database.js";
import storage from "../utils/cloud_storage.js";

export const createProducto = async (req, res) => {
    const prod = JSON.parse(req.body.producto);
    //console.log(prod);

    const files = req.files;
    //console.log(files);
    
    if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url != undefined && url != null) {
            prod.imagen = url;
        }
    }
    
    
    const P_nombre = prod.nombre;
    const P_descripcion = prod.descripcion;
    const P_precio = prod.precio;
    const P_imagen = prod.imagen;
    const P_idcat = prod.id_categoria;

    console.log(P_imagen);

    try {
      pool.query(
        "INSERT INTO tb_producto (nombre, descripcion, precio, imagen, estado_disponible, estado, id_categoria) VALUES(?, ?, ?, ?, '1','1', ?);",
        [P_nombre, P_descripcion, P_precio, P_imagen, P_idcat],
        function (err, result) {
          try {
            return res.status(200).json({
              success: true,
            });
          } catch (error) {
            return res.status(500).json("Error al crear producto");
          }
        }
      );
    } catch (error) {
      return res.status(500).json("Error al crear producto");
    }
};


export const editarProductoConImagen = async (req, res) => {

    const prod = JSON.parse(req.body.producto);
    //console.log(prod);

    const files = req.files;
    //console.log(files);
    
    if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url != undefined && url != null) {
            prod.imagen = url;
        }
    }

  const id = parseInt(req.params.id);

  const P_nombre = prod.nombre;
  const P_descripcion = prod.descripcion;
  const P_precio = prod.precio;
  const P_imagen = prod.imagen;
  const P_idcat = prod.id_categoria;

  try {
    pool.query(
      "UPDATE tb_producto set nombre=?, descripcion=?, precio=?, imagen=?, id_categoria=?  WHERE id_producto=?",
      [P_nombre, P_descripcion, P_precio, P_imagen, P_idcat, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al editar producto");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al editar producto");
  }
};


export const editarProductoSinImagen = async (req, res) => {

  const id = parseInt(req.params.id);

  const P_nombre = req.body.nombre;
  const P_descripcion = req.body.descripcion;
  const P_precio = req.body.precio;
  const P_idcat = req.body.id_categoria;

  try {
    pool.query(
      "UPDATE tb_producto set nombre=?, descripcion=?, precio=?, id_categoria=?  WHERE id_producto=?",
      [P_nombre, P_descripcion, P_precio, P_idcat, id],
      function (err, result) {
        try {
          return res.status(200).json({
            success: true,
          });
        } catch (error) {
          return res.status(500).json("Error al editar producto");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al editar producto");
  }
};


export const findByCategoria = async (req, res) => {

  const id_categoria = parseInt(req.params.id);
  try {
    pool.query(
      "SELECT CONVERT(P.id_producto, char) AS id_producto , P.nombre, P.descripcion, P.precio, P.imagen, P.estado_disponible, CONVERT(P.id_categoria, char) AS id_categoria FROM tb_producto as P WHERE P.id_categoria = ? AND P.estado = '1';",
      [id_categoria],
      function (err, result) {
        // Convertir el valor de P.precio a decimal - ya que MySQL extrañamente lo envía como texto, osea entre comillas. Se probo el CONVERT y CAST colocandolo directamente en el query, pero no funcionó
        // Si se comenta estas 3 lineas y hacemos la petición de este método en el Postman, se nos mostrará el valor del precio entre comillas (texto) y habra un error de toDouble() en Flutter
        result.forEach((row) => {
          row.precio = parseFloat(row.precio);
        });

        try {
          return res.status(200).json(result); // Ahora el result mostrara el P.precio en decimal
        } catch (error) {
          return res.status(500).json("Error al buscar");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al buscar");
  }
};

export const listarProducto = async (req, res) => {

  try {
    pool.query(
      "SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.imagen, p.estado_disponible, p.estado, c.id_categoria, c.nombre as categoria FROM tb_producto as p JOIN tb_categoria as c ON p.id_categoria = c.id_categoria WHERE p.estado=1 ORDER BY p.id_producto;",
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar prod");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar prod");
  }
};


export const buscarProducto = async (req, res) => {

  const id_producto = parseInt(req.params.id);

  try {
    pool.query(
      "SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.imagen, p.estado_disponible, p.estado, c.id_categoria, c.nombre as categoria FROM tb_producto as p JOIN tb_categoria as c ON p.id_categoria = c.id_categoria WHERE p.estado=1 AND p.id_producto=? ORDER BY p.id_producto;",[id_producto],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al listar prod");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al listar prod");
  }
};

export const deleteProducto = async (req, res) => {

  const id = parseInt(req.params.id); //id_prod

  try {
    pool.query(
      "UPDATE tb_producto SET estado=0 WHERE id_producto=?;",
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


export const updateEstadoDisponible = async (req, res) => {

  const id = parseInt(req.params.id); //id_producto
  const estadodis = parseInt(req.params.estadodis);

  try {
    pool.query(
      "UPDATE tb_producto SET estado_disponible=? WHERE id_producto=?;",
      [estadodis,id],
      function (err, result) {
        try {
          return res.status(200).json(result);
        } catch (error) {
          return res.status(500).json("Error al actualizar estado");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al actualizar estado");
  }
};