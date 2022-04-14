//requerimos la conexion para poder realizar acciones a la base de datos
const db = require('./../database/postgres');
//los argumentos nos ayudaran a insertar elemento en la bd
const guardaContenido = async ( numero,  contexto ) => {
    //creamos una constante y le decimos que espere la query, esta query agregará los elementos
    const crear = await db.query(`insert into botom (numero, contexto) 
    values('${numero}',  '${contexto}')`);
    //con el lenguaje de PG especificamos los elementos que queremos agregar a la bd
    return crear;//esto es opcional, podemos ponerlo antes del await
}

//y así para las demas constantes o acciones que queremos realizar a la bd
const listaContenido = async (numero) => {
    const lista = await db.query(`select * from botom where numero = '${numero}'`);
    return lista.rows;//aca especificamos que liste por columna
}

const actualizaContenido = async (numero, contexto) => {
    const update = await db.query(`update botom set contexto = '${contexto}'
    where numero = '${numero}'  `);
    return update;
}


module.exports = { guardaContenido, listaContenido , actualizaContenido};