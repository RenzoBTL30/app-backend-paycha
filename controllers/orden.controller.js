import { pool } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import * as orden_producto from "../controllers/orden_producto.controller.js"
import moment from 'moment-timezone';

// Estados de la orden
// 1 -> Pendiente
// 2 -> En proceso
// 3 -> Preparado
// 4 -> En camino
// 5 -> Completado

export const createOrden = async (req, res) => {

    const P_id_usuario = req.body.id_usuario;
    const P_id_direccion = req.body.id_direccion;
    const P_id_metodo_pago = req.body.id_metodo_pago;
    const P_id_forma_entrega = req.body.id_forma_entrega;
    const P_billete_pago = req.body.billete_pago;
    const P_cantidad_tapers = req.body.cantidad_tapers;
    const P_subtotal = req.body.subtotal;
    const P_total_acomps = req.body.total_acomp;
    const P_total_combos = req.body.total_combo;
    const P_total_tapers = req.body.total_tapers;
    const P_total = req.body.total;
    const P_comprobante_pago = req.body.comprobante_pago;
    
    const productos = req.body.productos
    const P_codigo = uuidv4();

    let fecha_actual = Date.now();
    let fecha_moment = moment(fecha_actual);
    fecha_moment.tz('America/Lima');
    const fecha_formateada = fecha_moment.format("YYYY-MM-DD HH:mm:ss");

    try {
      pool.query(
        "INSERT INTO tb_orden (id_usuario, id_direccion, id_metodo_pago, id_forma_entrega, codigo, billete_pago, cantidad_tapers, fecha_orden, subtotal, total_acomp, total_combo, total_tapers, total, comprobante_pago, estado_dis, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1', '1');",
        [P_id_usuario, P_id_direccion, P_id_metodo_pago, P_id_forma_entrega, P_codigo, P_billete_pago, P_cantidad_tapers, fecha_formateada, P_subtotal, P_total_acomps, P_total_combos, P_total_tapers, P_total, P_comprobante_pago],
        function (err, result) {
          try {
            const id_orden = result.insertId;

            
            for (const producto of productos) {

              if (producto.acompanamientos.length === 0 && producto.combos.length === 0) {
                orden_producto.createOrdenProducto(id_orden, producto.id_producto, producto.cantidad_producto);
              } else if (producto.acompanamientos.length === 0 && producto.combos.length > 0) {
                orden_producto.createOrdenProductoWhithoutAcomps(id_orden, producto.id_producto, producto.combos, producto.cantidad_producto);
              } else if (producto.combos.length === 0 && producto.acompanamientos.length > 0) {
                orden_producto.createOrdenProductoWhithoutCombos(id_orden, producto.id_producto, producto.acompanamientos, producto.cantidad_producto);
              } else {
                orden_producto.createOrdenProductoFull(id_orden, producto.id_producto, producto.acompanamientos, producto.combos, producto.cantidad_producto);
              }
            }

            return res.status(200).json({
              success: true,
              id_orden: result.insertId,
              fecha_orden: fecha_formateada
            });

          } catch (error) {
            console.log(error); 
            console.log(err);
            return res.status(500).json("Error al crear la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al crear error la orden");
    }
};


export const findByStatus = async (req, res) => {

  const P_estado = parseInt(req.params.estado);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_direccion,char) AS id_direccion,
            CONVERT(o.id_metodo_pago,char) AS id_metodo_pago,
            m.nombre AS metodo_pago,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.billete_pago,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.subtotal,
            o.total_acomp,
            o.total_combo,
            o.total_tapers,
            o.total,
            o.comprobante_pago,
            o.estado_dis,
            o.estado,
            CASE
                WHEN o.id_direccion IS NOT NULL THEN
                    JSON_OBJECT(
                        'id_direccion', CONVERT(d.id_direccion, CHAR),
                        'direccion', d.direccion,
                        'lugar', l.lugar,
                        'comision', l.comision
                    )
                ELSE NULL
            END AS direccion,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id_producto', CONVERT(p.id_producto,char),
                'nombre', p.nombre,
                'descripcion', p.descripcion,
                'imagen',p.imagen,
                'precio',p.precio,
                'estado_disponible', p.estado_disponible,
                'cantidad',op.cantidad_producto,
                'acompanamientos', (
                  SELECT JSON_ARRAYAGG(JSON_OBJECT(
                    'id_acompanamiento', a.id_acompanamiento,
                    'acompanamiento', a.acompanamiento,
                    'precio', a.precio,
                    'tipo', a.tipo
                  ))
                  FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                    id_acompanamiento INT PATH '$.id_acompanamiento',
                    acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                    precio DECIMAL(10, 2) PATH '$.precio',
                    tipo VARCHAR(150) PATH '$.tipo'
                  )) AS a
                ),
                'combos', (
                  SELECT JSON_ARRAYAGG(JSON_OBJECT(
                    'id_combo', c.id_combo,
                    'descripcion', c.descripcion,
                    'precio', c.precio
                  ))
                  FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                    id_combo INT PATH '$.id_combo',
                    descripcion VARCHAR(150) PATH '$.descripcion',
                    precio DECIMAL(10, 2) PATH '$.precio'
                  )) AS c
                )
              )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        LEFT JOIN
          tb_direccion as d
        ON	
          o.id_direccion = d.id_direccion
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
        LEFT JOIN
          tb_lugar as l
        ON
          l.id_lugar = d.id_lugar
		    INNER JOIN
          tb_metodo_pago as m
        ON
          o.id_metodo_pago = m.id_metodo_pago
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          o.estado = ? && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        [P_estado],
        function (err, result) {

          console.log(result);

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });

          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}



export const findByStatusToDelivery = async (req, res) => {

  const P_estado = parseInt(req.params.estado);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_direccion,char) AS id_direccion,
            CONVERT(o.id_metodo_pago,char) AS id_metodo_pago,
            m.nombre AS metodo_pago,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.billete_pago,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.subtotal,
            o.total_acomp,
            o.total_combo,
            o.total_tapers,
            o.total,
            o.comprobante_pago,
            o.estado_dis,
            o.estado,
            JSON_OBJECT(
            'id_direccion', CONVERT(d.id_direccion,char),
                'direccion', d.direccion,
                'lugar', l.lugar,
                'comision', l.comision,
            ) AS direccion,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_producto', CONVERT(p.id_producto,char),
                    'nombre', p.nombre,
                    'descripcion', p.descripcion,
                    'imagen',p.imagen,
                    'precio',p.precio,
                    'estado_disponible', p.estado_disponible,
                    'cantidad',op.cantidad_producto,
                    'acompanamientos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_acompanamiento', a.id_acompanamiento,
                        'acompanamiento', a.acompanamiento,
                        'precio', a.precio,
                        'tipo', a.tipo
                      ))
                      FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                        id_acompanamiento INT PATH '$.id_acompanamiento',
                        acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                        precio DECIMAL(10, 2) PATH '$.precio',
                        tipo VARCHAR(150) PATH '$.tipo'
                      )) AS a
                    ),
                    'combos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_combo', c.id_combo,
                        'descripcion', c.descripcion,
                        'precio', c.precio
                      ))
                      FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                        id_combo INT PATH '$.id_combo',
                        descripcion VARCHAR(150) PATH '$.descripcion',
                        precio DECIMAL(10, 2) PATH '$.precio'
                      )) AS c
                    )
                )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        LEFT JOIN
          tb_direccion as d
        ON	
          o.id_direccion = d.id_direccion
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
		    INNER JOIN
          tb_lugar as l
        ON
          l.id_lugar = d.id_lugar
		    INNER JOIN
          tb_metodo_pago as m
        ON
          o.id_metodo_pago = m.id_metodo_pago
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          o.estado = ? && f.id_forma_entrega = 2 && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        [P_estado],
        function (err, result) {

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });


          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}


export const findByStatusCocina = async (req, res) => {

  const P_estado = parseInt(req.params.estado);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.estado_dis,
            o.estado,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_producto', CONVERT(p.id_producto,char),
                    'nombre', p.nombre,
                    'descripcion', p.descripcion,
                    'imagen',p.imagen,
                    'precio',p.precio,
                    'categoria','c.nombre',
                    'estado_disponible', p.estado_disponible,
                    'cantidad',op.cantidad_producto,
                    'acompanamientos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_acompanamiento', a.id_acompanamiento,
                        'acompanamiento', a.acompanamiento,
                        'precio', a.precio,
                        'tipo', a.tipo
                      ))
                      FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                        id_acompanamiento INT PATH '$.id_acompanamiento',
                        acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                        precio DECIMAL(10, 2) PATH '$.precio',
                        tipo VARCHAR(150) PATH '$.tipo'
                      )) AS a
                    ),
                    'combos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_combo', c.id_combo,
                        'descripcion', c.descripcion,
                        'precio', c.precio
                      ))
                      FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                        id_combo INT PATH '$.id_combo',
                        descripcion VARCHAR(150) PATH '$.descripcion',
                        precio DECIMAL(10, 2) PATH '$.precio'
                      )) AS c
                    )
                )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
        INNER JOIN
          tb_categoria as c
        ON
          p.id_categoria = c.id_categoria
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          o.estado = ? && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        [P_estado],
        function (err, result) {

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });


          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}

export const findByCliente = async (req, res) => {

  const id = parseInt(req.params.id);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_direccion,char) AS id_direccion,
            CONVERT(o.id_metodo_pago,char) AS id_metodo_pago,
            m.nombre AS metodo_pago,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.billete_pago,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.subtotal,
            o.total_acomp,
            o.total_combo,
            o.total_tapers,
            o.total,
            o.comprobante_pago,
            o.estado_dis,
            o.estado,
            CASE
                WHEN o.id_direccion IS NOT NULL THEN
                    JSON_OBJECT(
                        'id_direccion', CONVERT(d.id_direccion, CHAR),
                        'direccion', d.direccion,
                        'lugar', l.lugar,
                        'comision', l.comision
                    )
                ELSE NULL
            END AS direccion,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_producto', CONVERT(p.id_producto,char),
                    'nombre', p.nombre,
                    'descripcion', p.descripcion,
                    'imagen',p.imagen,
                    'precio',p.precio,
                    'estado_disponible', p.estado_disponible,
                    'cantidad',op.cantidad_producto,
                    'acompanamientos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_acompanamiento', a.id_acompanamiento,
                        'acompanamiento', a.acompanamiento,
                        'precio', a.precio,
                        'tipo', a.tipo
                      ))
                      FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                        id_acompanamiento INT PATH '$.id_acompanamiento',
                        acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                        precio DECIMAL(10, 2) PATH '$.precio',
                        tipo VARCHAR(150) PATH '$.tipo'
                      )) AS a
                    ),
                    'combos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_combo', c.id_combo,
                        'descripcion', c.descripcion,
                        'precio', c.precio
                      ))
                      FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                        id_combo INT PATH '$.id_combo',
                        descripcion VARCHAR(150) PATH '$.descripcion',
                        precio DECIMAL(10, 2) PATH '$.precio'
                      )) AS c
                    )
                )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        LEFT JOIN
          tb_direccion as d
        ON	
          o.id_direccion = d.id_direccion
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
        LEFT JOIN
          tb_lugar as l
        ON
          l.id_lugar = d.id_lugar
		    INNER JOIN
          tb_metodo_pago as m
        ON
          o.id_metodo_pago = m.id_metodo_pago
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          u.id_usuario = ? && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        
        [id],
        function (err, result) {

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });


          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}


export const findById = async (req, res) => {

  const id = parseInt(req.params.id);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_direccion,char) AS id_direccion,
            CONVERT(o.id_metodo_pago,char) AS id_metodo_pago,
            m.nombre AS metodo_pago,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.billete_pago,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.subtotal,
            o.total_acomp,
            o.total_combo,
            o.total_tapers,
            o.total,
            o.comprobante_pago,
            o.estado_dis,
            o.estado,
            CASE
                WHEN o.id_direccion IS NOT NULL THEN
                    JSON_OBJECT(
                        'id_direccion', CONVERT(d.id_direccion, CHAR),
                        'direccion', d.direccion,
                        'lugar', l.lugar,
                        'comision', l.comision
                    )
                ELSE NULL
            END AS direccion,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_producto', CONVERT(p.id_producto,char),
                    'nombre', p.nombre,
                    'descripcion', p.descripcion,
                    'imagen',p.imagen,
                    'precio',p.precio,
                    'estado_disponible', p.estado_disponible,
                    'cantidad',op.cantidad_producto,
                    'acompanamientos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_acompanamiento', a.id_acompanamiento,
                        'acompanamiento', a.acompanamiento,
                        'precio', a.precio,
                        'tipo', a.tipo
                      ))
                      FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                        id_acompanamiento INT PATH '$.id_acompanamiento',
                        acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                        precio DECIMAL(10, 2) PATH '$.precio',
                        tipo VARCHAR(150) PATH '$.tipo'
                      )) AS a
                    ),
                    'combos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_combo', c.id_combo,
                        'descripcion', c.descripcion,
                        'precio', c.precio
                      ))
                      FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                        id_combo INT PATH '$.id_combo',
                        descripcion VARCHAR(150) PATH '$.descripcion',
                        precio DECIMAL(10, 2) PATH '$.precio'
                      )) AS c
                    )
                )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        LEFT JOIN
          tb_direccion as d
        ON	
          o.id_direccion = d.id_direccion
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
        LEFT JOIN
          tb_lugar as l
        ON
          l.id_lugar = d.id_lugar
		    INNER JOIN
          tb_metodo_pago as m
        ON
          o.id_metodo_pago = m.id_metodo_pago
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          o.id_orden = ? && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        
        [id],
        function (err, result) {

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });


          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}


export const findByClienteStatus = async (req, res) => {

  const id = parseInt(req.params.id);
  const P_estado = parseInt(req.params.estado);

    try {
      pool.query(
        `
        SELECT
            CONVERT(o.id_orden,char) AS id_orden,
            CONVERT(o.id_usuario,char) AS id_usuario,
            CONVERT(o.id_direccion,char) AS id_direccion,
            CONVERT(o.id_metodo_pago,char) AS id_metodo_pago,
            m.nombre AS metodo_pago,
            CONVERT(o.id_forma_entrega,char) AS id_forma_entrega,
            f.descripcion AS forma_entrega,
            o.codigo,
            o.billete_pago,
            o.cantidad_tapers,
            o.tiempo_entrega,
            o.fecha_orden,
            o.subtotal,
            o.total_acomp,
            o.total_combo,
            o.total_tapers,
            o.total,
            o.comprobante_pago,
            o.estado_dis,
            o.estado,
            CASE
                WHEN o.id_direccion IS NOT NULL THEN
                    JSON_OBJECT(
                        'id_direccion', CONVERT(d.id_direccion, CHAR),
                        'direccion', d.direccion,
                        'lugar', l.lugar,
                        'comision', l.comision
                    )
                ELSE NULL
            END AS direccion,
            JSON_OBJECT(
            'id_usuario', CONVERT(u.id_usuario,char),
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'celular', u.celular
            ) AS cliente,
            JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_producto', CONVERT(p.id_producto,char),
                    'nombre', p.nombre,
                    'descripcion', p.descripcion,
                    'imagen',p.imagen,
                    'precio',p.precio,
                    'estado_disponible', p.estado_disponible,
                    'cantidad',op.cantidad_producto,
                    'acompanamientos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_acompanamiento', a.id_acompanamiento,
                        'acompanamiento', a.acompanamiento,
                        'precio', a.precio,
                        'tipo', a.tipo
                      ))
                      FROM JSON_TABLE(op.acompanamientos, '$[*]' COLUMNS (
                        id_acompanamiento INT PATH '$.id_acompanamiento',
                        acompanamiento VARCHAR(150) PATH '$.acompanamiento',
                        precio DECIMAL(10, 2) PATH '$.precio',
                        tipo VARCHAR(150) PATH '$.tipo'
                      )) AS a
                    ),
                    'combos', (
                      SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id_combo', c.id_combo,
                        'descripcion', c.descripcion,
                        'precio', c.precio
                      ))
                      FROM JSON_TABLE(op.combos, '$[*]' COLUMNS (
                        id_combo INT PATH '$.id_combo',
                        descripcion VARCHAR(150) PATH '$.descripcion',
                        precio DECIMAL(10, 2) PATH '$.precio'
                      )) AS c
                    )
                )
            ) AS productos
        FROM
          tb_orden as o
        INNER JOIN
          tb_usuario as u
        ON
          o.id_usuario = u.id_usuario
        LEFT JOIN
          tb_direccion as d
        ON	
          o.id_direccion = d.id_direccion
        INNER JOIN
          tb_orden_producto as op
        ON
          o.id_orden = op.id_orden
        INNER JOIN
          tb_producto as p
        ON
          p.id_producto = op.id_producto
        LEFT JOIN
          tb_lugar as l
        ON
          l.id_lugar = d.id_lugar
		    INNER JOIN
          tb_metodo_pago as m
        ON
          o.id_metodo_pago = m.id_metodo_pago
        INNER JOIN
          tb_forma_entrega as f
        ON
          o.id_forma_entrega = f.id_forma_entrega
        WHERE
          o.estado = ? && u.id_usuario = ? && o.estado_dis = 1
        GROUP BY
          o.id_orden;
        `,
        
        [P_estado, id],
        function (err, result) {

          result.forEach((row) => {
            row.subtotal = parseFloat(row.subtotal);
          });

          result.forEach((row) => {
            row.total = parseFloat(row.total);
          });

          result.forEach((row) => {
            row.total_tapers = parseFloat(row.total_tapers);
          });


          try {
            return res.status(200).json(result);

          } catch (error) {
            return res.status(500).json("Error al mostrar la orden");
          }
        }
      );

    } catch (error) {
      return res.status(500).json("Error al mostrar la orden");
    }
}

export const actualizarEstadoOrden = async (req, res) => {

  const id = parseInt(req.params.id); //id_orden
  const P_estado = req.body.estado;

  try {
    pool.query(
      "UPDATE tb_orden SET estado=? WHERE id_orden=?;",
      [P_estado, id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "La actualización del estado se ha completado",
          });
        } catch (error) {
          return res.status(500).json("Error al actualizar estado");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al actualizar error al actualizar estado");
  }
};


export const cancelarOrden = async (req, res) => {

  const id = parseInt(req.params.id); //id_orden

  try {
    pool.query(
      "UPDATE tb_orden SET estado_dis=0 WHERE id_orden=?;",
      [id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "La orden se ha cancelado",
          });
        } catch (error) {
          return res.status(500).json("Error al cancelar estado");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al cancelar error al cancelar estado");
  }
};


export const insertTiempoEntrega = async (req, res) => {

  const id = parseInt(req.params.id); //id_orden
  const P_tiempo_entrega = req.body.tiempo_entrega;

  try {
    pool.query(
      "UPDATE tb_orden SET tiempo_entrega=? WHERE id_orden=?;",
      [P_tiempo_entrega, id],
      function (err, result) {
        try {
          return res.status(200).json({
              success: true,
              message: "La actualización del tiempo se ha completado",
          });
        } catch (error) {
          return res.status(500).json("Error al actualizar tiempo");
        }
      }
    );
  } catch (error) {
    return res.status(500).json("Error al actualizar tiempo al actualizar tiempo");
  }
};