const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

//modulo para escritura y lectura de json
const fs = require('fs');

client.on('ready',()=>{
    console.log('estoy listo papusel');
});

client.on('message',(message) =>{
    //recibir mensaje
    console.log(message.content);
    //sirve para obtener la cadena excluyendo el comando.
    if(message.content.includes('!añadir')){
        agregarTarea(message);
    }

    if(message.content === '!mostrar'){
        Mostrar(message);
    }


});

//agrega tu tocken de discord bot 

client.login('agrega tu tocken de discord bot ');




function Mostrar(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    //procesando el string para mostrar luego
    let cadena = "";
    let i;
    let record = tareas.recordatorio;
    for(i=0;i<record.length;i++){
        cadena = cadena +`${i+1}.-  ${record[i].nombre} 
        `;
    }
    
    //creando embed
    const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("LISTA DE RECORDATORIOS")
        .setDescription(cadena)
    message.reply({ embeds: [embed], components : []})
}



 function agregarTarea(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    let indice = message.content.indexOf("r"); // calculamos el indice de T
    let Extra = message.content.substring(indice+1,message.content.length); // usamos ubstring para cortar el string y quedarnos con todo menos el prefix
    Extra=Extra+"---->"+message.author.username; // concatenamos
    tareas.recordatorio.push({nombre : Extra}); //el json contiene un atributo recordatorio de tipo array de objetos se le agrega la nueva informacion aqui en forma de objeto anonimo
    let jsonData = JSON.stringify(tareas); // convertimos el objeto a string 
    fs.writeFile('./data/tareas.json',jsonData,(error)=>{ // sirve para modificar el json 
        if(error){
            console.log(`Mostrando Error : ${error}`);
        }else{
            console.log("archivo json generado correctamente");
        }
    });
    message.channel.send("Se agrego recordatorio");
}