class VistaActividades {
    constructor() {
        this.formulario = document.getElementById('activityForm');
        this.listaActividades = document.getElementById('activitiesList');
        this.campoBusqueda = document.getElementById('searchInput');
        this.filtroTipo = document.getElementById('filterTipo');
        this.filtroEstado = document.getElementById('filterEstado');
        
        this.establecerFechaHoy();
    }

    establecerFechaHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha').value = hoy;
    }

    enlazarAgregarActividad(manejador) {
        this.formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const datosActividad = {
                fecha: document.getElementById('fecha').value,
                tecnico: document.getElementById('tecnico').value.trim(),
                tipo: document.getElementById('tipo').value,
                descripcion: document.getElementById('descripcion').value.trim(),
                estado: document.getElementById('estado').value
            };
            
            // Validación básica
            if (this.validarFormulario(datosActividad)) {
                manejador(datosActividad);
                this.formulario.reset();
                this.establecerFechaHoy();
            }
        });
    }

    enlazarEliminarActividad(manejador) {
        this.listaActividades.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const id = parseInt(e.target.dataset.id);
                manejador(id);
            }
        });
    }

    enlazarFiltrarActividades(manejador) {
        const manejadorFiltros = () => {
            const filtros = {
                search: this.campoBusqueda.value,
                tipo: this.filtroTipo.value,
                estado: this.filtroEstado.value
            };
            manejador(filtros);
        };

        this.campoBusqueda.addEventListener('input', manejadorFiltros);
        this.filtroTipo.addEventListener('change', manejadorFiltros);
        this.filtroEstado.addEventListener('change', manejadorFiltros);
    }

    enlazarExportarDatos(manejador) {
        document.getElementById('exportBtn').addEventListener('click', () => {
            manejador();
        });
    }

    enlazarAbrirModalSolicitantes(manejador) {
        document.getElementById('btnSolicitantes').addEventListener('click', () => {
            manejador();
        });
    }

    validarFormulario(datos) {
        if (!datos.fecha || !datos.tecnico || !datos.tipo || !datos.descripcion || !datos.estado) {
            this.mostrarNotificacion('Por favor complete todos los campos', 'error');
            return false;
        }
        return true;
    }

    renderizarActividades(actividades) {
        if (actividades.length === 0) {
            this.listaActividades.innerHTML = '<p class="no-activities">No se encontraron actividades</p>';
            return;
        }

        this.listaActividades.innerHTML = actividades.map(actividad => `
            <div class="activity-card">
                <div class="activity-header">
                    <h3>${actividad.nombre} ${actividad.apellido}</h3>
                    <span class="activity-type ${actividad.tipo}">${this.obtenerEtiquetaTipo(actividad.tipo)}</span>
                </div>
                <div class="activity-details">
                    <p><strong>Solicitante:</strong> ${actividad.nombre} ${actividad.apellido}</p>
                    <p><strong>Circunscripción:</strong> ${actividad.circunscripcion}</p>
                    <p><strong>Cargo:</strong> ${actividad.cargo}</p>
                    <p><strong>Técnico:</strong> ${actividad.tecnico}</p>
                    <p><strong>Fecha:</strong> ${new Date(actividad.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Descripción:</strong> ${actividad.descripcion}</p>
                    <p><strong>Estado:</strong> <span class="status ${actividad.estado}">${this.obtenerEtiquetaEstado(actividad.estado)}</span></p>
                </div>
                <div class="activity-actions">
                    <button class="btn-delete" data-id="${actividad.id}">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    obtenerEtiquetaTipo(tipo) {
        const tipos = {
            mantenimiento: 'Mantenimiento',
            reparacion: 'Reparación',
            instalacion: 'Instalación',
            soporte: 'Soporte Técnico',
            otro: 'Otro'
        };
        return tipos[tipo] || tipo;
    }

    obtenerEtiquetaEstado(estado) {
        const estados = {
            completado: 'Completado',
            pendiente: 'Pendiente',
            en_proceso: 'En Proceso',
            cancelado: 'Cancelado'
        };
        return estados[estado] || estado;
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notification ${tipo}`;
        notificacion.textContent = mensaje;
        
        // Agregar al DOM
        document.body.appendChild(notificacion);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 3000);
    }

    actualizarCampoSolicitante(persona) {
        // Actualizar el campo de solicitante en el formulario
        const solicitanteInput = document.getElementById('solicitante');
        const solicitanteIdInput = document.getElementById('solicitanteId');
        
        if (solicitanteInput && solicitanteIdInput) {
            solicitanteInput.value = `${persona.nombre} ${persona.apellido}`;
            solicitanteIdInput.value = persona.id;
        }
    }
}