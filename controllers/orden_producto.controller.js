import { pool } from "../database.js";

export const createOrdenProducto = (id_orden, id_producto, cantidad_producto) => {

  try {
      pool.query(
        "INSERT INTO tb_orden_producto (id_orden, id_producto, cantidad_producto) VALUES(?, ?, ?);",
        [id_orden, id_producto, cantidad_producto],
        function (err, usuario) {
          if (err) {
            console.log("Error: ", err);
          } else {
            console.log("Registro de orden_producto agregado");
          }
        }
      );
  } catch (error) {
    console.log("Error al crear la orden_producto");
  }
    /*
  try {
      pool.query(
        "INSERT INTO tb_orden_producto (id_orden, id_producto, id_acompanamiento, id_combo, cantidad_producto) VALUES(?, ?, ?, ?, ?);",
        [id_orden, id_producto, acompanamientos.id_acompanamiento, combos.id_combo , cantidad_producto],
        function (err, usuario) {
            if (err) {
              console.log("Error: ", err);
            } else {
              console.log("Registro de orden_producto agregado");
            }
        }
      );
    } catch (error) {
      console.log("Error al crear la orden_producto");
    }
    */
};


export const createOrdenProductoWhithoutAcomps = (id_orden,id_producto, combos, cantidad_producto) => {

  try {
      combos.forEach((combo) => {
        pool.query(
          "INSERT INTO tb_orden_producto (id_orden, id_producto, id_combo, cantidad_producto) VALUES(?, ?, ?, ?);",
          [id_orden, id_producto, combo.id_combo, cantidad_producto],
          function (err, usuario) {
            if (err) {
              console.log("Error: ", err);
            } else {
              console.log("Registro de orden_producto agregado");
            }
          }
        );
      });
  } catch (error) {
    console.log("Error al crear la orden_producto");
  }
};

export const createOrdenProductoWhithoutCombos = (id_orden,id_producto, acompanamientos, cantidad_producto) => {

  try {
      acompanamientos.forEach((acompanamiento) => {
        pool.query(
          "INSERT INTO tb_orden_producto (id_orden, id_producto, id_acompanamiento, cantidad_producto) VALUES(?, ?, ?, ?);",
          [id_orden, id_producto, acompanamiento.id_acompanamiento, cantidad_producto],
          function (err, usuario) {
            if (err) {
              console.log("Error: ", err);
            } else {
              console.log("Registro de orden_producto agregado");
            }
          }
        );
      });
  } catch (error) {
    console.log("Error al crear la orden_producto");
  }
};

export const createOrdenProductoFull = (id_orden, id_producto, acompanamientos, combos, cantidad_producto) => {

  try {
    acompanamientos.forEach((acompanamiento) => {
      combos.forEach((combo) => {
        pool.query(
          "INSERT INTO tb_orden_producto (id_orden, id_producto, id_acompanamiento, id_combo, cantidad_producto) VALUES(?, ?, ?, ?, ?);",
          [id_orden, id_producto, acompanamiento.id_acompanamiento, combo.id_combo, cantidad_producto],
          function (err, usuario) {
            if (err) {
              console.log("Error: ", err);
            } else {
              console.log("Registro de orden_producto agregado");
            }
          }
        );
      });
    });
  } catch (error) {
    console.log("Error al crear la orden_producto");
  }
    /*
  try {
      pool.query(
        "INSERT INTO tb_orden_producto (id_orden, id_producto, id_acompanamiento, id_combo, cantidad_producto) VALUES(?, ?, ?, ?, ?);",
        [id_orden, id_producto, acompanamientos.id_acompanamiento, combos.id_combo , cantidad_producto],
        function (err, usuario) {
            if (err) {
              console.log("Error: ", err);
            } else {
              console.log("Registro de orden_producto agregado");
            }
        }
      );
    } catch (error) {
      console.log("Error al crear la orden_producto");
    }
    */
};