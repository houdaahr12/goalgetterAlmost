<template>
  <div class="edit-popup" @click.self="closePopup">
    <div class="popup-content">
      <h3>Modifier la tâche</h3>
      <form @submit.prevent="submitEdit">
        <!-- Task Name -->
        <div class="form-group">
          <label for="task-name">Nom de la tâche</label>
          <input
            id="task-name"
            type="text"
            class="form-control"
            v-model="taskToEdit.task_name"
            placeholder="Nom de la tâche"
            required
          />
        </div>

        <!-- Category -->
        <div class="form-group">
          <label for="task-category">Catégorie</label>
          <select
            id="task-category"
            class="form-control"
            v-model="taskToEdit.category"
        
          >
            <option value="" disabled>Choisissez une catégorie</option>
            <option value="Travail">Travail</option>
            <option value="Etude">Etude</option>
            <option value="Maison"> Maison</option>
            <option value="Personnel">Personnel</option>
            <option value="Loisirs">Loisirs</option>
            <option value="Autres">Autres</option>
          </select>
        </div>

        <!-- Priority -->
        <div class="form-group">
          <label for="task-priority">Priorité</label>
          <select
            id="task-priority"
            class="form-control"
            v-model="taskToEdit.priority"
          >
            <option value="" disabled>Choisissez une priorité</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="Moins important">Moins important</option>
          </select>
        </div>

        <!-- Due Date -->
        <div class="form-group">
          <label for="task-date">Date</label>
          <input
            id="task-date"
            type="date"
            class="form-control"
            v-model="taskToEdit.due_date"
        
         
          />
        </div>

        <!-- Time -->
        <div class="form-group">
          <label for="task-time">Heure</label>
          <input
            id="task-time"
            type="time"
            class="form-control"
            v-model="taskToEdit.due_time"
          />
        </div>

        <!-- Buttons -->
        <div class="form-buttons">
          <button type="button" class="btn btn-secondary" @click="closePopup">
            Annuler
          </button>
          <button type="submit" class="btn enreg">Enregistrer</button>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EditTask",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      taskToEdit: {
      due_date: this.formatDate(new Date()),  // Default to current date if not set
      due_time: '',
      ...this.task // Create a copy of the task to avoid direct mutation
    }
  };
},
  mounted() {
  if (this.taskToEdit && this.taskToEdit.due_date) {
    // Ensure the due_date is in YYYY-MM-DD format
    this.taskToEdit.due_date = this.formatDate(this.taskToEdit.due_date);
  }
},
  methods: {
    formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
    closePopup() {
      this.$emit("close");
    },
    submitEdit() {
      // Send the updated task to the backend
      axios
        .put(`http://localhost:3000/api/tasks/${this.taskToEdit.id}`, this.taskToEdit)
        .then(() => {
          // Emit the updated task to the parent for immediate UI update
          this.$emit("update-task", this.taskToEdit);
          this.closePopup(); // Close the popup
        })
        .catch((error) => {
          console.error("Error updating task:", error);
          alert("Erreur lors de la mise à jour de la tâche.");
        });
    },
  },

};
</script>

<style>
.edit-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
}

</style>
