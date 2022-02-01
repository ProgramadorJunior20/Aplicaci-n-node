require('colors')

const { guardarDB, leerDB } = require('./src/helpers/guardarArchivo');
const { 
        inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./src/helpers/inquirer');

const Tareas = require('./src/models/tareas');



const main = async() => {

    let opt = ''
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { // cargar tareas
        tareas.cargarTareasFromArray( tareasDB ); 
    }

    do {
        // Imprimir el Menú
        opt = await inquirerMenu()
        
        switch (opt) {
            case '1':
                //Crear Opcion
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
                //console.log( tareas.listadoArr );
            break;

            case '3'://Listar Completadas
                tareas.listarPendientesCompletadas();
                //console.log( tareas.listadoArr );
            break;

            case '4'://Listar Pedientes
                tareas.listarPendientesCompletadas(false);
                //console.log( tareas.listadoArr );
            break;

            case '5'://Completado | Pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6'://Borrar tareas
                const id  = await listadoTareasBorrar( tareas.listadoArr );
                const ok = await confirmar('¿Está Seguro?');
                if (id !== '0'){
                    //TODO: preguntar si esta seguro de eliminar
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log();
                        console.log('Tarea Eliminada Correctamente'.green);
                    }
                }  
            break;

        }
        
        guardarDB( tareas.listadoArr );

        await pausa();

       
    } while (opt !== '0');
    
    //pausa()
}

main()