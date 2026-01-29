// Inicializar la aplicación MVC
class App {
    constructor() {
        this.model = new ActivityModel();
        this.view = new ActivityView();
        this.controller = new ActivityController(this.model, this.view);
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new App();
});