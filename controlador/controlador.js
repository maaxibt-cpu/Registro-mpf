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
        
        console.log('Controlador inicializado');
    }

    iniciarEdicionSolicitante(id) {
        console.log('Buscando fila con ID:', id);
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) {
            console.error('Fila no encontrada para ID:', id);
            return;
        }

        console.log('Fila encontrada:', fila);
        const persona = this.modeloPersonas.obtenerPersonaPorId(id);
        if (!persona) {
            console.error('Persona no encontrada para ID:', id);
            return;
        }

        console.log('Persona encontrada:', persona);

        // Guardar datos originales
        fila.setAttribute('data-original-nombre', persona.nombre);
        fila.setAttribute('data-original-apellido', persona.apellido);
        fila.setAttribute('data-original-circunscripcion', persona.circunscripcion);
        fila.setAttribute('data-original-cargo', persona.cargo);

        // Convertir celdas a modo edición
        const celdas = fila.querySelectorAll('td');
        console.log('Número de celdas encontradas:', celdas.length);
        console.log('Estructura de celdas:', Array.from(celdas).map((celda, index) => `${index}: ${celda.textContent.trim()}`));
        
        // Nombre - input text
        celdas[0].innerHTML = `<input type="text" class="edit-input" value="${persona.nombre}" data-field="nombre">`;
        
        // Apellido - input text
        celdas[1].innerHTML = `<input type="text" class="edit-input" value="${persona.apellido}" data-field="apellido">`;
        
        // Circunscripción - select
        const opcionesCircunscripcion = [
            'Primera Circunscripción Capital',
            'Segunda Circunscripción Chilecito', 
            'Tercera Circunscripción Chamical',
            'Cuarta Circunscripción Aimogasta',
            'Quinta Circunscripción Chepes',
            'Sexta Circunscripción Villa Unión'
        ];
        celdas[2].innerHTML = `
            <select class="edit-select" data-field="circunscripcion" style="min-width: 260px;">
                ${opcionesCircunscripcion.map(op => 
                    `<option value="${op}" ${op === persona.circunscripcion ? 'selected' : ''}>${op}</option>`
                ).join('')}
            </select>
        `;
        
        // Cargo - select (mismas opciones que el formulario de agregar)
        const opcionesCargo = ['Operador', 'Fiscal'];
        celdas[3].innerHTML = `
            <select class="edit-select" data-field="cargo" style="min-width: 90px;">
                ${opcionesCargo.map(op => 
                    `<option value="${op}" ${op === persona.cargo ? 'selected' : ''}>${op}</option>`
                ).join('')}
            </select>
        `;
        
        // Reemplazar botones por botones de guardar/cancelar
        celdas[4].innerHTML = `
            <button class="btn-guardar" onclick="guardarEdicionSolicitanteGlobal(${id})" title="Guardar">💾</button>
            <button class="btn-cancelar" onclick="cancelarEdicionSolicitanteGlobal(${id})" title="Cancelar">❌</button>
        `;
        
        // Enfocar el primer campo
        setTimeout(() => {
            const primerInput = fila.querySelector('.edit-input');
            if (primerInput) primerInput.focus();
        }, 100);
    }

    guardarEdicionSolicitante(id) {
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) return;

        const datosEditados = {
            nombre: fila.querySelector('[data-field="nombre"]').value,
            apellido: fila.querySelector('[data-field="apellido"]').value,
            circunscripcion: fila.querySelector('[data-field="circunscripcion"]').value,
            cargo: fila.querySelector('[data-field="cargo"]').value
        };

        // Validar campos obligatorios
        if (!datosEditados.nombre.trim() || !datosEditados.apellido.trim()) {
            alert('Nombre y Apellido son campos obligatorios');
            return;
        }

        // Actualizar en el modelo
        this.modeloPersonas.actualizarPersona(id, datosEditados);
        
        const persona = this.modeloPersonas.obtenerPersonaPorId(id);
        if (!persona) return;
        
        // Actualizar solo esta fila específica
        const celdas = fila.querySelectorAll('td');
        
        // Actualizar celdas de datos
        celdas[0].textContent = persona.nombre;
        celdas[1].textContent = persona.apellido;
        celdas[2].textContent = persona.circunscripcion;
        celdas[3].textContent = persona.cargo;
        
        // Restaurar botones de acciones (solo editar y eliminar para gestor-solicitantes)
        celdas[4].innerHTML = `
            <button class="btn-editar" onclick="iniciarEdicionSolicitanteGlobal(${persona.id})" title="Editar solicitante">✏️</button>
            <button class="btn-eliminar" onclick="gestorSolicitantes.eliminarSolicitante(${persona.id})" title="Eliminar solicitante">🗑️</button>
        `;
        
        // Mostrar notificación
        this.mostrarNotificacion(`Solicitante ${datosEditados.nombre} ${datosEditados.apellido} actualizado correctamente`, 'success');
    }

    cancelarEdicionSolicitante(id) {
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) return;

        const persona = this.modeloPersonas.obtenerPersonaPorId(id);
        if (!persona) return;

        // Restaurar solo esta fila específica
        const celdas = fila.querySelectorAll('td');
        
        // Restaurar celdas de datos
        celdas[0].textContent = persona.nombre;
        celdas[1].textContent = persona.apellido;
        celdas[2].textContent = persona.circunscripcion;
        celdas[3].textContent = persona.cargo;
        
        // Restaurar botones de acciones (solo editar y eliminar para gestor-solicitantes)
        celdas[4].innerHTML = `
            <button class="btn-editar" onclick="iniciarEdicionSolicitanteGlobal(${persona.id})" title="Editar solicitante">✏️</button>
            <button class="btn-eliminar" onclick="gestorSolicitantes.eliminarSolicitante(${persona.id})" title="Eliminar solicitante">🗑️</button>
        `;
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Implementar notificación visual si es necesario
        console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    }

    // Funciones globales para edición
    iniciarEdicionSolicitanteGlobal(id) {
        console.log('Función global llamada con ID:', id);
        console.log('Iniciando edición...');
        this.iniciarEdicionSolicitante(id);
    }

    guardarEdicionSolicitanteGlobal(id) {
        console.log('Guardando edición para ID:', id);
        this.guardarEdicionSolicitante(id);
    }

    cancelarEdicionSolicitanteGlobal(id) {
        console.log('Cancelando edición para ID:', id);
        this.cancelarEdicionSolicitante(id);
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
        if (typeof mostrarModalConfirmacionActividad === 'function') {
            mostrarModalConfirmacionActividad(id);
        } else {
            // Fallback al confirm nativo si la función no está disponible
            if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
                this.modeloActividades.eliminarActividad(id);
                this.actualizarVista();
                this.vistaActividades.mostrarNotificacion('Actividad eliminada correctamente', 'exito');
            }
        }
    }

    manejarFiltrarActividades(filtros) {
        const actividadesFiltradas = this.modeloActividades.filtrarActividades(filtros);
        this.vistaActividades.renderizarActividades(actividadesFiltradas);
    }

    manejarExportarDatos() {
        try {
            // Obtener datos para exportar
            const datos = this.modeloActividades.obtenerDatosParaExportar();
            
            // Generar PDF
            generarPDFActividades(datos);
            
            this.vistaActividades.mostrarNotificacion('PDF generado correctamente', 'exito');
        } catch (error) {
            this.vistaActividades.mostrarNotificacion('Error al generar PDF', 'error');
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
        const tabla = document.getElementById('cuerpoTablaSolicitantes');
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
                    <button class="btn-editar" onclick="iniciarEdicionSolicitanteGlobal(${persona.id})" title="Editar">✏️</button>
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

    // Funciones para edición de actividades
    iniciarEdicionActividad(id) {
        console.log('Iniciando edición de actividad ID:', id);
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) {
            console.error('Fila no encontrada para ID:', id);
            return;
        }

        const actividad = this.modeloActividades.obtenerActividadPorId(id);
        if (!actividad) {
            console.error('Actividad no encontrada para ID:', id);
            return;
        }

        console.log('Actividad encontrada:', actividad);

        // Guardar datos originales
        fila.setAttribute('data-original-fecha', actividad.fecha);
        fila.setAttribute('data-original-tecnico', actividad.tecnico);
        fila.setAttribute('data-original-tipo', actividad.tipo);
        fila.setAttribute('data-original-descripcion', actividad.descripcion || '');
        fila.setAttribute('data-original-estado', actividad.estado);

        // Convertir celdas a modo edición
        const celdas = fila.querySelectorAll('td');
        console.log('Número de celdas encontradas:', celdas.length);
        
        // Fecha - input date
        celdas[0].innerHTML = `<input type="date" class="edit-input" value="${actividad.fecha}" data-field="fecha">`;
        
        // Técnico - select con técnicos del sistema
        const tecnicos = ['Carlos Beres', 'Santiago Somerville', 'Omar Vallejos', 'Maximiliano Burela Tello', 'Ricardo Cuello', 'Jorge Olmedo', 'Lucas Vega'];
        celdas[1].innerHTML = `
            <select class="edit-select" data-field="tecnico">
                <option value="">Seleccione técnico</option>
                ${tecnicos.map(tec => 
                    `<option value="${tec}" ${tec === actividad.tecnico ? 'selected' : ''}>${tec}</option>`
                ).join('')}
            </select>
        `;
        
        // Tipo - select con tipos del sistema
        const tipos = ['mantenimiento', 'reparacion', 'instalacion', 'soporte', 'otro'];
        const etiquetasTipos = {
            'mantenimiento': 'Mantenimiento',
            'reparacion': 'Reparación', 
            'instalacion': 'Instalación',
            'soporte': 'Soporte Técnico',
            'otro': 'Otro'
        };
        celdas[2].innerHTML = `
            <select class="edit-select" data-field="tipo">
                <option value="">Seleccione tipo</option>
                ${tipos.map(tipo => 
                    `<option value="${tipo}" ${tipo === actividad.tipo ? 'selected' : ''}>${etiquetasTipos[tipo]}</option>`
                ).join('')}
            </select>
        `;
        
        // Solicitante - select con personas del sistema
        const personas = this.modeloPersonas.obtenerTodasPersonas();
        celdas[3].innerHTML = `
            <select class="edit-select" data-field="solicitanteId">
                <option value="">Seleccione solicitante</option>
                ${personas.map(persona => 
                    `<option value="${persona.id}" ${persona.id === actividad.solicitanteId ? 'selected' : ''}>${persona.nombre} ${persona.apellido}</option>`
                ).join('')}
            </select>
        `;
        
        // Descripción - textarea
        celdas[4].innerHTML = `<textarea class="edit-textarea" data-field="descripcion" rows="2">${actividad.descripcion || ''}</textarea>`;
        
        // Estado - select con estados del sistema
        const estados = ['completado', 'pendiente', 'en-progreso'];
        const etiquetasEstados = {
            'completado': 'Completado',
            'pendiente': 'Pendiente',
            'en-progreso': 'En progreso'
        };
        celdas[5].innerHTML = `
            <select class="edit-select" data-field="estado">
                <option value="">Seleccione estado</option>
                ${estados.map(estado => 
                    `<option value="${estado}" ${estado === actividad.estado ? 'selected' : ''}>${etiquetasEstados[estado]}</option>`
                ).join('')}
            </select>
        `;
        
        // Acciones - botones Guardar y Cancelar
        celdas[6].innerHTML = `
            <div class="btn-accion-grupo">
                <button class="btn-guardar-tabla" onclick="guardarEdicionActividadGlobal(${actividad.id})" title="Guardar cambios">💾</button>
                <button class="btn-cancelar-tabla" onclick="cancelarEdicionActividadGlobal(${actividad.id})" title="Cancelar edición">❌</button>
            </div>
        `;
    }

    cargarDatosEnModalEdicion(actividad) {
        // Llenar el formulario con los datos de la actividad
        document.getElementById('edicionActividadId').value = actividad.id;
        document.getElementById('edicionFecha').value = actividad.fecha;
        document.getElementById('edicionTecnico').value = actividad.tecnico;
        document.getElementById('edicionTipo').value = actividad.tipo;
        document.getElementById('edicionSolicitante').value = `${actividad.nombre} ${actividad.apellido}`;
        document.getElementById('edicionSolicitanteId').value = actividad.solicitanteId || '';
        document.getElementById('edicionDescripcion').value = actividad.descripcion || '';
        document.getElementById('edicionEstado').value = actividad.estado;
    }

    guardarEdicionActividad(id) {
        console.log('Guardando cambios para actividad ID:', id);
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) {
            console.error('Fila no encontrada para ID:', id);
            return;
        }

        // Obtener datos de los inputs de edición
        const fechaInput = fila.querySelector('input[data-field="fecha"]');
        const tecnicoSelect = fila.querySelector('select[data-field="tecnico"]');
        const tipoSelect = fila.querySelector('select[data-field="tipo"]');
        const solicitanteSelect = fila.querySelector('select[data-field="solicitanteId"]');
        const descripcionTextarea = fila.querySelector('textarea[data-field="descripcion"]');
        const estadoSelect = fila.querySelector('select[data-field="estado"]');

        if (!fechaInput || !tecnicoSelect || !tipoSelect || !solicitanteSelect || !estadoSelect) {
            console.error('No se encontraron todos los campos de edición');
            return;
        }

        const fecha = fechaInput.value;
        const tecnico = tecnicoSelect.value;
        const tipo = tipoSelect.value;
        const solicitanteId = solicitanteSelect.value;
        const descripcion = descripcionTextarea ? descripcionTextarea.value : '';
        const estado = estadoSelect.value;

        // Validar datos
        if (!fecha || !tecnico || !tipo || !estado) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Obtener la actividad original
        const actividadOriginal = this.modeloActividades.obtenerActividadPorId(id);
        if (!actividadOriginal) {
            console.error('Actividad original no encontrada para ID:', id);
            return;
        }

        // Obtener datos del solicitante seleccionado
        let nombre = actividadOriginal.nombre;
        let apellido = actividadOriginal.apellido;
        let circunscripcion = actividadOriginal.circunscripcion;
        let cargo = actividadOriginal.cargo;

        // Si se cambió el solicitante, obtener sus datos
        if (solicitanteId && solicitanteId !== actividadOriginal.solicitanteId) {
            const nuevaPersona = this.modeloPersonas.obtenerPersonaPorId(parseInt(solicitanteId));
            if (nuevaPersona) {
                nombre = nuevaPersona.nombre;
                apellido = nuevaPersona.apellido;
                circunscripcion = nuevaPersona.circunscripcion;
                cargo = nuevaPersona.cargo;
            }
        }

        // Crear objeto con datos actualizados
        const datosActualizados = {
            fecha,
            tecnico,
            tipo,
            descripcion,
            estado,
            solicitanteId: solicitanteId || actividadOriginal.solicitanteId,
            nombre,
            apellido,
            circunscripcion,
            cargo
        };

        // Actualizar la actividad en el modelo
        const exito = this.modeloActividades.actualizarActividad(id, datosActualizados);
        
        if (exito) {
            console.log('Actividad actualizada exitosamente');
            
            // Actualizar la vista
            this.actualizarVista();
            
            // Mostrar notificación
            if (this.vistaActividades && typeof this.vistaActividades.mostrarNotificacion === 'function') {
                this.vistaActividades.mostrarNotificacion('Actividad actualizada exitosamente', 'success');
            }
        } else {
            console.error('Error al actualizar la actividad');
            alert('Error al actualizar la actividad');
        }
    }

    cancelarEdicionActividad(id) {
        console.log('Cancelando edición para actividad ID:', id);
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (!fila) {
            console.error('Fila no encontrada para ID:', id);
            return;
        }

        // Restaurar datos originales de la fila
        const fechaOriginal = fila.getAttribute('data-original-fecha');
        const tecnicoOriginal = fila.getAttribute('data-original-tecnico');
        const tipoOriginal = fila.getAttribute('data-original-tipo');
        const descripcionOriginal = fila.getAttribute('data-original-descripcion');
        const estadoOriginal = fila.getAttribute('data-original-estado');

        // Obtener la actividad para información del solicitante
        const actividad = this.modeloActividades.obtenerActividadPorId(id);
        if (!actividad) {
            console.error('Actividad no encontrada para ID:', id);
            return;
        }

        // Restaurar vista normal de la fila
        const celdas = fila.querySelectorAll('td');
        
        // Fecha
        celdas[0].innerHTML = new Date(fechaOriginal).toLocaleDateString('es-ES');
        
        // Técnico
        celdas[1].innerHTML = tecnicoOriginal;
        
        // Tipo
        celdas[2].innerHTML = `<span class="badge-tipo ${tipoOriginal}">${this.vistaActividades.obtenerEtiquetaTipo(tipoOriginal)}</span>`;
        
        // Solicitante
        celdas[3].innerHTML = `${actividad.nombre} ${actividad.apellido}`;
        
        // Descripción
        celdas[4].innerHTML = descripcionOriginal || 'Sin descripción';
        
        // Estado
        celdas[5].innerHTML = `<span class="badge-estado ${estadoOriginal}">${this.vistaActividades.obtenerEtiquetaEstado(estadoOriginal)}</span>`;
        
        // Acciones - botones Editar y Eliminar
        celdas[6].innerHTML = `
            <div class="btn-accion-grupo">
                <button class="btn-editar-tabla" onclick="iniciarEdicionActividadGlobal(${id})" title="Editar actividad">✏️</button>
                <button class="btn-eliminar-tabla" data-id="${id}" title="Eliminar actividad">🗑️</button>
            </div>
        `;

        // Limpiar atributos de datos originales
        fila.removeAttribute('data-original-fecha');
        fila.removeAttribute('data-original-tecnico');
        fila.removeAttribute('data-original-tipo');
        fila.removeAttribute('data-original-descripcion');
        fila.removeAttribute('data-original-estado');
    }

    // Funciones globales para acceso desde HTML
    iniciarEdicionActividadGlobal(id) {
        this.iniciarEdicionActividad(id);
    }

    guardarEdicionActividadGlobal(id) {
        this.guardarEdicionActividad(id);
    }

    cancelarEdicionActividadGlobal(id) {
        this.cancelarEdicionActividad(id);
    }
}