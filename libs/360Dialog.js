//hacemos llamado a la libreria axios que nos permitirá crear un cliente http
const axios = require('axios')
require("dotenv").config();

//variables requeridas para hacer la conexion con  360dialog
const URL = process.env.DIALOG360_URL;
const APIKEY = process.env.DIALOG360_APIKEY;

//creamos una constante que nos permitira, por medio de 360dialog y axios
const enviarMensajeHaciaWSP = async  (numero, texto)=>{

     const configRequest = {
         method: 'post',//especificamos el metodo por el cual haremos la peticion 
         url: URL + '/v1/messages',//agregamos el path que usa 360dialog para enviar mensajes 
         headers: {
             'Content-Type':'application/json',//detallamos el tipo de contexto que se recibirá
             "D360-API-KEY": APIKEY//api key que llega de 360
         },
         data: {
            "recipient_type": "individual",
            "to": numero,//primer argumento de la funcion
            "type": "text",
            "text": {
                "body": texto
            }//segundo argunemto de la funcion
        }

     }
      await  axios(configRequest); 
    //le damos la constante como parametro a axios para que haga el envio
}


module.exports = { enviarMensajeHaciaWSP };
//modulamos para exportar