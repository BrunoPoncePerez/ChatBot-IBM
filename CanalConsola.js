//read line nos permite recibir datos 
const readline = require("readline")
//requerimos del watson para poder enviar y/o recibir mensajes
const WatsonAssistant = require('./libs/WatsonAssistant');

//creamos una constante para especificar los datos que queremos que entren por parte del cliente
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let contexto = async ()=>{
//esta constante esta vacia por que acá se guardará el contexto de la conversacion 
};

function ask(){
    //basicamento esto devuelve en la consola lo que has escrito
    terminal.question("Tú : ", async function(res){
        if(res === "exit"){
            terminal.close()
            return
        }
        else if(res === 'mostrar contexto'){
            console.log(contexto);
            return;
        }
        //del mensaje solo se selecciona lo que nos interesa y se usará para que nuestro bot emita una respuesta
        let { output, context } = await WatsonAssistant.enviarMensaje(res, contexto)
        //destructuramos el dato de la respuesta del bot y solo seleccionamos el output donde se encuentra
        //el text y el context que nos servira para guardar la informacion 
        contexto = context;//especificamos que el context cambiará a contexto
        console.log("Watson : ", output.text[0] )//consoleamos la respuesta del bot con los datos que requerimos
        
    })
}

ask()//llamamos la funcion