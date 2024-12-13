<template>
  <div>
    <!-- Form Container -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div 
        v-if="formVisible" 
        class="modal-container" 
        @click="handleBackgroundClick"
      >
        <!-- Modal Window -->
        <div class="modal-content" @click.stop>
          <!-- Form Header -->
          <h2 class="form-title">Créer une Nouvelle Tâche</h2>

          <!-- Form -->
          <form @submit.prevent="addTask">
            <!-- Task Name -->
            <div class="input-group">
              <label for="taskName">Nom de la tâche *</label>
              <input
                type="text"
                id="taskName"
                v-model="task.name"
                placeholder="Entrez le nom de la tâche"
              />
              <span v-if="!task.name && isSubmitted" class="error">Ce champ est obligatoire.</span>
            </div>

            <!-- Category Selection -->
            <div class="input-group">
              <label>Catégorie *</label>
              <div class="categories">
                <div
                  v-for="category in categories"
                  :key="category.name"
                  
                  :class="['category-item', { selected: task.category === category.name }, { 'disabled-category': categoryDisabled }]"
                  @click="!categoryDisabled && (task.category = category.name)"
                  :style="categoryDisabled ? { pointerEvents: 'none', opacity: 0.5 } : {}"
                  :disabled="categoryDisabled"
                >
                  <i :class="category.icon"></i> {{ category.name }}
                </div>

              </div>
              <span v-if="!task.category && isSubmitted" class="error">Veuillez choisir une catégorie.</span>
            </div>

            <!-- Date -->
            <div class="input-group">
              <label for="date">Date *</label>
              <input type="date" id="date" v-model="task.due_date" />
              <span v-if="!task.due_date && isSubmitted" class="error">Veuillez sélectionner une date.</span>
            </div>

            <!-- Time -->
            <div class="input-group">
              <label for="time">Heure (Optionnel)</label>
              <input type="time" id="time" v-model="task.due_time" />
            </div>

            <!-- Importance Level -->
            <div class="input-group">
              <label>Niveau d'importance</label>
              <div class="importance-levels">
                <div
                  v-for="level in importanceLevels"
                  :key="level.value"
                  :class="['importance-level', { selected: task.importance === level.value }]"
                  @click="selectImportance(level.value)"
                >
                  {{ level.label }}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-bar">
                <div
                  class="progress"
                  :style="{ 
                    width: task.importance === 'low' ? '33%' : 
                          task.importance === 'medium' ? '70%' : '100%', 
                    backgroundColor: getImportanceColor(task.importance) 
                  }"
                >
                  <span class="progress-label">{{ importanceLabel }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="button-group">
              <button type="button" class="btn btn-cancel" @click="resetForm">Annuler</button>
              <button type="submit" class="btn btn-add">Ajouter</button>
            </div>
          </form>
        </div>

       <!-- Popup Modal -->
        <div v-if="showPopup" class="popup-overlay">
          <div class="popup-content">
            <h3>Bravo ! 🎉</h3>
            <p>Tâche ajoutée avec succès</p>
            <p>Vous êtes en train de conquérir votre journée !</p>
            <div class="popup-actions">
              <router-link to="/dashboard" class="btn btn-secondary">Revenir au tableau de bord..</router-link>
              <router-link to="/cat" class="btn see">Voir ma tâche</router-link>
            </div>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios"; // Assurez-vous que Axios est installé et importé correctement

export default {
  data() {
    return {
      task: {
        name: "",
        category: this.$route.query.categoryName || "",
        importance: "low",
        due_date: "",
        due_time: "",
        status: this.$route.query.status || 'pas commence', 
      },
      categories: [
        { name: "Travail", icon: "fas fa-briefcase" },
        { name: "Etude", icon: "fas fa-book" },
        { name: "Maison", icon: "fas fa-home" },
        { name: "Personnel", icon: "fas fa-user" },
        { name: "Loisirs", icon: "fas fa-gamepad" },
        { name: "Autre", icon: "fas fa-exclamation-circle" },
      ],
      categoryDisabled: false,  // New property to disable category selection
      importanceLevels: [
        { value: "low", label: "Moins important" },
        { value: "medium", label: "Important" },
        { value: "high", label: "Urgent" },
      ],
      progressBarWidth: 33,
      progressBarColor: "#9b59b6",
      importanceLabel: "Moins Important",
      
      formVisible: false,
      isSubmitted: false,
      showPopup: false,
    };
  },

  

  mounted() {
    this.formVisible = true;

    // Get category from the URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('categoryName');

    if (categoryName) {
      this.category = categoryName;
      this.categoryDisabled = true; // Disable the category selection
    }
  },

  methods: {

    addTask() {
      this.isSubmitted = true;

      // Valider les champs obligatoires
      if (!this.task.name || !this.task.category || !this.task.due_date) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      // Mapper les niveaux d'importance aux valeurs backend
      const importanceMap = {
        low: "moins important",
        medium: "important",
        high: "urgent",
      };

      const formattedTask = {
        task_name: this.task.name,
        category: this.task.category,
        due_date: this.task.due_date,
        due_time: this.task.due_time || null,
        priority: importanceMap[this.task.importance],
        status: this.task.status // Ensure status is included
      };

      // Envoyer les données au backend
      axios
        .post("http://localhost:3000/api/tasks-add", formattedTask)
        .then(() => {
          this.showPopup = true; // Afficher la popup de succès
        })
        .catch((err) => {
          console.error("Erreur lors de l'ajout de la tâche:", err);
          alert("Une erreur s'est produite lors de l'ajout de la tâche.");
        });
    },

    selectImportance(level) {
      this.task.importance = level;
      const settings = {
        low: { width: 33, color: "#f1c40f", label: "Moins Important" },
        medium: { width: 70, color: "#2ecc71", label: "Important" },
        high: { width: 100, color: "#e74c3c", label: "Urgent" },
      };
      this.progressBarWidth = settings[level].width;
      this.progressBarColor = settings[level].color;
      this.importanceLabel = settings[level].label;
    },

    getImportanceColor(importance) {
      switch (importance) {
        case "low":
          return "#2ecc71";  
        case "medium":
          return "#FFA500";
        case "high":
          return "#e74c3c";
        default:
          return "#9b59b6";
      }
    },

    resetForm() {
      this.task = {
        name: "",
        category: "",
        due_date: "",
        due_time: "",
        importance: "low",
      };
      this.isSubmitted = false;
      this.$router.push('/dashboard');
    },
  },
};
</script>



<style scoped>
/* Global Styles for Dark Purple Theme */
body {
  font-family: Arial, sans-serif;
  background-color: #a878b8;
  color: #f5f5f5;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(146, 144, 148, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #877c9c;
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 900px;
  position: relative;
  box-shadow: 0 4px 10px rgba(169, 86, 177, 0.717);
  color: white;
  overflow-y: auto;
}

.sidebar-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #9b59b6;
}



h2.form-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.input-group .error {
  color: #e74c3c;
  font-size: 14px;
}

.categories {
  display: flex;
  justify-content: space-around;
}

.category-item {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.category-item:hover {
  background-color: #662a75;
}

.category-item.selected {
  background-color: #9b59b6;
}

.importance-levels {
  display: flex;
  justify-content: space-around;
}

.importance-level {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.importance-level.selected {
  background-color: #9b59b6;
}
/* Task Card Styles */
.task-list {
  margin: 50px auto; /* Centrage horizontal et marge en haut */
  padding: 20px;
  max-width: 60%;
  background-color: #a67bb2;
  border-radius: 10px;
}


.task-card {
  background-color: #57296bd9; /* Dark purple background for the card */
  color: white;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(207, 191, 208, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(252, 236, 255, 0.4);
}

.task-info {
  display: flex;
  align-items: center;
}

.task-category-icon {
  font-size: 30px;
  margin-right: 15px;
  color: #9b59b6;
}

.task-details h4 {
  font-size: 20px;
  margin: 0;
}

.task-details p {
  font-size: 14px;
  margin-top: 5px;
  color: #ccc;
}

.task-progress {
  flex-shrink: 0;
  width: 100px;
}

.progress-bar {
  background-color: #ddd;
  height: 10px;
  width: 100%;
  border-radius: 5px;
}

.progress {
  height: 100%;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  color: white;
  font-weight: bold;
}

/* Category Icons Styling */
.task-category-icon {
  color: #9b59b6;
  transition: color 0.3s ease;
}

.task-category-icon:hover {
  color: #8e44ad;
}

.task-info .category-item {
  background-color: #9b59b6;
  border-radius: 5px;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.task-info .category-item:hover {
  background-color: #8e44ad;
}

/* Progress Bar Styling */
.progress {
  background-color: #e74c3c;
  width: 50%;
  border-radius: 5px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress.low {
  background-color: #f1c40f; /* Yellow */
}

.progress.medium {
  background-color: #2ecc71; /* Green */
}

.progress.high {
  background-color: #e74c3c; /* Red */
}


.task-details h4 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.task-details p {
  color: #ccc;
}

.task-card .task-info {
  flex-grow: 1;
}


.progress-bar {
  background-color: #ddd;
  height: 10px;
  width: 100%;
  border-radius: 5px;
  margin: 10px 0;
}

.progress {
  height: 100%;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  color: white;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #e74c3c;
  color: white;
  transition: transform 0.2s ease;
}
.btn-cancel:hover{
  background-color: #ee7f72;
  transform: translateY(-3px) scale(1.05);
}
.btn-cancel:active{
  background-color: hsl(6, 78%, 9%);
  transform: translateY(-3px) scale(1.05);
}

.btn-add {
  background-color: #9b59b6;
  color: white;
  transition: transform 0.2s ease;
}

.btn-add:hover{
  background-color: #b786ca;
  transform: translateY(-3px) scale(1.05);
}
.btn-add:active{
  background-color: hsl(283, 39%, 76%);
}



.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);  
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 15px;  
  border-radius: 8px;
  text-align: center;
  width: 70%;  
  max-width: 600px;  
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);  
}
.popup-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.popup-actions .btn {
  display: inline-block;
  padding: 10px 25px;  
  border-radius: 15px;
  font-size: 16px;
  white-space: nowrap;
  width: 48%;
  box-sizing: border-box;
}

.see {
  background: #a67ab3;
  transition: transform 0.2s ease;
}

.see:hover {
  background: hsl(287, 26%, 69%);
  transform: translateY(-3px) scale(1.05);
}

.btn-secondary{
  transition: transform 0.2s ease;
}

.btn-secondary:hover{
  transform: translateY(-3px) scale(1.05);
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.5s, transform 0.3s;
}

.popup-fade-enter,
.popup-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}



</style>