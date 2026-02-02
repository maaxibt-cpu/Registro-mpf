// Inicializar la aplicación MVC
class Aplicacion {
    constructor() {
        this.modeloActividades = new ModeloActividades();
        this.modeloPersonas = new ModeloPersonas();
        this.vistaActividades = new VistaActividades();
        this.vistaFormularioSolicitante = new VistaFormularioSolicitante();
        
        this.controlador = new ControladorActividades(
            this.modeloActividades, 
            this.vistaActividades,
            this.modeloPersonas,
            this.vistaFormularioSolicitante
        );
        
        // Inicializar vista de formulario de solicitante
        this.vistaFormularioSolicitante.enlazarEventos({
            agregarPersona: (datos) => this.controlador.agregarPersona(datos)
        });
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aplicacion = new Aplicacion();
    window.vistaPersonas = aplicacion.vistaPersonas;
    window.vistaActividades = aplicacion.vistaActividades;
    
    // Inicializar el controlador y hacer disponibles las funciones globales
    if (window.aplicacion.controlador) {
        window.iniciarEdicionSolicitanteGlobal = window.aplicacion.controlador.iniciarEdicionSolicitanteGlobal.bind(window.aplicacion.controlador);
        window.guardarEdicionSolicitanteGlobal = window.aplicacion.controlador.guardarEdicionSolicitanteGlobal.bind(window.aplicacion.controlador);
        window.cancelarEdicionSolicitanteGlobal = window.aplicacion.controlador.cancelarEdicionSolicitanteGlobal.bind(window.aplicacion.controlador);
        
        // Funciones globales para edición de actividades
        window.iniciarEdicionActividadGlobal = window.aplicacion.controlador.iniciarEdicionActividadGlobal.bind(window.aplicacion.controlador);
        window.guardarEdicionActividadGlobal = window.aplicacion.controlador.guardarEdicionActividadGlobal.bind(window.aplicacion.controlador);
        window.cancelarEdicionActividadGlobal = window.aplicacion.controlador.cancelarEdicionActividadGlobal.bind(window.aplicacion.controlador);
        
        console.log('Funciones globales de edición disponibles');
    }
    
    // Inicializar auto-expansión para textareas de descripción
    inicializarAutoExpansionTextareas();
});

// Función para auto-expandir textareas según el contenido
function inicializarAutoExpansionTextareas() {
    const textareas = document.querySelectorAll('textarea[placeholder*="actividad realizada"]');
    
    textareas.forEach(textarea => {
        // Configurar altura mínima
        textarea.style.minHeight = '100px';
        textarea.style.overflowY = 'hidden';
        
        // Función de auto-expansión
        const autoExpand = (e) => {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto';
            // Set the height to scrollHeight
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        // Event listeners
        textarea.addEventListener('input', autoExpand);
        textarea.addEventListener('keydown', autoExpand);
        textarea.addEventListener('keyup', autoExpand);
        
        // Expandir inicialmente si ya tiene contenido
        if (textarea.value) {
            autoExpand();
        }
    });
}

// Funciones globales para el modal de búsqueda de solicitantes
function cerrarModalBusqueda() {
    const modal = document.getElementById('modalBusquedaSolicitantes');
    if (modal) {
        modal.style.display = 'none';
    }
}

function seleccionarSolicitante(id) {
    if (window.aplicacion && window.aplicacion.controlador) {
        const persona = window.aplicacion.controlador.modeloPersonas.obtenerPersonaPorId(id);
        if (persona) {
            window.aplicacion.controlador.seleccionarPersona(persona);
            cerrarModalBusqueda();
        }
    }
}



// Variables globales para el modal de confirmación
let elementoAEliminarId = null;
let tipoElementoAEliminar = ''; // 'actividad' o 'solicitante'

// Funciones globales para el modal de edición de actividades
function mostrarModalEdicionActividad() {
    const modal = document.getElementById('modalEdicionActividad');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModalEdicionActividad() {
    const modal = document.getElementById('modalEdicionActividad');
    if (modal) {
        modal.style.display = 'none';
        // Limpiar formulario al cerrar
        document.getElementById('formEdicionActividad').reset();
    }
}

// Cerrar modal al hacer clic fuera del contenido
const modalEdicionActividad = document.getElementById('modalEdicionActividad');
if (modalEdicionActividad) {
    modalEdicionActividad.addEventListener('click', (e) => {
        if (e.target === modalEdicionActividad) {
            cerrarModalEdicionActividad();
        }
    });
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('modalEdicionActividad');
        if (modal && modal.style.display === 'block') {
            cerrarModalEdicionActividad();
        }
    }
});

// Manejar envío del formulario de edición
const formEdicionActividad = document.getElementById('formEdicionActividad');
if (formEdicionActividad) {
    formEdicionActividad.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const actividadId = document.getElementById('edicionActividadId').value;
        if (actividadId && window.guardarEdicionActividadGlobal) {
            window.guardarEdicionActividadGlobal(actividadId);
        }
    });
}

function mostrarModalConfirmacionActividad(id) {
    elementoAEliminarId = id;
    tipoElementoAEliminar = 'actividad';
    
    const modal = document.getElementById('modalConfirmacion');
    const titulo = document.getElementById('modalConfirmacionTitulo');
    const mensaje = document.getElementById('modalConfirmacionMensaje');
    
    if (modal && titulo && mensaje) {
        titulo.textContent = '⚠️ Confirmar Eliminación de Actividad';
        mensaje.textContent = '¿Está seguro de que desea eliminar esta actividad?';
        modal.style.display = 'flex';
    }
}

function mostrarModalConfirmacionSolicitante(id) {
    elementoAEliminarId = id;
    tipoElementoAEliminar = 'solicitante';
    
    const modal = document.getElementById('modalConfirmacion');
    const titulo = document.getElementById('modalConfirmacionTitulo');
    const mensaje = document.getElementById('modalConfirmacionMensaje');
    
    if (modal && titulo && mensaje) {
        titulo.textContent = '⚠️ Confirmar Eliminación de Solicitante';
        mensaje.textContent = '¿Está seguro de que desea eliminar este solicitante?';
        modal.style.display = 'flex';
    }
}

function mostrarModalConfirmacionParte(id) {
    elementoAEliminarId = id;
    tipoElementoAEliminar = 'parte';
    
    const modal = document.getElementById('modalConfirmacion');
    const titulo = document.getElementById('modalConfirmacionTitulo');
    const mensaje = document.getElementById('modalConfirmacionMensaje');
    
    if (modal && titulo && mensaje) {
        titulo.textContent = '⚠️ Confirmar Eliminación de Parte';
        mensaje.textContent = '¿Está seguro de que desea eliminar esta parte del inventario?';
        modal.style.display = 'flex';
    }
}

function cerrarModalConfirmacion() {
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.style.display = 'none';
    }
    elementoAEliminarId = null;
    tipoElementoAEliminar = '';
}

function confirmarEliminacion() {
    if (elementoAEliminarId && window.aplicacion && window.aplicacion.controlador) {
        
        if (tipoElementoAEliminar === 'actividad') {
            // Eliminar actividad
            window.aplicacion.controlador.modeloActividades.eliminarActividad(elementoAEliminarId);
            
            // Actualizar la vista
            window.aplicacion.controlador.actualizarVista();
            
            window.aplicacion.vistaActividades.mostrarNotificacion('Actividad eliminada correctamente', 'exito');
            
        } else if (tipoElementoAEliminar === 'solicitante') {
            // Eliminar solicitante
            window.aplicacion.controlador.modeloPersonas.eliminarPersona(elementoAEliminarId);
            
            // Actualizar vista de actividades
            window.aplicacion.controlador.actualizarVista();
            
            // Actualizar vista de gestor de solicitantes si existe
            if (window.gestorSolicitantes) {
                window.gestorSolicitantes.cargarSolicitantes();
            }
            
            window.aplicacion.vistaActividades.mostrarNotificacion('Solicitante eliminado correctamente', 'exito');
            
        } else if (tipoElementoAEliminar === 'parte') {
            // Eliminar parte del inventario
            if (window.controladorStock) {
                window.controladorStock.eliminarParte(elementoAEliminarId);
            } else {
                console.error('Controlador de stock no disponible');
            }
        }
        
        cerrarModalConfirmacion();
    }
}

// Función para inicializar el autocompletado de solicitantes
function inicializarAutocompletadoSolicitantes() {
    const inputSolicitante = document.getElementById('solicitante');
    const inputSolicitanteId = document.getElementById('solicitanteId');
    const contenedorSugerencias = document.getElementById('sugerenciasSolicitante');
    
    if (!inputSolicitante || !contenedorSugerencias) return;
    
    // Evento para mostrar sugerencias al escribir
    inputSolicitante.addEventListener('input', function(e) {
        const texto = e.target.value.trim();
        
        if (texto.length < 2) {
            contenedorSugerencias.style.display = 'none';
            return;
        }
        
        mostrarSugerenciasSolicitantes(texto);
    });
    
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!contenedorSugerencias.contains(e.target) && e.target !== inputSolicitante) {
            contenedorSugerencias.style.display = 'none';
        }
    });
    
    // Prevenir que el formulario se envíe al presionar Enter en las sugerencias
    inputSolicitante.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && contenedorSugerencias.style.display === 'block') {
            e.preventDefault();
        }
    });
}

// Función para mostrar sugerencias de solicitantes
function mostrarSugerenciasSolicitantes(textoBusqueda) {
    const contenedorSugerencias = document.getElementById('sugerenciasSolicitante');
    const inputSolicitante = document.getElementById('solicitante');
    const inputSolicitanteId = document.getElementById('solicitanteId');
    
    if (!window.aplicacion || !window.aplicacion.controlador) {
        contenedorSugerencias.style.display = 'none';
        return;
    }
    
    // Obtener todos los solicitantes
    const personas = window.aplicacion.controlador.modeloPersonas.obtenerTodasPersonas();
    
    // Filtrar solicitantes que coincidan con el texto
    const sugerencias = personas.filter(persona => 
        persona.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        persona.apellido.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        `${persona.nombre} ${persona.apellido}`.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    
    if (sugerencias.length === 0) {
        contenedorSugerencias.style.display = 'none';
        return;
    }
    
    // Crear HTML de las sugerencias
    const htmlSugerencias = sugerencias.map(persona => `
        <div class="sugerencia-item" data-id="${persona.id}" 
             onclick="seleccionarSolicitanteAutocompletado(${persona.id}, '${persona.nombre} ${persona.apellido}')">
            ${persona.nombre} ${persona.apellido} - ${persona.cargo} (${persona.circunscripcion})
        </div>
    `).join('');
    
    contenedorSugerencias.innerHTML = htmlSugerencias;
    contenedorSugerencias.style.display = 'block';
}

// Función para seleccionar un solicitante del autocompletado
function seleccionarSolicitanteAutocompletado(id, nombreCompleto) {
    const inputSolicitante = document.getElementById('solicitante');
    const inputSolicitanteId = document.getElementById('solicitanteId');
    const contenedorSugerencias = document.getElementById('sugerenciasSolicitante');
    
    if (inputSolicitante && inputSolicitanteId) {
        inputSolicitante.value = nombreCompleto;
        inputSolicitanteId.value = id;
    }
    
    contenedorSugerencias.style.display = 'none';
}

// Función para generar PDF de actividades
function capitalizarPrimeraLetra(texto) {
    if (!texto || typeof texto !== 'string') return texto;
    
    // Lista de palabras que deben conservar su capitalización correcta
    const palabrasEspeciales = {
        'circunscripción': 'Circunscripción',
        'primera circunscripción capital': 'Primera Circunscripción Capital',
        'segunda circunscripción chilecito': 'Segunda Circunscripción Chilecito',
        'tercera circunscripción chamical': 'Tercera Circunscripción Chamical',
        'cuarta circunscripción aimogasta': 'Cuarta Circunscripción Aimogasta',
        'quinta circunscripción chepes': 'Quinta Circunscripción Chepes',
        'sexta circunscripción villa unión': 'Sexta Circunscripción Villa Unión'
    };
    
    // Convertir a minúsculas para comparación
    const textoLower = texto.toLowerCase();
    
    // Verificar si el texto coincide con alguna palabra especial
    for (const [key, value] of Object.entries(palabrasEspeciales)) {
        if (textoLower === key) {
            return value;
        }
    }
    
    // Capitalización normal para otras palabras
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function generarPDFActividades(datos) {
    try {
        if (!datos || datos.length === 0) {
            // Mostrar notificación en lugar de modal
            if (window.aplicacion && window.aplicacion.vistaActividades) {
                window.aplicacion.vistaActividades.mostrarNotificacion('No hay actividades para exportar', 'info');
            } else {
                // Fallback si no está disponible el sistema de notificaciones
                alert('No hay actividades para exportar');
            }
            return;
        }
        
        // Usar jsPDF desde el objeto global (window.jsPDF)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Título del documento
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('REGISTRO DE ACTIVIDADES TÉCNICAS', 105, 20, { align: 'center' });
        
        // Fecha de generación
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const fecha = new Date().toLocaleString('es-ES');
        doc.text(`Generado el: ${fecha}`, 105, 30, { align: 'center' });
        
        // Preparar datos para la tabla con capitalización
        const tableData = datos.map(actividad => [
            actividad.fecha ? new Date(actividad.fecha).toLocaleDateString('es-ES') : '',
            capitalizarPrimeraLetra(actividad.tecnico || ''),
            capitalizarPrimeraLetra(actividad.tipo || ''),
            capitalizarPrimeraLetra(`${actividad.nombre || ''} ${actividad.apellido || ''}`.trim()),
            capitalizarPrimeraLetra(actividad.circunscripcion || 'N/A'),
            capitalizarPrimeraLetra(actividad.descripcion || ''),
            capitalizarPrimeraLetra(actividad.estado || '')
        ]);
        
        // Encabezados de la tabla
        const headers = [
            'Fecha',
            'Técnico',
            'Tipo de Problema',
            'Solicitante',
            'Circunscripción',
            'Descripción',
            'Estado'
        ];
        
        // Generar tabla con todo centrado
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 40 }
        });
        
        // Total de actividades
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text(`Total de actividades: ${datos.length}`, 14, finalY);
        
        // Abrir PDF en nueva ventana
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        // Limpiar URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
        
        // Mostrar notificación de éxito
        if (window.aplicacion && window.aplicacion.vistaActividades) {
            window.aplicacion.vistaActividades.mostrarNotificacion('PDF generado correctamente', 'success');
        }
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Verifique la consola para más detalles.');
    }
}

// Inicializar autocompletado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarAutocompletadoSolicitantes();
    
    // Event listeners para el modal de confirmación
    const modalConfirmacion = document.getElementById('modalConfirmacion');
    if (modalConfirmacion) {
        // Cerrar modal al hacer clic fuera del contenido
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === modalConfirmacion) {
                cerrarModalConfirmacion();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalConfirmacion.style.display === 'flex') {
                cerrarModalConfirmacion();
            }
        });
    }
});

// Funciones globales para el modal de stock
function abrirModalStock() {
    const modal = document.getElementById('modalStock');
    if (modal) {
        modal.style.display = 'block';
        // Inicializar controlador de stock si no existe
        if (!window.controladorStock) {
            inicializarControladorStock();
        }
        // Cargar partes al abrir el modal
        if (window.controladorStock) {
            window.controladorStock.cargarPartes();
        }
    }
}

function cerrarModalStock() {
    const modal = document.getElementById('modalStock');
    if (modal) {
        modal.style.display = 'none';
    }
}

function limpiarFormStock() {
    if (window.controladorStock) {
        window.controladorStock.limpiarFormulario();
    }
}

function inicializarControladorStock() {
    // Verificar si los componentes de stock están disponibles
    if (typeof ModeloStock === 'undefined' || typeof VistaStock === 'undefined' || typeof ControladorStock === 'undefined') {
        console.error('Componentes de stock no disponibles');
        return false;
    }
    
    try {
        const modeloStock = new ModeloStock();
        const vistaStock = new VistaStock();
        window.controladorStock = new ControladorStock(modeloStock, vistaStock);
        window.vistaStock = vistaStock; // Hacer disponible globalmente
        console.log('Controlador de stock inicializado correctamente');
        return true;
    } catch (error) {
        console.error('Error al inicializar controlador de stock:', error);
        return false;
    }
}

// Función de depuración para verificar el estado del controlador
window.verificarEstadoStock = function() {
    console.group('🔍 Depuración - Estado del Controlador de Stock');
    console.log('Controlador disponible:', !!window.controladorStock);
    
    if (window.controladorStock) {
        console.log('Modelo disponible:', !!window.controladorStock.modeloStock);
        console.log('Vista disponible:', !!window.controladorStock.vistaStock);
        
        // Verificar funciones
        console.log('Función iniciarEdicionParte disponible:', typeof window.controladorStock.iniciarEdicionParte === 'function');
        console.log('Función eliminarParte disponible:', typeof window.controladorStock.eliminarParte === 'function');
        
        // Verificar datos
        if (window.controladorStock.modeloStock) {
            const partes = window.controladorStock.modeloStock.obtenerPartes();
            console.log('Número de partes en inventario:', partes.length);
            if (partes.length > 0) {
                console.log('Primera parte:', partes[0]);
            }
        }
    } else {
        console.log('⚠️ Controlador no inicializado. Ejecuta: inicializarControladorStock()');
    }
    console.groupEnd();
};

// Función para probar edición manual
window.probarEdicionStock = function(id) {
    if (!window.controladorStock) {
        console.error('Controlador no disponible');
        return;
    }
    
    console.log('🔧 Probando edición de parte con ID:', id);
    window.controladorStock.iniciarEdicionParte(id);
    console.log('✅ Función ejecutada');
};

// Función para probar eliminación manual  
window.probarEliminacionStock = function(id) {
    if (!window.controladorStock) {
        console.error('Controlador no disponible');
        return;
    }
    
    console.log('🗑️ Probando eliminación de parte con ID:', id);
    window.controladorStock.eliminarParte(id);
    console.log('✅ Función ejecutada');
};

// Cerrar modal de stock al hacer clic fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
    const modalStock = document.getElementById('modalStock');
    if (modalStock) {
        modalStock.addEventListener('click', (e) => {
            if (e.target === modalStock) {
                cerrarModalStock();
            }
        });
    }
    
    // Cerrar modal de stock con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modalStock');
            if (modal && modal.style.display === 'block') {
                cerrarModalStock();
            }
        }
    });

    // Función para verificar datos guardados (solo para testing)
    window.verificarStock = function() {
        const datos = JSON.parse(localStorage.getItem('inventarioPartes')) || [];
        console.log('📊 Datos en localStorage:', datos);
        alert('Partes en inventario: ' + datos.length + '\nÚltima parte: ' + (datos.length > 0 ? datos[datos.length-1].nombre : 'Ninguna'));
        return datos;
    };

    // Función para guardar edición rápida
    window.guardarEdicionRapida = function() {
        if (!window.controladorStock) {
            alert('Controlador de stock no disponible');
            return;
        }

        const nombre = document.getElementById('rapidaNombre').value.trim();
        if (!nombre) {
            alert('El nombre es obligatorio');
            return;
        }

        const datos = {
            nombre: nombre,
            modelo: document.getElementById('rapidaModelo').value.trim(),
            serial: document.getElementById('rapidaSerial').value.trim(),
            estado: document.getElementById('rapidaEstado').value,
            descripcion: document.getElementById('rapidaDescripcion').value.trim(),
            ubicacion: '',
            observaciones: ''
        };

        // Obtener fecha manual si se ingresó
        const fechaInput = document.getElementById('rapidaFecha').value;
        if (fechaInput) {
            datos.fechaCreacion = new Date(fechaInput).toISOString();
        }

        // Usar el controlador existente para guardar
        const nuevaParte = window.controladorStock.modeloStock.agregarParte(datos);
        if (nuevaParte) {
            window.controladorStock.mostrarNotificacion('Componente agregado correctamente', 'success');
            window.controladorStock.cargarPartes();
            
            // Limpiar campos
            document.getElementById('rapidaNombre').value = '';
            document.getElementById('rapidaModelo').value = '';
            document.getElementById('rapidaSerial').value = '';
            document.getElementById('rapidaEstado').value = 'nuevo';
            document.getElementById('rapidaDescripcion').value = '';
            document.getElementById('rapidaFecha').value = '';
        }
    };

    // Función para cancelar edición rápida y limpiar campos
    window.cancelarEdicionRapida = function() {
        document.getElementById('rapidaNombre').value = '';
        document.getElementById('rapidaModelo').value = '';
        document.getElementById('rapidaSerial').value = '';
        document.getElementById('rapidaEstado').value = 'nuevo';
        document.getElementById('rapidaDescripcion').value = '';
        document.getElementById('rapidaFecha').value = '';
    };
});

