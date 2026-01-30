class ControladorActividades {
    constructor(modeloActividades, vistaActividades, modeloPersonas, vistaPersonas) {
        this.modeloActividades = modeloActividades;
        this.vistaActividades = vistaActividades;
        this.modeloPersonas = modeloPersonas;
        this.vistaPersonas = vistaPersonas;
        this.inicializar();
    }

    inicializar() {
        this.vistaActividades.enlazarAgregarActividad(this.manejarAgregarActividad.bind(this));
        this.vistaActividades.enlazarEliminarActividad(this.manejarEliminarActividad.bind(this));
        this.vistaActividades.enlazarFiltrarActividades(this.manejarFiltrarActividades.bind(this));
        this.vistaActividades.enlazarExportarDatos(this.manejarExportarDatos.bind(this));
        
        // Cargar actividades iniciales
        this.actualizarVista();
    }

    manejarAgregarActividad(datosActividad) {
        try {
            // Obtener datos de la persona seleccionada
            const solicitanteId = document.getElementById('solicitanteId').value;
            if (!solicitanteId) {
                this.vistaActividades.mostrarNotificacion('Debe seleccionar un solicitante', 'error');
                return;
            }
            
            const persona = this.modeloPersonas.obtenerPersonaPorId(parseInt(solicitanteId));
            if (!persona) {
                this.vistaActividades.mostrarNotificacion('Solicitante no encontrado', 'error');
                return;
            }
            
            // Combinar datos de la persona con la actividad
            const datosCompletos = {
                ...datosActividad,
                nombre: persona.nombre,
                apellido: persona.apellido,
                circunscripcion: persona.circunscripcion,
                cargo: persona.cargo
            };
            
            const actividad = this.modeloActividades.crearActividad(datosCompletos);
            this.actualizarVista();
            this.vistaActividades.mostrarNotificacion('Actividad registrada correctamente!', 'exito');
            return actividad;
        } catch (error) {
            this.vistaActividades.mostrarNotificacion('Error al registrar la actividad', 'error');
            console.error('Error:', error);
        }
    }

    manejarEliminarActividad(id) {
        if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
            this.modeloActividades.eliminarActividad(id);
            this.actualizarVista();
            this.vistaActividades.mostrarNotificacion('Actividad eliminada correctamente', 'exito');
        }
    }

    manejarFiltrarActividades(filtros) {
        const actividadesFiltradas = this.modeloActividades.filtrarActividades(filtros);
        this.vistaActividades.renderizarActividades(actividadesFiltradas);
    }

    manejarExportarDatos() {
        try {
            const datos = this.modeloActividades.exportarDatos();
            const blob = new Blob([datos], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'actividades_tecnicas.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.vistaActividades.mostrarNotificacion('Datos exportados correctamente', 'exito');
        } catch (error) {
            this.vistaActividades.mostrarNotificacion('Error al exportar datos', 'error');
            console.error('Error:', error);
        }
    }

    actualizarVista() {
        const actividades = this.modeloActividades.obtenerTodasActividades();
        this.vistaActividades.renderizarActividades(actividades);
    }

    // Métodos para gestión de personas
    agregarPersona(datosPersona) {
        try {
            const persona = this.modeloPersonas.crearPersona(datosPersona);
            this.vistaPersonas.renderizarPersonas(this.modeloPersonas.obtenerTodasPersonas());
            this.vistaPersonas.mostrarNotificacion('Solicitante agregado correctamente', 'success');
            return persona;
        } catch (error) {
            this.vistaPersonas.mostrarNotificacion('Error al agregar solicitante', 'error');
            console.error('Error:', error);
        }
    }

    seleccionarPersona(persona) {
        this.vistaPersonas.actualizarCampoSolicitante(persona);
        this.vistaPersonas.mostrarNotificacion('Solicitante seleccionado: ' + persona.nombre + ' ' + persona.apellido, 'info');
    }
}