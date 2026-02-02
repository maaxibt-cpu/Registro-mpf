// Vista para gestión de inventario/stock
class VistaStock {
    constructor() {
        this.tbody = document.getElementById('cuerpoTablaStock');
        this.ordenActual = { campo: 'fechaCreacion', direccion: 'desc' };
    }

    // Renderizar partes en la tabla
    renderizarPartes(partes) {
        this.tbody.innerHTML = '';

        // Actualizar contador de elementos
        this.actualizarContadorElementos(partes.length);

        if (partes.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="texto-vacio">
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
            <td><span class="badge-estado badge-${parte.estado}">${this.obtenerEtiquetaEstado(parte.estado)}</span></td>
            <td>${this.escapeHtml(parte.descripcion || '')}</td>
            <td>${this.formatearFecha(parte.fechaCreacion)}</td>
            <td>
                <button type="button" class="btn-editar" onclick="window.controladorStock.iniciarEdicionParte('${parte.id}')">✏️</button>
                <button type="button" class="btn-eliminar" onclick="window.controladorStock.mostrarConfirmacionEliminacion('${parte.id}')">🗑️</button>
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
            'prestado': 'Prestado',
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

    // Actualizar contador de elementos en el encabezado
    actualizarContadorElementos(cantidad) {
        const contadorElement = document.getElementById('contadorStock');
        if (contadorElement) {
            contadorElement.textContent = cantidad;
        }
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

    // Métodos para ordenamiento
    ordenarPor(campo) {
        // Cambiar dirección si es el mismo campo
        if (this.ordenActual.campo === campo) {
            this.ordenActual.direccion = this.ordenActual.direccion === 'asc' ? 'desc' : 'asc';
        } else {
            this.ordenActual.campo = campo;
            this.ordenActual.direccion = 'asc';
        }

        // Obtener partes actuales del controlador y ordenar
        if (window.controladorStock && window.controladorStock.modeloStock) {
            const partes = window.controladorStock.modeloStock.obtenerPartes();
            this.ordenarPartes(partes);
        }
    }

    ordenarPartes(partes) {
        partes.sort((a, b) => {
            let valorA = a[this.ordenActual.campo] || '';
            let valorB = b[this.ordenActual.campo] || '';

            // Convertir fechas para comparación
            if (this.ordenActual.campo === 'fechaCreacion') {
                valorA = new Date(valorA);
                valorB = new Date(valorB);
            }

            // Convertir a minúsculas para comparación case-insensitive
            if (typeof valorA === 'string') valorA = valorA.toLowerCase();
            if (typeof valorB === 'string') valorB = valorB.toLowerCase();

            if (valorA < valorB) {
                return this.ordenActual.direccion === 'asc' ? -1 : 1;
            }
            if (valorA > valorB) {
                return this.ordenActual.direccion === 'asc' ? 1 : -1;
            }
            return 0;
        });

        this.renderizarPartes(partes);
    }
}