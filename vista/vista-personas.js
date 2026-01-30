class VistaPersonas {
    constructor() {
        this.modal = document.getElementById('modalPersonas');
        this.listaPersonas = document.getElementById('listaPersonas');
        this.busquedaPersonas = document.getElementById('busquedaPersonas');
        this.formularioPersona = document.getElementById('formularioPersona');
        this.btnNuevaPersona = document.getElementById('btnNuevaPersona');
        this.btnCerrarModal = document.getElementById('btnCerrarModal');
        this.btnSeleccionarPersona = document.getElementById('btnSeleccionarPersona');
        this.controlesPaginacion = document.getElementById('controlesPaginacion');
        this.infoPaginacion = document.getElementById('infoPaginacion');
        
        this.personaSeleccionada = null;
        this.personaEditando = null;
        this.paginaActual = 1;
        this.porPagina = 10;
        this.terminoBusqueda = '';
    }

    // Mostrar/ocultar modal
    toggleModal(mostrar = true) {
        this.modal.style.display = mostrar ? 'block' : 'none';
        if (mostrar) {
            this.busquedaPersonas.value = '';
            this.terminoBusqueda = '';
            this.paginaActual = 1;
            this.actualizarVista();
        } else {
            // Limpiar formulario cuando se cierra el modal
            this.formularioPersona.reset();
            this.personaEditando = null;
        }
    }

    // Enlazar eventos
    enlazarEventos(manejadores) {
        // Botón para abrir modal de personas
        document.getElementById('abrirModalPersonas').addEventListener('click', () => {
            this.toggleModal(true);
        });

        // Busqueda en tiempo real
        this.busquedaPersonas.addEventListener('input', (e) => {
            this.terminoBusqueda = e.target.value;
            this.paginaActual = 1;
            this.actualizarVista();
        });

        // Formulario para nueva persona
        this.formularioPersona.addEventListener('submit', (e) => {
            e.preventDefault();
            manejadores.agregarPersona({
                nombre: document.getElementById('nuevaPersonaNombre').value.trim(),
                apellido: document.getElementById('nuevaPersonaApellido').value.trim(),
                circunscripcion: document.getElementById('nuevaPersonaCircunscripcion').value.trim(),
                cargo: document.getElementById('nuevaPersonaCargo').value.trim()
            });
            this.formularioPersona.reset();
        });

        // Cerrar modal
        this.btnCerrarModal.addEventListener('click', () => {
            this.toggleModal(false);
        });

        // Cancelar modal (botón eliminado, solo se usa la X)

        // Seleccionar persona
        this.btnSeleccionarPersona.addEventListener('click', () => {
            if (this.personaSeleccionada) {
                manejadores.seleccionarPersona(this.personaSeleccionada);
                this.toggleModal(false);
            }
        });

        // Cerrar modal al hacer click fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.toggleModal(false);
            }
        });
    }

    // Actualizar vista completa con paginación
    actualizarVista() {
        const resultado = this.modelo.obtenerPersonasPaginadas(
            this.paginaActual, 
            this.porPagina, 
            this.terminoBusqueda
        );
        
        this.renderizarPersonas(resultado.personas);
        this.renderizarControlesPaginacion(resultado.paginacion);
        this.renderizarInfoPaginacion(resultado.paginacion);
    }

    // Renderizar lista de personas
    renderizarPersonas(personas) {
        if (personas.length === 0) {
            this.listaPersonas.innerHTML = '<p class="no-personas">No se encontraron personas</p>';
            return;
        }

        this.listaPersonas.innerHTML = personas.map(persona => `
            <div class="persona-item" data-id="${persona.id}">
                <input type="radio" name="personaSeleccionada" value="${persona.id}" 
                       id="persona-${persona.id}" onchange="vistaPersonas.seleccionarPersona(${persona.id})">
                <label for="persona-${persona.id}" class="persona-info">
                    <strong>${persona.nombre} ${persona.apellido}</strong>
                    <br>
                    <span>${persona.cargo} - ${persona.circunscripcion}</span>
                </label>
                <button class="btn-eliminar-persona" onclick="vistaPersonas.eliminarPersona(${persona.id})">🗑️</button>
            </div>
        `).join('');
    }

    // Renderizar controles de paginación
    renderizarControlesPaginacion(paginacion) {
        this.controlesPaginacion.innerHTML = `
            <button class="btn-pag prev" onclick="vistaPersonas.cambiarPagina(${paginacion.paginaActual - 1})" 
                    ${!paginacion.tieneAnterior ? 'disabled' : ''}>
                ← Anterior
            </button>
            <button class="btn-pag next" onclick="vistaPersonas.cambiarPagina(${paginacion.paginaActual + 1})" 
                    ${!paginacion.tieneSiguiente ? 'disabled' : ''}>
                Siguiente →
            </button>
        `;
    }

    // Renderizar información de paginación
    renderizarInfoPaginacion(paginacion) {
        const inicio = (paginacion.paginaActual - 1) * paginacion.porPagina + 1;
        const fin = Math.min(inicio + paginacion.porPagina - 1, paginacion.total);
        
        this.infoPaginacion.innerHTML = `
            <span class="pagination-info">
                Mostrando ${inicio}-${fin} de ${paginacion.total} personas
            </span>
            <span class="pagination-pages">
                Página ${paginacion.paginaActual} de ${paginacion.totalPaginas}
            </span>
        `;
    }

    // Cambiar página
    cambiarPagina(pagina) {
        this.paginaActual = pagina;
        this.actualizarVista();
    }

    // Seleccionar persona
    seleccionarPersona(id) {
        this.personaSeleccionada = this.modelo.obtenerPersonaPorId(id);
        this.btnSeleccionarPersona.disabled = !this.personaSeleccionada;
        
        // Marcar visualmente la selección
        document.querySelectorAll('.persona-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.persona-item[data-id="${id}"]`).classList.add('selected');
    }

    // Eliminar persona
    eliminarPersona(id) {
        if (confirm('¿Está seguro de que desea eliminar esta persona?')) {
            this.modelo.eliminarPersona(id);
            this.actualizarVista();
            
            if (this.personaSeleccionada && this.personaSeleccionada.id === id) {
                this.personaSeleccionada = null;
                this.btnSeleccionarPersona.disabled = true;
            }
        }
    }

    // Actualizar campo de solicitante en el formulario principal
    actualizarCampoSolicitante(persona) {
        if (persona) {
            document.getElementById('solicitante').value = `${persona.nombre} ${persona.apellido}`;
            document.getElementById('solicitanteId').value = persona.id;
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notification ${tipo}`;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 3000);
    }
}