//SOLO CONEXION!!!!!!!!!!
const fs = require('fs')
const  { Pool } = require('pg');

//URI
const connectionString = process.env.POSTGRESDB_CNN;
//colocamos nuestros datos para la conexion 

// const config = {
    // user: process.env.USER_PG,
    // host: process.env.HOST_PG,
    // database: process.env.DATA_NAME,
    // password: process.env.PASS_PG,
    // port: process.env.PORT_PG,
  
//  max: 20,
//  idleTimeoutMillis: 5000,
//  connectionTimeoutMillis: 25000

// }

//Pool es un concepto para manejar de manera interna, varias conexiones
const pool = new Pool({
  connectionString,
  ssl: {
    //colocamos la ruta del certificado
    ca: fs.readFileSync('./certificado.crt').toString(),
    //IMPORTANTE: colocar ca que significa(auth cert) 
 }
    
})

//creamos una constante que nos ayudará con las consultas, agregar, listar o actualizar la bd por medio del argumento
const query = async (querySQL) => {
    // const resultado = await pool.query(querySQL);
    //por medio de la conexion(pool) el query realizará las consultas o acciones que queramos hacer en la base de datos
    return await pool.query(querySQL)
    }


//importante modular para poder usarlo en otro archivo, para tener un codigo mas ordenado
module.exports = { query };

 