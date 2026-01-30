class ControladorActividades {
    constructor(modeloActividades, vistaActividades, modeloPersonas, vistaFormularioSolicitante) {
        this.modeloActividades = modeloActividades;
        this.vistaActividades = vistaActividades;
        this.modeloPersonas = modeloPersonas;
        this.vistaFormularioSolicitante = vistaFormularioSolicitante;
        this.inicializar();
    }

    inicializar() {
        this.vistaActividades.enlazarAgregarActividad(this.manejarAgregarActividad.bind(this));
        this.vistaActividades.enlazarEliminarActividad(this.manejarEliminarActividad.bind(this));
        this.vistaActividades.enlazarFiltrarActividades(this.manejarFiltrarActividades.bind(this));
        this.vistaActividades.enlazarExportarDatos(this.manejarExportarDatos.bind(this));
        this.vistaActividades.enlazarAbrirModalSolicitantes(this.manejarAbrirModalSolicitantes.bind(this));
        
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
            // Mostrar notificación usando la vista de actividades
            this.vistaActividades.mostrarNotificacion('Solicitante agregado correctamente', 'success');
            
            // Actualizar la lista de solicitantes en el modal de búsqueda si está abierto
            if (window.gestorSolicitantes) {
                window.gestorSolicitantes.cargarSolicitantes();
            }
            
            return persona;
        } catch (error) {
            this.vistaActividades.mostrarNotificacion('Error al agregar solicitante', 'error');
            console.error('Error:', error);
        }
    }

    seleccionarPersona(persona) {
        // Actualizar campo de solicitante en la vista de actividades
        this.vistaActividades.actualizarCampoSolicitante(persona);
        this.vistaActividades.mostrarNotificacion('Solicitante seleccionado: ' + persona.nombre + ' ' + persona.apellido, 'info');
    }

    manejarAbrirModalSolicitantes() {
        // Abrir el modal de búsqueda de solicitantes
        if (typeof abrirModalSolicitantes === 'function') {
            abrirModalSolicitantes();
        }
    }

    cargarSolicitantes() {
        // Cargar lista de solicitantes en el nuevo modal
        const personas = this.modeloPersonas.obtenerTodasPersonas();
        this.renderizarListaSolicitantes(personas);
        this.enlazarBusquedaSolicitantes();
    }

    renderizarListaSolicitantes(personas) {
        const tabla = document.getElementById('tablaSolicitantes');
        if (!tabla) return;

        if (personas.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5" class="no-results">No hay solicitantes registrados</td></tr>';
            return;
        }

        tabla.innerHTML = personas.map(persona => `
            <tr class="persona-fila" data-id="${persona.id}">
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.circunscripcion}</td>
                <td>${persona.cargo}</td>
                <td>
                    <button class="btn-seleccionar-tabla" onclick="seleccionarSolicitante(${persona.id})">Seleccionar</button>
                    <button class="btn-editar" onclick="editarSolicitante(${persona.id})" title="Editar">✏️</button>
                    <button class="btn-eliminar" onclick="eliminarSolicitante(${persona.id})" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    enlazarBusquedaSolicitantes() {
        const busquedaInput = document.getElementById('busquedaSolicitantes');
        if (busquedaInput) {
            busquedaInput.addEventListener('input', (e) => {
                const termino = e.target.value.toLowerCase();
                this.filtrarSolicitantes(termino);
            });
        }
    }

    filtrarSolicitantes(termino) {
        const personas = this.modeloPersonas.obtenerTodasPersonas();
        const filtradas = personas.filter(persona => 
            persona.nombre.toLowerCase().includes(termino) ||
            persona.apellido.toLowerCase().includes(termino) ||
            persona.circunscripcion.toLowerCase().includes(termino) ||
            persona.cargo.toLowerCase().includes(termino)
        );
        this.renderizarListaSolicitantes(filtradas);
    }
}