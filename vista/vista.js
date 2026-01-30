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
            if (e.target.classList.contains('btn-eliminar-tabla')) {
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

        this.listaActividades.innerHTML = `
            <div class="tabla-actividades-container">
                <table class="tabla-actividades">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Técnico</th>
                            <th>Tipo</th>
                            <th>Solicitante</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actividades.map(actividad => `
                            <tr class="fila-actividad" data-id="${actividad.id}">
                                <td class="fecha">${new Date(actividad.fecha).toLocaleDateString('es-ES')}</td>
                                <td class="tecnico">${actividad.tecnico}</td>
                                <td class="tipo"><span class="badge-tipo ${actividad.tipo}">${this.obtenerEtiquetaTipo(actividad.tipo)}</span></td>
                                <td class="solicitante">${actividad.nombre} ${actividad.apellido}</td>
                                <td class="descripcion">${actividad.descripcion || 'Sin descripción'}</td>
                                <td class="estado"><span class="badge-estado ${actividad.estado}">${this.obtenerEtiquetaEstado(actividad.estado)}</span></td>
                                <td class="acciones">
                                    <div class="btn-accion-grupo">
                                        <button class="btn-editar-tabla" onclick="iniciarEdicionActividadGlobal(${actividad.id})" title="Editar actividad">✏️</button>
                                        <button class="btn-eliminar-tabla" data-id="${actividad.id}" title="Eliminar actividad">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
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