// Controlador para gestión de inventario/stock
class ControladorStock {
    constructor(modeloStock, vistaStock) {
        this.modeloStock = modeloStock;
        this.vistaStock = vistaStock;
        this.parteEditando = null;

        this.enlazarEventos();
    }

    // Enlazar eventos del DOM
    enlazarEventos() {
        // Evento búsqueda en tiempo real
        const busquedaInput = document.getElementById('busquedaStock');
        if (busquedaInput) {
            busquedaInput.addEventListener('input', (e) => {
                this.buscarPartes(e.target.value);
            });
        }

        // Evento filtro por estado
        const filtroEstado = document.getElementById('filtroEstado');
        if (filtroEstado) {
            filtroEstado.addEventListener('change', (e) => {
                this.filtrarPorEstado(e.target.value);
            });
        }
    }

    // Guardar parte (crear o actualizar) - FUNCIÓN DESHABILITADA PORQUE EL FORMULARIO FUE ELIMINADO
    /* guardarParte() {
        const formData = new FormData(document.getElementById('formStock'));
        const datos = {
            nombre: document.getElementById('nombreParte').value,
            modelo: document.getElementById('modelo').value,
            serial: document.getElementById('serial').value,
            cantidad: document.getElementById('cantidad').value,
            estado: document.getElementById('estado').value,
            ubicacion: document.getElementById('ubicacion').value,
            observaciones: document.getElementById('observaciones').value
        };

        // Validaciones básicas
        if (!datos.nombre.trim()) {
            this.mostrarNotificacion('El nombre de la parte es requerido', 'error');
            return;
        }

        if (this.parteEditando) {
            // Actualizar parte existente
            const parteActualizada = this.modeloStock.actualizarParte(this.parteEditando.id, datos);
            if (parteActualizada) {
                this.mostrarNotificacion('Parte actualizada correctamente', 'success');
                this.limpiarFormulario();
                this.cargarPartes();
            }
        } else {
            // Crear nueva parte
            const nuevaParte = this.modeloStock.agregarParte(datos);
            this.mostrarNotificacion('Parte agregada correctamente', 'success');
            this.limpiarFormulario();
            this.cargarPartes();
        }
    } */

    // Cargar todas las partes en la tabla
    cargarPartes() {
        const partes = this.modeloStock.obtenerPartes();
        this.vistaStock.renderizarPartes(partes);
    }

    // Buscar partes por texto
    buscarPartes(texto) {
        const partes = this.modeloStock.buscarPartes(texto);
        this.vistaStock.renderizarPartes(partes);
    }

    // Filtrar partes por estado
    filtrarPorEstado(estado) {
        const partes = this.modeloStock.filtrarPorEstado(estado);
        this.vistaStock.renderizarPartes(partes);
    }

    // Iniciar edición de parte usando la fila de edición rápida
    iniciarEdicionParte(id) {
        const parte = this.modeloStock.obtenerPartePorId(id);
        if (parte) {
            this.parteEditando = parte;
            
            // Llenar campos de edición rápida con datos de la parte
            const nombreSelect = document.getElementById('rapidaNombre');
            
            // Para el campo de selección de nombre, buscar la opción que coincida
            let nombreEncontrado = false;
            for (let i = 0; i < nombreSelect.options.length; i++) {
                if (nombreSelect.options[i].value === parte.nombre) {
                    nombreSelect.selectedIndex = i;
                    nombreEncontrado = true;
                    break;
                }
            }
            
            // Si no se encuentra una opción que coincida, usar el valor directamente
            if (!nombreEncontrado && parte.nombre) {
                nombreSelect.value = parte.nombre;
            }
            
            document.getElementById('rapidaModelo').value = parte.modelo || '';
            document.getElementById('rapidaSerial').value = parte.serial || '';
            document.getElementById('rapidaEstado').value = parte.estado;
            document.getElementById('rapidaDescripcion').value = parte.descripcion || '';
            
            // Establecer fecha manualmente si existe
            if (parte.fechaCreacion) {
                const fecha = new Date(parte.fechaCreacion);
                document.getElementById('rapidaFecha').value = fecha.toISOString().split('T')[0];
            }
            
            // Cambiar comportamiento del botón guardar para que actualice en lugar de crear
            window.guardarEdicionRapida = () => {
                this.actualizarParteDesdeEdicionRapida(id);
            };
            
            this.mostrarNotificacion('Editando parte: ' + parte.nombre, 'info');
        }
    }
    
    // Actualizar parte desde los campos de edición rápida
    actualizarParteDesdeEdicionRapida(id) {
        const datosActualizados = {
            nombre: document.getElementById('rapidaNombre').value,
            modelo: document.getElementById('rapidaModelo').value,
            serial: document.getElementById('rapidaSerial').value,
            estado: document.getElementById('rapidaEstado').value,
            descripcion: document.getElementById('rapidaDescripcion').value
        };
        
        // Obtener fecha manual si se ingresó
        const fechaInput = document.getElementById('rapidaFecha').value;
        if (fechaInput) {
            datosActualizados.fechaCreacion = new Date(fechaInput).toISOString();
        }
        
        // Validaciones básicas
        if (!datosActualizados.nombre.trim()) {
            this.mostrarNotificacion('El nombre de la parte es requerido', 'error');
            return;
        }
        
        const parteActualizada = this.modeloStock.actualizarParte(id, datosActualizados);
        if (parteActualizada) {
            this.mostrarNotificacion('Parte actualizada correctamente', 'success');
            this.cargarPartes();
            this.limpiarEdicionRapida();
            
            // Restaurar función original de guardar
            window.guardarEdicionRapida = () => {
                this.agregarParteDesdeEdicionRapida();
            };
        }
    }

    // Eliminar parte (llamada desde el modal de confirmación)
    eliminarParte(id) {
        const eliminado = this.modeloStock.eliminarParte(id);
        if (eliminado) {
            this.mostrarNotificacion('Parte eliminada correctamente', 'success');
            this.cargarPartes();
        }
    }

    // Mostrar modal de confirmación para eliminar parte
    mostrarConfirmacionEliminacion(id) {
        if (typeof mostrarModalConfirmacionParte === 'function') {
            mostrarModalConfirmacionParte(id);
        } else {
            // Fallback al confirm nativo si la función no está disponible
            if (confirm('¿Estás seguro de que quieres eliminar esta parte del inventario?')) {
                this.eliminarParte(id);
            }
        }
    }

    // Limpiar formulario - FUNCIÓN DESHABILITADA PORQUE EL FORMULARIO FUE ELIMINADO
    /* limpiarFormulario() {
        document.getElementById('formStock').reset();
        document.getElementById('parteId').value = '';
        this.parteEditando = null;
        document.querySelector('button[type="submit"]').textContent = 'Guardar Parte';
    } */

    // Limpiar campos de edición rápida
    limpiarEdicionRapida() {
        document.getElementById('rapidaNombre').value = '';
        document.getElementById('rapidaModelo').value = '';
        document.getElementById('rapidaSerial').value = '';
        document.getElementById('rapidaEstado').value = 'nuevo';
        document.getElementById('rapidaDescripcion').value = '';
        document.getElementById('rapidaFecha').value = '';
        this.parteEditando = null;
    }

    // Agregar nueva parte desde edición rápida
    agregarParteDesdeEdicionRapida() {
        const datos = {
            nombre: document.getElementById('rapidaNombre').value,
            modelo: document.getElementById('rapidaModelo').value,
            serial: document.getElementById('rapidaSerial').value,
            estado: document.getElementById('rapidaEstado').value,
            descripcion: document.getElementById('rapidaDescripcion').value
        };

        // Obtener fecha manual si se ingresó
        const fechaInput = document.getElementById('rapidaFecha').value;
        if (fechaInput) {
            datos.fechaCreacion = new Date(fechaInput).toISOString();
        }

        // Validaciones básicas
        if (!datos.nombre.trim()) {
            this.mostrarNotificacion('El nombre de la parte es requerido', 'error');
            return;
        }

        const nuevaParte = this.modeloStock.agregarParte(datos);
        if (nuevaParte) {
            this.mostrarNotificacion('Parte agregada correctamente', 'success');
            this.cargarPartes();
            this.limpiarEdicionRapida();
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Usar el sistema de notificaciones de la vista si está disponible
        if (this.vistaStock && typeof this.vistaStock.mostrarNotificacion === 'function') {
            this.vistaStock.mostrarNotificacion(mensaje, tipo);
        } else if (window.aplicacion && window.aplicacion.vistaActividades && typeof window.aplicacion.vistaActividades.mostrarNotificacion === 'function') {
            // Fallback al sistema de notificaciones de actividades
            window.aplicacion.vistaActividades.mostrarNotificacion(mensaje, tipo);
        } else {
            // Fallback final
            alert(mensaje);
        }
    }

    // Obtener estadísticas
    obtenerEstadisticas() {
        return this.modeloStock.obtenerEstadisticas();
    }
}