// Inicializar la aplicación MVC
class Aplicacion {
    constructor() {
        this.modeloActividades = new ModeloActividades();
        this.modeloPersonas = new ModeloPersonas();
        this.vistaActividades = new VistaActividades();
        this.vistaPersonas = new VistaPersonas();
        
        // Enlazar modelos con vistas
        this.vistaPersonas.modelo = this.modeloPersonas;
        
        this.controlador = new ControladorActividades(
            this.modeloActividades, 
            this.vistaActividades,
            this.modeloPersonas,
            this.vistaPersonas
        );
        
        // Inicializar vista de personas
        this.vistaPersonas.enlazarEventos({
            agregarPersona: (datos) => this.controlador.agregarPersona(datos),
            seleccionarPersona: (persona) => this.controlador.seleccionarPersona(persona)
        });
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aplicacion = new Aplicacion();
    window.vistaPersonas = aplicacion.vistaPersonas;
});