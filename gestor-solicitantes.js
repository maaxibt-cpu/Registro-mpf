// Gestor de Solicitantes - Funcionalidad completa
class GestorSolicitantes {
    constructor() {
        this.modal = document.getElementById('modalSolicitantes');
        this.busquedaInput = document.getElementById('buscarSolicitante');
        this.tablaBody = document.getElementById('cuerpoTablaSolicitantes');
        this.mensajeSinResultados = document.getElementById('mensajeSinResultados');
        
        this.inicializar();
    }

    inicializar() {
        this.enlazarEventos();
        this.cargarSolicitantes();
    }

    enlazarEventos() {
        // Evento de búsqueda en tiempo real
        this.busquedaInput.addEventListener('input', (e) => {
            this.filtrarSolicitantes(e.target.value);
        });

        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.cerrarModal();
            }
        });
    }

    abrirModal() {
        this.modal.style.display = 'block';
        this.busquedaInput.value = '';
        this.cargarSolicitantes();
        this.busquedaInput.focus();
    }

    cerrarModal() {
        this.modal.style.display = 'none';
    }

    cargarSolicitantes() {
        const personas = this.obtenerTodasPersonas();
        this.mostrarSolicitantes(personas);
    }

    obtenerTodasPersonas() {
        try {
            // Primero intentar usar el modelo principal si está disponible
            if (window.aplicacion && window.aplicacion.controlador && window.aplicacion.controlador.modeloPersonas) {
                return window.aplicacion.controlador.modeloPersonas.obtenerTodasPersonas();
            }
            
            // Fallback: leer directamente de localStorage
            const datos = localStorage.getItem('personas');
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error('Error al obtener personas:', error);
            return [];
        }
    }

    filtrarSolicitantes(termino) {
        const personas = this.obtenerTodasPersonas();
        
        if (!termino.trim()) {
            this.mostrarSolicitantes(personas);
            return;
        }

        const terminoLower = termino.toLowerCase();
        const filtradas = personas.filter(persona => 
            persona.nombre.toLowerCase().includes(terminoLower) ||
            persona.apellido.toLowerCase().includes(terminoLower) ||
            persona.circunscripcion.toLowerCase().includes(terminoLower) ||
            persona.cargo.toLowerCase().includes(terminoLower)
        );

        this.mostrarSolicitantes(filtradas);
    }

    mostrarSolicitantes(personas) {
        if (personas.length === 0) {
            this.tablaBody.innerHTML = '';
            this.mensajeSinResultados.style.display = 'block';
            return;
        }

        this.mensajeSinResultados.style.display = 'none';
        
        this.tablaBody.innerHTML = personas.map(persona => `
            <tr class="fila-solicitante">
                <td>${this.escapeHtml(persona.nombre)}</td>
                <td>${this.escapeHtml(persona.apellido)}</td>
                <td>${this.escapeHtml(persona.circunscripcion)}</td>
                <td>${this.escapeHtml(persona.cargo)}</td>
                <td class="acciones">
                    <button class="btn-editar" onclick="gestorSolicitantes.editarSolicitante(${persona.id})" title="Editar solicitante">✏️</button>
                    <button class="btn-eliminar" onclick="gestorSolicitantes.eliminarSolicitante(${persona.id})" title="Eliminar solicitante">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    editarSolicitante(id) {
        const personas = this.obtenerTodasPersonas();
        const persona = personas.find(p => p.id === id);
        
        if (persona) {
            // Cerrar este modal y abrir el modal de formulario
            this.cerrarModal();
            
            // Usar la vista de formulario de solicitante para editar
            if (window.aplicacion && window.aplicacion.vistaFormularioSolicitante) {
                window.aplicacion.vistaFormularioSolicitante.toggleModal(true);
                
                // Llenar formulario con datos existentes
                document.getElementById('nuevaPersonaNombre').value = persona.nombre;
                document.getElementById('nuevaPersonaApellido').value = persona.apellido;
                document.getElementById('nuevaPersonaCircunscripcion').value = persona.circunscripcion;
                document.getElementById('nuevaPersonaCargo').value = persona.cargo;
                
                // Guardar ID para actualización en el controlador
                if (window.aplicacion && window.aplicacion.controlador) {
                    window.aplicacion.controlador.personaEditando = persona.id;
                }
                
                this.mostrarNotificacion(`Editando: ${persona.nombre} ${persona.apellido}`, 'info');
            }
        }
    }

    eliminarSolicitante(id) {
        const personas = this.obtenerTodasPersonas();
        const persona = personas.find(p => p.id === id);
        
        if (persona && confirm(`¿Está seguro de eliminar al solicitante: ${persona.nombre} ${persona.apellido}?`)) {
            try {
                // Usar el modelo principal si está disponible
                if (window.aplicacion && window.aplicacion.controlador && window.aplicacion.controlador.modeloPersonas) {
                    window.aplicacion.controlador.modeloPersonas.eliminarPersona(id);
                } else {
                    // Fallback: eliminar directamente de localStorage
                    const nuevasPersonas = personas.filter(p => p.id !== id);
                    localStorage.setItem('personas', JSON.stringify(nuevasPersonas));
                }
                
                this.cargarSolicitantes();
                this.mostrarNotificacion('Solicitante eliminado correctamente', 'success');
                
            } catch (error) {
                console.error('Error al eliminar solicitante:', error);
                this.mostrarNotificacion('Error al eliminar solicitante', 'error');
            }
        }
    }

    mostrarNotificacion(mensaje, tipo) {
        // Usar el sistema de notificaciones existente si está disponible
        if (window.aplicacion && window.aplicacion.vistaActividades) {
            window.aplicacion.vistaActividades.mostrarNotificacion(mensaje, tipo);
        } else {
            alert(mensaje); // Fallback simple
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Funciones globales
function abrirModalSolicitantes() {
    if (!window.gestorSolicitantes) {
        window.gestorSolicitantes = new GestorSolicitantes();
    }
    window.gestorSolicitantes.abrirModal();
}

function cerrarModalSolicitantes() {
    if (window.gestorSolicitantes) {
        window.gestorSolicitantes.cerrarModal();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // El gestor se inicializará cuando se abra el modal
});