// Vista para gestión de inventario/stock
class VistaStock {
    constructor() {
        this.tbody = document.getElementById('cuerpoTablaStock');
    }

    // Renderizar partes en la tabla
    renderizarPartes(partes) {
        this.tbody.innerHTML = '';

        if (partes.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="texto-vacio">
                        No se encontraron partes en el inventario
                    </td>
                </tr>
            `;
            return;
        }

        partes.forEach(parte => {
            const fila = this.crearFilaParte(parte);
            this.tbody.appendChild(fila);
        });
    }

    // Crear fila de tabla para una parte
    crearFilaParte(parte) {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${this.escapeHtml(parte.nombre)}</td>
            <td>${this.escapeHtml(parte.modelo)}</td>
            <td>${this.escapeHtml(parte.serial)}</td>
            <td>${parte.cantidad}</td>
            <td><span class="badge-estado badge-${parte.estado}">${this.obtenerEtiquetaEstado(parte.estado)}</span></td>
            <td>${this.escapeHtml(parte.ubicacion)}</td>
            <td>${this.formatearFecha(parte.fechaCreacion)}</td>
            <td>
                <button type="button" class="btn-editar" onclick="window.controladorStock.iniciarEdicionParte('${parte.id}')">✏️</button>
                <button type="button" class="btn-eliminar" onclick="window.controladorStock.eliminarParte('${parte.id}')">🗑️</button>
            </td>
        `;

        return tr;
    }

    // Obtener etiqueta legible para el estado
    obtenerEtiquetaEstado(estado) {
        const estados = {
            'nuevo': 'Nuevo',
            'usado': 'Usado',
            'reparado': 'Reparado',
            'dado-de-baja': 'Dado de baja'
        };
        return estados[estado] || estado;
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Mostrar/ocultar modal
    toggleModal(mostrar) {
        const modal = document.getElementById('modalStock');
        if (mostrar) {
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    }

    // Limpiar tabla
    limpiarTabla() {
        this.tbody.innerHTML = `
            <tr>
                <td colspan="7" class="texto-vacio">Cargando inventario...</td>
            </tr>
        `;
    }

    // Mostrar mensaje de error
    mostrarError(mensaje) {
        this.tbody.innerHTML = `
            <tr>
                <td colspan="8" class="texto-error">
                    ❌ ${mensaje}
                </td>
            </tr>
        `;
    }

    // Formatear fecha para mostrar
    formatearFecha(fechaISO) {
        if (!fechaISO) return '';
        
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}