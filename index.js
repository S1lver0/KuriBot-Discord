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
        console.log(message.author.username)
        Mostrar(message);
    }

    if(message.content.includes('!borrar')){
        borrar(message);
    }

    if(message.content === '!deleteAll'&&message.author.username == 'Silver.'){
        borrarTodo(message);
    }

});

//agrega tu tocken de discord bot 

client.login('Ingresa tu tocken de discord');




function Mostrar(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    //procesando el string para mostrar luego
    let cadena = "";
    let i;
    let record = tareas.recordatorio;
    for(i=0;i<record.length;i++){
        cadena = cadena +`<a:black:997659822965137434> ${i+1}.- ${record[i].nombre} 
        `;
    }
    
    //creando embed
    const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("🔖 LISTA DE RECORDATORIOS")
        .setDescription(cadena)
    message.reply({ embeds: [embed], components : []})
}



 function agregarTarea(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    let indice = message.content.indexOf("r"); // calculamos el indice de r => comando !añadi[r]
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
    message.channel.send("Se agrego recordatorio <a:ramirez:997657028547858522> ");
}



function borrar(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    let indice = message.content.indexOf(" "); // calculamos el indice del espacio
    let idx_borrado = message.content.substring(indice+1,indice+2); //obtenemos el numero despues de comando 
    idx_borrado = parseInt(idx_borrado);
    console.log(idx_borrado);
    if(isNaN(idx_borrado)||idx_borrado==0){
        message.channel.send('Ingrese el comando otra vez recuerde que el uso es borrar [indice] && indice mayor que 0');
    }else{
        if(idx_borrado>tareas.recordatorio.length){
            message.channel.send('El indice excede la cantidad de tareas ');
        }else{
            tareas.recordatorio.splice(idx_borrado-1,1);
            let jsonData = JSON.stringify(tareas); // convertimos el objeto a string 
            fs.writeFile('./data/tareas.json',jsonData,(error)=>{ // sirve para modificar el json 
                if(error){
                    console.log(`Mostrando Error : ${error}`);
                }else{
                    console.log("archivo json generado correctamente");
                }
            });
        message.channel.send("Se borro correctamente <a:ramirez:997657028547858522> ");
        }
    }
}



function borrarTodo(message){
    let data = fs.readFileSync('./data/tareas.json');
    let tareas = JSON.parse(data); // convertimos json en objeto
    tareas.recordatorio = [];
    let jsonData = JSON.stringify({recordatorio: []});
    fs.writeFile('./data/tareas.json',jsonData,(error)=>{ // sirve para modificar el json 
        if(error){
            console.log(`Mostrando Error : ${error}`);
        }else{
            console.log("archivo json generado correctamente");
        }
    });
    message.channel.send("Se borraron todos los registros <a:ramirez:997657028547858522> ");
}
