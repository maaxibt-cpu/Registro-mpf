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

    // Iniciar edición de parte - FUNCIÓN DESHABILITADA PORQUE EL FORMULARIO FUE ELIMINADO
    /* iniciarEdicionParte(id) {
        const parte = this.modeloStock.obtenerPartePorId(id);
        if (parte) {
            this.parteEditando = parte;
            
            // Llenar formulario con datos de la parte
            document.getElementById('parteId').value = parte.id;
            document.getElementById('nombreParte').value = parte.nombre;
            document.getElementById('modelo').value = parte.modelo;
            document.getElementById('serial').value = parte.serial;
            document.getElementById('cantidad').value = parte.cantidad;
            document.getElementById('estado').value = parte.estado;
            document.getElementById('ubicacion').value = parte.ubicacion;
            document.getElementById('observaciones').value = parte.observaciones;

            // Cambiar texto del botón
            document.querySelector('button[type="submit"]').textContent = 'Actualizar Parte';
        }
    } */

    // Eliminar parte
    eliminarParte(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta parte del inventario?')) {
            const eliminado = this.modeloStock.eliminarParte(id);
            if (eliminado) {
                this.mostrarNotificacion('Parte eliminada correctamente', 'success');
                this.cargarPartes();
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

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo) {
        // Usar el sistema de notificaciones existente si está disponible
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(mensaje, tipo);
        } else {
            alert(mensaje);
        }
    }

    // Obtener estadísticas
    obtenerEstadisticas() {
        return this.modeloStock.obtenerEstadisticas();
    }
}