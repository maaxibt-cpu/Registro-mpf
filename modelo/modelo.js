class ModeloActividades {
    constructor() {
        this.actividades = this.cargarActividades();
    }

    // Crear nueva actividad
    crearActividad(datosActividad) {
        const actividad = {
            id: Date.now(),
            ...datosActividad,
            timestamp: new Date().toISOString()
        };
        
        this.actividades.unshift(actividad);
        this.guardarActividades();
        return actividad;
    }

    // Obtener todas las actividades
    obtenerTodasActividades() {
        return this.actividades;
    }

    // Eliminar actividad
    eliminarActividad(id) {
        this.actividades = this.actividades.filter(actividad => actividad.id !== id);
        this.guardarActividades();
        return true;
    }

    // Filtrar actividades
    filtrarActividades(filtros = {}) {
        const { search = '', tipo = '', estado = '' } = filtros;
        
        return this.actividades.filter(actividad => {
            const coincideBusqueda = 
                actividad.tecnico.toLowerCase().includes(search.toLowerCase()) ||
                actividad.nombre.toLowerCase().includes(search.toLowerCase()) ||
                actividad.apellido.toLowerCase().includes(search.toLowerCase()) ||
                actividad.circunscripcion.toLowerCase().includes(search.toLowerCase()) ||
                actividad.cargo.toLowerCase().includes(search.toLowerCase()) ||
                actividad.descripcion.toLowerCase().includes(search.toLowerCase());
            
            const coincideTipo = tipo ? actividad.tipo === tipo : true;
            const coincideEstado = estado ? actividad.estado === estado : true;

            return coincideBusqueda && coincideTipo && coincideEstado;
        });
    }

    // Exportar datos
    exportarDatos() {
        return JSON.stringify(this.actividades, null, 2);
    }

    // Cargar actividades desde localStorage
    cargarActividades() {
        const actividadesGuardadas = localStorage.getItem('actividadesTecnicas');
        return actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
    }

    // Guardar actividades en localStorage
    guardarActividades() {
        localStorage.setItem('actividadesTecnicas', JSON.stringify(this.actividades));
    }
}