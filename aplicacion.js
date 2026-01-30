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
});

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
let actividadAEliminarId = null;

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
    actividadAEliminarId = id;
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModalConfirmacion() {
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.style.display = 'none';
    }
    actividadAEliminarId = null;
}

function confirmarEliminacion() {
    if (actividadAEliminarId && window.aplicacion && window.aplicacion.controlador) {
        window.aplicacion.controlador.modeloActividades.eliminarActividad(actividadAEliminarId);
        
        // Actualizar la vista
        window.aplicacion.controlador.actualizarVista();
        
        window.aplicacion.vistaActividades.mostrarNotificacion('Actividad eliminada correctamente', 'exito');
        
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
    return texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function generarPDFActividades(datos) {
    try {
        if (!datos || datos.length === 0) {
            alert('No hay actividades para exportar');
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
            capitalizarPrimeraLetra(actividad.descripcion || ''),
            capitalizarPrimeraLetra(actividad.estado || '')
        ]);
        
        // Encabezados de la tabla
        const headers = [
            'Fecha',
            'Técnico',
            'Tipo',
            'Solicitante',
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