require("dotenv").config();
const express = require('express');
const WatsonAssistant = require('./libs/WatsonAssistant')
const dialog = require('./libs/360Dialog');
const conversationmodel = require('./models/conversationmodel');
const app = express();

//Acceptar formatos JSON
app.use(express.json()) 

// let contexto = {}
// // Recibimos los webhook que nos envia 360Dialos
// app.post('/webhook', async  (req, res)=>{
//     console.log('Datos Entrante : ', req.body);
//     if(req.body.statuses){res.status(200).end(); return;} 
    
//     const mensaje = req.body.messages[0];
//     console.log('Mensaje : ', mensaje);

//      let  {text:texto , from:celular } = mensaje;
//     console.log('Celular : ', celular);
//     console.log('Mensaje : ', texto.body);
//     const { output, context } = await WatsonAssistant.enviarMensaje(texto.body, contexto);
//     contexto = context;
//      for(let text of output.text ){
//      //console.log(text);
//      await dialog.enviarMensajeHaciaWSP(celular, text);
//  }

//    //console.log(resultado)
//     res.status(200).end();
// });

//hacemos la llamada con el metodo post que nos ayudará a registrar los datos requeridos en la BD
app.post('/webhook', async (req, res) =>{

    //utilizo stringify para convertir el formato json a una cadena de texto
    console.log('Datos entrantes: ', JSON.stringify(req.body, null, " "));
    //si en el body existe un estatuses le damos un 200 para verificar que todo esté ok
    if(req.body.statuses){
        res.status(200).end();
        return;
    }
    //creamos una variable que nos ayudará a especificar los elementos que deseamos que se muestre en consola
    const mensaje = req.body.messages[0];//le decimos que requerimos del body el arreglo message, especificamente el primer indice
    const { from:numero, text:texto} = mensaje;
    //especificamos que datos del context queremos validar para que no haya nignuna mala interpretacion

    let contenedor = await conversationmodel.listaContenido(numero);
    //llamamos en una constante el elemento que queremos verificar para que no se repita
     //decimos entonces que si el arreglo está vacio, entonces que se registre el numero y guarde el contexto
    if(contenedor.length <= 0){
        let acaVaAlgo = {};//aca se guardará el contexto de la converzacion 
        await conversationmodel.guardaContenido(numero, acaVaAlgo);
    //como se va a guardar algo, tomara tiempo. Entonces le decimos que espere para que se guarde
    //llamamos a la funcion que guardará en la bd 

    //destructuramos el objeto y extraemos lo necesario para que se envie el mensaje al bot 
    const { output, context } = await WatsonAssistant.enviarMensaje(texto.body, acaVaAlgo );
    console.log(output);                                     //argumento requerido para enviar el mensaje 
    console.log(context);

    await conversationmodel.actualizaContenido(numero, JSON.stringify(context));
    /* como en cada mensaje que envie el usuario se creará un nuevo id, y a cada momento no se va a estar creando un registro separado,
       vamos a actualizar el registro, la ventaja es que por cada pregunta y respuesta se genera un id que guarda las conversaciones
       anteriores, entonces solo requeriremos registrar ese id y convertirlo a una cadena de texto que ya especificamos en la bd */

     /* creamos una variable text, esta variable nos permitira extraer del objeto output el text o el elemento especifico que 
       necesitaremos para que se genere una respuesta, ya que toda la informacion que trae el mensaje no es necesario */  
    for(const text of output.text){
        //le damos como respuesta el text que viene del bot
        console.log('ENZO responde: ', text);
        //esto se enviara al numero registrado con el text proveniente del bot 
        await dialog.enviarMensajeHaciaWSP(numero, text);
    }
}
if(contenedor.length > 0){
//cuando el contenedor este lleno se pasará al este if 
    const {output, context} = await WatsonAssistant.enviarMensaje(texto.body, JSON.stringify(contenedor.contexto) );
    console.log( context);

    await conversationmodel.actualizaContenido(numero, JSON.stringify(context));

    for(const text of output.text){
        console.log('ENZO responde: ', text);
        await dialog.enviarMensajeHaciaWSP(numero, text);
    }

}
res.status(200).end();
     
})

//Ejecuta el servidor  por un puerto
app.listen(process.env.PORT,  ()=>{
    console.log('Servidor Ejecutando')
});
