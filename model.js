class ActivityModel {
    constructor() {
        this.activities = this.loadActivities();
    }

    // Crear nueva actividad
    createActivity(activityData) {
        const activity = {
            id: Date.now(),
            ...activityData,
            timestamp: new Date().toISOString()
        };
        
        this.activities.unshift(activity);
        this.saveActivities();
        return activity;
    }

    // Obtener todas las actividades
    getAllActivities() {
        return this.activities;
    }

    // Eliminar actividad
    deleteActivity(id) {
        this.activities = this.activities.filter(activity => activity.id !== id);
        this.saveActivities();
        return true;
    }

    // Filtrar actividades
    filterActivities(filters = {}) {
        const { search = '', tipo = '', estado = '' } = filters;
        
        return this.activities.filter(activity => {
            const matchesSearch = 
                activity.tecnico.toLowerCase().includes(search.toLowerCase()) ||
                activity.equipo.toLowerCase().includes(search.toLowerCase()) ||
                activity.descripcion.toLowerCase().includes(search.toLowerCase());
            
            const matchesTipo = tipo ? activity.tipo === tipo : true;
            const matchesEstado = estado ? activity.estado === estado : true;

            return matchesSearch && matchesTipo && matchesEstado;
        });
    }

    // Exportar datos
    exportData() {
        return JSON.stringify(this.activities, null, 2);
    }

    // Guardar en localStorage
    saveActivities() {
        localStorage.setItem('technicalActivities', JSON.stringify(this.activities));
    }

    // Cargar desde localStorage
    loadActivities() {
        const stored = localStorage.getItem('technicalActivities');
        return stored ? JSON.parse(stored) : [];
    }

    // Utilidades de formato
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatEstado(estado) {
        const estados = {
            'completado': '✅ Completado',
            'pendiente': '⏳ Pendiente',
            'en-progreso': '🚀 En progreso'
        };
        return estados[estado] || estado;
    }

    formatTipo(tipo) {
        const tipos = {
            'mantenimiento': '🔧 Mantenimiento',
            'reparacion': '🔨 Reparación',
            'instalacion': '💻 Instalación',
            'soporte': '📞 Soporte',
            'otro': '📋 Otro'
        };
        return tipos[tipo] || tipo;
    }
}