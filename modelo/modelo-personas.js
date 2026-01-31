class ModeloPersonas {
    constructor() {
        this.personas = this.cargarPersonas();
    }

    // Crear nueva persona
    crearPersona(datosPersona) {
        const persona = {
            id: Date.now(),
            ...datosPersona,
            timestamp: new Date().toISOString()
        };
        
        this.personas.unshift(persona);
        this.guardarPersonas();
        return persona;
    }

    // Obtener todas las personas
    obtenerTodasPersonas() {
        return this.personas;
    }

    // Obtener personas paginadas
    obtenerPersonasPaginadas(pagina = 1, porPagina = 10, terminoBusqueda = '') {
        let personasFiltradas = this.personas;
        
        if (terminoBusqueda) {
            personasFiltradas = this.buscarPersonas(terminoBusqueda);
        }
        
        const total = personasFiltradas.length;
        const totalPaginas = Math.ceil(total / porPagina);
        const inicio = (pagina - 1) * porPagina;
        const fin = inicio + porPagina;
        
        return {
            personas: personasFiltradas.slice(inicio, fin),
            paginacion: {
                paginaActual: pagina,
                porPagina: porPagina,
                total: total,
                totalPaginas: totalPaginas,
                tieneAnterior: pagina > 1,
                tieneSiguiente: pagina < totalPaginas
            }
        };
    }

    // Buscar personas por término
    buscarPersonas(termino = '') {
        if (!termino) return this.personas;
        
        return this.personas.filter(persona => {
            return (
                persona.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                persona.apellido.toLowerCase().includes(termino.toLowerCase()) ||
                persona.circunscripcion.toLowerCase().includes(termino.toLowerCase()) ||
                persona.cargo.toLowerCase().includes(termino.toLowerCase())
            );
        });
    }

    // Obtener persona por ID
    obtenerPersonaPorId(id) {
        return this.personas.find(persona => persona.id === id);
    }

    // Actualizar persona
    actualizarPersona(id, datosActualizados) {
        const index = this.personas.findIndex(persona => persona.id === id);
        if (index === -1) return null;
        
        this.personas[index] = {
            ...this.personas[index],
            ...datosActualizados,
            timestamp: new Date().toISOString() // Actualizar timestamp
        };
        
        this.guardarPersonas();
        return this.personas[index];
    }

    // Eliminar persona
    eliminarPersona(id) {
        this.personas = this.personas.filter(persona => persona.id !== id);
        this.guardarPersonas();
        return true;
    }

    // Cargar personas desde localStorage
    cargarPersonas() {
        const personasGuardadas = localStorage.getItem('personasRegistro');
        return personasGuardadas ? JSON.parse(personasGuardadas) : [];
    }

    // Guardar personas en localStorage
    guardarPersonas() {
        localStorage.setItem('personasRegistro', JSON.stringify(this.personas));
    }
}