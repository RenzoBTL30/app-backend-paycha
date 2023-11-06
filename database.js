import mysql2 from 'mysql2';
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATABASE,
    port: process.env.DBPORT,
});