// Inicializar la aplicación MVC
class Aplicacion {
    constructor() {
        this.modeloActividades = new ModeloActividades();
        this.modeloPersonas = new ModeloPersonas();
        this.vistaActividades = new VistaActividades();
        this.vistaFormularioSolicitante = new VistaFormularioSolicitante();
        
        this.controlador = new ControladorActividades(
            this.modeloActividades, 
            this.vistaActividades,
            this.modeloPersonas,
            this.vistaFormularioSolicitante
        );
        
        // Inicializar vista de formulario de solicitante
        this.vistaFormularioSolicitante.enlazarEventos({
            agregarPersona: (datos) => this.controlador.agregarPersona(datos)
        });
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aplicacion = new Aplicacion();
    window.vistaPersonas = aplicacion.vistaPersonas;
});

// Funciones globales para el modal de búsqueda de solicitantes
function cerrarModalBusqueda() {
    const modal = document.getElementById('modalBusquedaSolicitantes');
    if (modal) {
        modal.style.display = 'none';
    }
}

function seleccionarSolicitante(id) {
    if (window.aplicacion && window.aplicacion.controlador) {
        const persona = window.aplicacion.controlador.modeloPersonas.obtenerPersonaPorId(id);
        if (persona) {
            window.aplicacion.controlador.seleccionarPersona(persona);
            cerrarModalBusqueda();
        }
    }
}

function editarSolicitante(id) {
    if (window.aplicacion && window.aplicacion.controlador) {
        const persona = window.aplicacion.controlador.modeloPersonas.obtenerPersonaPorId(id);
        if (persona) {
            // Cerrar modal de búsqueda y abrir modal de gestión completa
            cerrarModalBusqueda();
            window.aplicacion.vistaPersonas.toggleModal(true);
            
            // Llenar el formulario con los datos existentes
            document.getElementById('nuevaPersonaNombre').value = persona.nombre;
            document.getElementById('nuevaPersonaApellido').value = persona.apellido;
            document.getElementById('nuevaPersonaCircunscripcion').value = persona.circunscripcion;
            document.getElementById('nuevaPersonaCargo').value = persona.cargo;
            
            // Guardar el ID para la actualización
            window.aplicacion.vistaPersonas.personaEditando = persona.id;
            
            window.aplicacion.vistaActividades.mostrarNotificacion('Modo edición activado para: ' + persona.nombre + ' ' + persona.apellido, 'info');
        }
    }
}

function eliminarSolicitante(id) {
    if (window.aplicacion && window.aplicacion.controlador) {
        const persona = window.aplicacion.controlador.modeloPersonas.obtenerPersonaPorId(id);
        if (persona && confirm(`¿Está seguro de eliminar al solicitante: ${persona.nombre} ${persona.apellido}?`)) {
            window.aplicacion.controlador.modeloPersonas.eliminarPersona(id);
            
            // Recargar la tabla
            window.aplicacion.controlador.cargarSolicitantes();
            
            window.aplicacion.vistaActividades.mostrarNotificacion('Solicitante eliminado correctamente', 'success');
        }
    }
}