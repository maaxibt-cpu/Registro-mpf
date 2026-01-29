class ActivityView {
    constructor() {
        this.form = document.getElementById('activityForm');
        this.activitiesList = document.getElementById('activitiesList');
        this.searchInput = document.getElementById('searchInput');
        this.filterTipo = document.getElementById('filterTipo');
        this.filterEstado = document.getElementById('filterEstado');
        
        this.setTodayDate();
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fecha').value = today;
    }

    bindAddActivity(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const activityData = {
                fecha: document.getElementById('fecha').value,
                tecnico: document.getElementById('tecnico').value.trim(),
                tipo: document.getElementById('tipo').value,
                equipo: document.getElementById('equipo').value.trim(),
                descripcion: document.getElementById('descripcion').value.trim(),
                estado: document.getElementById('estado').value
            };
            
            // Validación básica
            if (this.validateForm(activityData)) {
                handler(activityData);
                this.form.reset();
                this.setTodayDate();
            }
        });
    }

    bindDeleteActivity(handler) {
        this.activitiesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const id = parseInt(e.target.dataset.id);
                handler(id);
            }
        });
    }

    bindFilterActivities(handler) {
        const filterHandler = () => {
            const filters = {
                search: this.searchInput.value,
                tipo: this.filterTipo.value,
                estado: this.filterEstado.value
            };
            handler(filters);
        };
        
        this.searchInput.addEventListener('input', filterHandler);
        this.filterTipo.addEventListener('change', filterHandler);
        this.filterEstado.addEventListener('change', filterHandler);
    }

    bindExportData(handler) {
        const exportButton = document.createElement('button');
        exportButton.textContent = '📊 Exportar Datos';
        exportButton.className = 'export-button';
        exportButton.addEventListener('click', handler);
        
        document.body.appendChild(exportButton);
    }

    renderActivities(activities) {
        if (activities.length === 0) {
            this.activitiesList.innerHTML = `
                <div class="empty-state">
                    <div>📋</div>
                    <h3>No hay actividades registradas</h3>
                    <p>Comienza agregando tu primera actividad usando el formulario.</p>
                </div>
            `;
            return;
        }

        this.activitiesList.innerHTML = activities.map(activity => `
            <div class="activity-card">
                <div class="activity-header">
                    <div class="activity-title">${activity.equipo}</div>
                    <div class="activity-date">${this.formatDate(activity.fecha)}</div>
                </div>
                
                <div class="activity-meta">
                    <span class="status-${activity.estado}">${this.formatEstado(activity.estado)}</span>
                    <span style="background: #008399; color: white;">${this.formatTipo(activity.tipo)}</span>
                    <span style="background: #95a5a6; color: white;">👤 ${activity.tecnico}</span>
                </div>
                
                <div class="activity-description">
                    ${activity.descripcion}
                </div>
                
                <div class="activity-actions">
                    <button class="btn-delete" data-id="${activity.id}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#3498db';
        }

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animación de salida después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    validateForm(data) {
        // Validación simple - puedes expandir esto según necesites
        if (!data.fecha || !data.tecnico || !data.tipo || !data.equipo || !data.descripcion || !data.estado) {
            this.showNotification('Por favor complete todos los campos', 'error');
            return false;
        }
        return true;
    }

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