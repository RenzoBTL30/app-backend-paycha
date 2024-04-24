import { pool } from "../database.js";


export const ventasCompletadasPorFecha = async (req, res) => {

    const P_fecha_inicio = req.params.fecha_inicio;
    const P_fecha_fin = req.params.fecha_fin;

    try {
        pool.query(
            "SELECT SUM(total) as total_ventas_completadas_dia, COUNT(id_orden) as cant_ventas_completadas_dia, DATE(fecha_orden) as fecha FROM tb_orden WHERE estado=5 && fecha_orden >= ? && fecha_orden <= ? GROUP BY DAY(fecha_orden), DATE(fecha_orden);",
            [P_fecha_inicio, P_fecha_fin],
            function (err, result) {
                try {
                    return res.status(200).json(result);
                } catch (error) {
                    return res.status(500).json("Error al listar ventas completadas");
                }
            }
        );
    } catch (error) {
        return res.status(500).json("Error al listar ventas completadas");
    }
};

export const ventasCanceladasPorFecha = async (req, res) => {

    const P_fecha_inicio = req.params.fecha_inicio;
    const P_fecha_fin = req.params.fecha_fin;

    try {
        pool.query(
            "SELECT COUNT(id_orden) as cant_ventas_canceladas_dia, DATE(fecha_orden) as fecha FROM tb_orden WHERE estado=6 && fecha_orden >= ? && fecha_orden <= ? GROUP BY DAY(fecha_orden), DATE(fecha_orden);",
            [P_fecha_inicio, P_fecha_fin],
            function (err, result) {
                try {
                    return res.status(200).json(result);
                } catch (error) {
                    return res.status(500).json("Error al listar ventas canceladas");
                }
            }
        );
    } catch (error) {
        return res.status(500).json("Error al listar en ventas canceladas");
    }
};
