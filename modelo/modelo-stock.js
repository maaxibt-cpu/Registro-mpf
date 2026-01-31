// Modelo para gestión de inventario/stock
class ModeloStock {
    constructor() {
        this.partes = JSON.parse(localStorage.getItem('inventarioPartes')) || [];
    }

    // Obtener todas las partes
    obtenerPartes() {
        return this.partes;
    }

    // Agregar una nueva parte
    agregarParte(parte) {
        const nuevaParte = {
            id: Date.now().toString(),
            nombre: parte.nombre,
            modelo: parte.modelo || '',
            serial: parte.serial || '',
            cantidad: parseInt(parte.cantidad) || 1,
            estado: parte.estado,
            ubicacion: parte.ubicacion || '',
            observaciones: parte.observaciones || '',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        this.partes.push(nuevaParte);
        this.guardarEnLocalStorage();
        return nuevaParte;
    }

    // Actualizar una parte existente
    actualizarParte(id, datos) {
        const index = this.partes.findIndex(parte => parte.id === id);
        if (index !== -1) {
            this.partes[index] = {
                ...this.partes[index],
                ...datos,
                fechaActualizacion: new Date().toISOString()
            };
            this.guardarEnLocalStorage();
            return this.partes[index];
        }
        return null;
    }

    // Eliminar una parte
    eliminarParte(id) {
        const index = this.partes.findIndex(parte => parte.id === id);
        if (index !== -1) {
            this.partes.splice(index, 1);
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    }

    // Buscar partes por texto
    buscarPartes(texto) {
        const textoBusqueda = texto.toLowerCase();
        return this.partes.filter(parte => 
            parte.nombre.toLowerCase().includes(textoBusqueda) ||
            parte.modelo.toLowerCase().includes(textoBusqueda) ||
            parte.serial.toLowerCase().includes(textoBusqueda) ||
            parte.ubicacion.toLowerCase().includes(textoBusqueda)
        );
    }

    // Filtrar partes por estado
    filtrarPorEstado(estado) {
        if (!estado) return this.partes;
        return this.partes.filter(parte => parte.estado === estado);
    }

    // Obtener parte por ID
    obtenerPartePorId(id) {
        return this.partes.find(parte => parte.id === id);
    }

    // Guardar en localStorage
    guardarEnLocalStorage() {
        localStorage.setItem('inventarioPartes', JSON.stringify(this.partes));
    }

    // Obtener estadísticas del inventario
    obtenerEstadisticas() {
        const total = this.partes.length;
        const porEstado = {};
        
        this.partes.forEach(parte => {
            porEstado[parte.estado] = (porEstado[parte.estado] || 0) + 1;
        });

        return {
            total,
            porEstado
        };
    }
}