//requerimos el paquete se w.assistant 
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require("dotenv").config();

//hacemos la conexion a nuestro bot
const assistant = new AssistantV1({
  version: process.env.ASSISTANT_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_APIKEY
  }),
  serviceUrl: process.env.ASSISTANT_URL
});



//creamos una constante para que nuestro bot reciba los mensajes
const enviarMensaje = async  (textoEntrante, context) => {
      //siempre usando async await, por que es una consulta que lleva cierto tiempo
      //creamos una promesa que nos retornará una respuesta o un rechazo como condiciones
      return new Promise((resolve, reject) => {
        //hacemos llamado a la conexion(assistand) que nos permitirá recibir los mensajes
        assistant.message({ 
            workspaceId: process.env.ASSISTANT_ID,//skill id, especificamos nuestro bot
            input: {'text': textoEntrante},//indicamos el parametro que se ingresará por medio del mensaje
            context//especificamos el segundo parametro que queremos que reciba
            })
            .then(res => {//si sale bien la consulta, devolveremos una respuesta
              //console.log(JSON.stringify(res.result, null, 2));
              resolve(res.result);

            })
            .catch(err => {//de lo contrario enviaremos un error
            console.log(err)
            reject(err);
            });
            
    })

}
module.exports = { enviarMensaje };
//creamos la importacion