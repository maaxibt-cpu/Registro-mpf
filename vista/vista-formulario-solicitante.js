class VistaFormularioSolicitante {
    constructor() {
        this.modal = document.getElementById('modalPersonas');
        this.formularioPersona = document.getElementById('formularioPersona');
        this.btnCancelarModal = document.getElementById('btnCancelarModal');
    }

    // Mostrar/ocultar modal
    toggleModal(mostrar = true) {
        if (mostrar) {
            this.modal.style.display = 'block';
            // Asegurar que el modal esté en primer plano
            this.modal.style.zIndex = '1000';
        } else {
            this.modal.style.display = 'none';
            // Limpiar formulario cuando se cierra el modal
            this.formularioPersona.reset();
            // Forzar repintado para asegurar que desaparezca completamente
            this.modal.offsetHeight;
        }
    }

    // Enlazar eventos
    enlazarEventos(manejadores) {
        // Botón para abrir modal
        document.getElementById('abrirModalPersonas').addEventListener('click', () => {
            this.toggleModal(true);
        });

        // Formulario para nueva persona
        this.formularioPersona.addEventListener('submit', (e) => {
            e.preventDefault();
            manejadores.agregarPersona({
                nombre: document.getElementById('nuevaPersonaNombre').value.trim(),
                apellido: document.getElementById('nuevaPersonaApellido').value.trim(),
                circunscripcion: document.getElementById('nuevaPersonaCircunscripcion').value.trim(),
                cargo: document.getElementById('nuevaPersonaCargo').value.trim()
            });
            this.formularioPersona.reset();
            this.toggleModal(false); // Cerrar modal después de agregar
        });

        // Cerrar modal con el botón Cancelar
        this.btnCancelarModal.addEventListener('click', () => {
            this.toggleModal(false);
        });

        // Cerrar modal al hacer click fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.toggleModal(false);
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.toggleModal(false);
            }
        });
    }
}