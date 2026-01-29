class ActivityController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.view.bindAddActivity(this.handleAddActivity.bind(this));
        this.view.bindDeleteActivity(this.handleDeleteActivity.bind(this));
        this.view.bindFilterActivities(this.handleFilterActivities.bind(this));
        this.view.bindExportData(this.handleExportData.bind(this));
        
        // Cargar actividades iniciales
        this.updateView();
    }

    handleAddActivity(activityData) {
        try {
            const activity = this.model.createActivity(activityData);
            this.updateView();
            this.view.showNotification('Actividad registrada correctamente!', 'success');
            return activity;
        } catch (error) {
            this.view.showNotification('Error al registrar la actividad', 'error');
            console.error('Error:', error);
        }
    }

    handleDeleteActivity(id) {
        if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
            this.model.deleteActivity(id);
            this.updateView();
            this.view.showNotification('Actividad eliminada correctamente', 'success');
        }
    }

    handleFilterActivities(filters) {
        const filteredActivities = this.model.filterActivities(filters);
        this.view.renderActivities(filteredActivities);
    }

    handleExportData() {
        try {
            const data = this.model.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `actividades-tecnicas-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.view.showNotification('Datos exportados correctamente!', 'success');
        } catch (error) {
            this.view.showNotification('Error al exportar datos', 'error');
            console.error('Error:', error);
        }
    }

    updateView() {
        const activities = this.model.getAllActivities();
        this.view.renderActivities(activities);
    }
}