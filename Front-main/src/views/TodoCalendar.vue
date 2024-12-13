<template>
  <div class="page-container">
    <main class="main-content">
      <!-- Calendrier centré -->
      <section :class="['calendar-container', darkMode ? 'dark' : 'light']">
        <div class="calendar-header">
          <button @click="prevMonth" class="nav-button">&lt;</button>
          <span class="month-label">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
          <button @click="nextMonth" class="nav-button">&gt;</button>
          <button @click="toggleDarkMode" class="dark-mode-toggle">
            {{ darkMode ? '☀️' : '🌙' }}
          </button>
        </div>

        <div class="calendar-grid">
          <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
          <div
            class="day"
            v-for="day in daysInMonth"
            :key="day.date"
            :class="{
              'is-today': day.isToday,
              'is-empty': !day.date,
              'has-task': day.date && hasTasks(day.date),
            }"
            @click="day.date && openModal(day.date)"
          >
            {{ day.day }}
            <div v-if="hasTasks(day.date)" class="task-indicator"></div>
          </div>
        </div>

        <!-- Fenêtre modale -->
        <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <h2>Tâches pour le {{ formatSelectedDate(selectedDate) }}</h2>
            <ul v-if="tasks.length > 0">
              <li v-for="(task, index) in tasks" :key="index">📌 {{ task }}</li>
            </ul>
            <p v-else>Aucune tâche pour cette date.</p>
            <button @click="goToAddView" class="add-task-button">Ajouter une Tâche</button>
            <button @click="closeModal" class="close-modal-button">Fermer</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      selectedDate: null,
      tasks: [],
      modalVisible: false, // État pour la fenêtre modale
      darkMode: false,
      allTasks: {
        "2024-12-02": ["Préparer la réunion", "Réviser le projet"],
        "2024-12-03": ["Faire du sport"],
      },
      dayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      notifications: [
        { id: 1, message: "Nouvelle tâche assignée : Projet Alpha" },
        { id: 2, message: "Échéance proche pour : Rapport financier" },
        { id: 3, message: "Réunion planifiée demain à 10h00" },
      ],
    };
  },
  computed: {
    monthNames() {
      return [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
      ];
    },
    daysInMonth() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Ajouter des jours vides pour aligner le premier jour du mois
      for (let i = 0; i < firstDay; i++) {
        days.push({ day: "", date: null });
      }

      // Ajouter les jours réels du mois
      for (let i = 1; i <= lastDate; i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          day: i,
          date: this.formatDate(date),
          isToday: this.isToday(date),
        });
      }

      return days;
    },
    totalTasks() {
      return Object.values(this.allTasks).reduce((total, tasks) => total + tasks.length, 0);
    },
    tasksToday() {
      const today = this.formatDate(new Date());
      return this.allTasks[today]?.length || 0;
    },
  },
  methods: {
    isToday(date) {
      const today = new Date();
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatSelectedDate(date) {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    openModal(date) {
      if (!date) return;
      this.selectedDate = date;
      this.loadTasksForDate(date);
      this.modalVisible = true;
    },
    loadTasksForDate(date) {
      this.tasks = this.allTasks[date] || [];
    },
    closeModal() {
      this.modalVisible = false;
    },
    goToAddView() {
      if (this.selectedDate) {
        this.$router.push({
          name: "AddView",
          query: { date: this.selectedDate },
        });
      } else {
        alert("Veuillez sélectionner une date avant d'ajouter une tâche !");
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    hasTasks(date) {
      return this.allTasks[date] && this.allTasks[date].length > 0;
    },
    handleNotificationClick(notification) {
      alert(`Détail de la notification : ${notification.message}`);
      this.notifications = this.notifications.filter(
        (n) => n.id !== notification.id
      );
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(145deg, #6a11cb, #9499a0);
  color: white;
  font-family: 'Poppins', sans-serif;
}

.calendar-container {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 80vw;
  max-width: 1200px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-label {
  font-size: 2rem;
  font-weight: bold;
  color: #6a11cb;
}

.nav-button {
  background: none;
  border: 2px solid #6a11cb;
  color: #6a11cb;
  border-radius: 50%;
  padding: 15px;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #6a11cb;
  color: white;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.day {
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  background: rgba(106, 17, 203, 0.1);
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, background 0.3s;
  font-size: 1.5rem;
}
@media (max-width: 768px) {
  .calendar-grid {
    gap: 10px; /* Réduction de l'espace entre les jours */
  }

  .day {
    padding: 10px; /* Réduction du padding sur les petits écrans */
    font-size: 1rem; /* Taille de police adaptée pour petits écrans */
  }
}

@media (max-width: 480px) {
  .day {
    padding: 8px; /* Réduction maximale pour les très petits écrans */
    font-size: 0.9rem;
  }
}
.day:hover {
  transform: scale(1.1);
  background: rgba(106, 17, 203, 0.3);
}

.is-today {
  border: 2px solid #2575fc;
  font-weight: bold;
}

.has-task .task-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #ff4081;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: rgb(139, 71, 165);
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0 5px 15px rgba(185, 179, 221, 0.918);
}

.add-task-button,
.close-modal-button {
  background: #462a65;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  font-size: 1.1rem;
}

.add-task-button:hover,
.close-modal-button:hover {
  background: #542f5f;
}

.dark-mode-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.dark-mode .calendar-container {
  background: rgba(0, 0, 0, 0.9);
  color: white;
}
/* Mode clair */
.light .calendar-container {
  background: rgba(255, 255, 255, 0.9); /* Couleur de fond claire pour le mode clair */
  color: #bbafaf; /* Texte foncé pour le mode clair */
}

.light .nav-button {
  border: 2px solid #6a11cb;
  color: #6a11cb;
}

.light .day {
  background: rgba(177, 174, 180, 0.826);
}

.light .task-indicator {
  background: #ff4081;
}

/* Mode sombre */
.dark .calendar-container {
  background: rgba(0, 0, 0, 0.9); /* Couleur de fond sombre pour le mode sombre */
  color: white;
}

.dark .nav-button {
  border: 2px solid #2575fc;
  color: #2575fc;
}

.dark .day {
  background: rgba(195, 169, 169, 0.1);
}

.dark .task-indicator {
  background: #ff4081;
}

</style>
