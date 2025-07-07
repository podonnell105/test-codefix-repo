// Event List App JavaScript

class EventApp {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('eventForm');
        form.addEventListener('submit', (e) => this.handleAddEvent(e));
    }

    async loadEvents() {
        try {
            const response = await fetch('/api/events');
            this.events = await response.json();
            this.renderEvents();
        } catch (error) {
            console.error('Error loading events:', error);
            this.showError('Failed to load events');
        }
    }

    async handleAddEvent(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventData = {
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            description: formData.get('description')
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                const newEvent = await response.json();
                this.events.push(newEvent);
                this.renderEvents();
                e.target.reset();
                this.showSuccess('Event added successfully!');
            } else {
                this.showError('Failed to add event');
            }
        } catch (error) {
            console.error('Error adding event:', error);
            this.showError('Failed to add event');
        }
    }

    async deleteEvent(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.events = this.events.filter(event => event.id !== eventId);
                this.renderEvents();
                this.showSuccess('Event deleted successfully!');
            } else {
                this.showError('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            this.showError('Failed to delete event');
        }
    }

    renderEvents() {
        const eventsContainer = document.getElementById('eventsList');
        
        if (this.events.length === 0) {
            eventsContainer.innerHTML = '<div class="no-events">No events scheduled</div>';
            return;
        }

        // Sort events by date
        const sortedEvents = this.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        const eventsHTML = sortedEvents.map(event => `
            <div class="event-card">
                <div class="event-header">
                    <div>
                        <div class="event-title">${this.escapeHtml(event.title)}</div>
                        <div class="event-datetime">
                            📅 ${this.formatDate(event.date)} at ${this.formatTime(event.time)}
                        </div>
                    </div>
                    <button class="delete-btn" onclick="app.deleteEvent(${event.id})">
                        🗑️ Delete
                    </button>
                </div>
                ${event.description ? `<div class="event-description">${this.escapeHtml(event.description)}</div>` : ''}
            </div>
        `).join('');

        eventsContainer.innerHTML = eventsHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #27ae60;' : 'background: #e74c3c;'}
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EventApp();
}); 