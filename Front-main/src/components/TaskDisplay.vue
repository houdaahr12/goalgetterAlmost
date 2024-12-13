<template>
  <div class="task-display d-flex justify-content-between align-items-center" :style="getPriorityStyle(task.priority)">
    <div class="d-flex align-items-center">
      <!-- Custom Checkbox -->
      <label v-if="showCheckbox" class="custom-checkbox">
        <input
          type="checkbox"
          class="task-checkbox"
          :checked="task.completed"
          @change="markTaskCompleted"
        />
        <span class="checkmark"></span>
      </label>
      <div>
        <p
          class="task-name mb-0"
          :class="{ 'text-decoration-line-through': task.completed }"
        >
          {{ task?.task_name || "Nom de la tâche non disponible" }}
        </p>
        <small
          class="task-date"
          :class="{ 'text-decoration-line-through': task.completed, 'text-danger': isOverdue }"
        >
          {{ formatTaskDateTime(task.due_date, task.due_time) }}
        </small>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <div v-if="showTooltip" class="position-relative tooltip-container">
        <i class="fa fa-info-circle task-tooltip-icon"></i>
        <div class="tooltip-content">
          <p><strong>Priorité:</strong> {{ task?.priority || 'Non spécifiée' }}</p>
          <p><strong>Catégorie:</strong> {{ task?.category || 'Non spécifiée' }}</p>
        </div>
      </div>
      <!-- Dropdown Menu -->
      <div class="dropdown ms-3">
        <i
          class="fa fa-ellipsis-v task-options"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="triggerEditTask">
              <i class="fa fa-pencil-alt me-2"></i> Modifier
            </a>
          </li>
          <li>
            <a class="dropdown-item text-danger" href="#" @click="handleDeleteClick">
              <i class="fa fa-trash me-2"></i> Supprimer
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  name: "TaskDisplay",
  props: {
    task: {
      type: Object,
      required: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isOverdue() {
      if (!this.task.due_date) return false;
      const currentDateTime = new Date();
      const dueDateTime = new Date(this.task.due_date);
      if (this.task.due_time) {
        const [hours, minutes] = this.task.due_time.split(":").map(Number);
        dueDateTime.setHours(hours, minutes, 0, 0);
      } else {
        dueDateTime.setHours(23, 59, 59, 999);
      }
      return dueDateTime < currentDateTime && !this.task.completed;
    },
  },
  methods: {
    formatTaskDateTime(date, time) {
      if (!date) return "";
      const taskDate = new Date(date);
      const optionsDate = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = taskDate.toLocaleDateString("fr-FR", optionsDate);
      if (time) {
        const [hours, minutes] = time.split(":");
        const formattedTime = `${hours}:${minutes}`;
        return `${formattedDate}, ${formattedTime}`;
      }
      return formattedDate;
    },
    getPriorityStyle(priority) {
      const colors = {
        urgent: "rgba(255, 0, 0, 0.5)",
        important: "rgba(255, 165, 0, 0.5)",
        "moins important": "rgba(0, 128, 0, 0.5)",
      };
      return {
        boxShadow: `0px 4px 8px ${colors[priority?.toLowerCase()] || "gray"}`,
      };
    },
    triggerEditTask() {
      this.$emit("trigger-edit", this.task);
    },
    
  handleDeleteClick() {
    
    // Send the request to update the task status to 'annule'
    axios.put(`http://localhost:3000/api/tasks/cancel/${this.task.id}`)
      .then(response => {
        console.log('Task status updated to "annule":', response.data.message);
        
        // Emit an event to remove the task from the parent component immediately
        this.$emit('remove-task', this.task.id); // Emit the task ID to be removed
        this.$emit("show-toast", "Tâche supprimée et déplacée vers la corbeille!"); 
        this.$emit('delete-task', this.task.id);
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  },
  
  markTaskCompleted(event) {
 
  const isChecked = event.target.checked;

  if (isChecked) {
    // Call the API to mark the task as complete
    axios.put(`http://localhost:3000/api/tasks/complete/${this.task.id}`)
      .then(response => {
        console.log('Task status updated to "termine":', response.data);
        
        // Update the task locally
        this.$emit("update-task", {
          ...this.task,
          completed:true,
          status: "termine"
        });
        
        // Optionally, show a success toast
        this.$emit("show-toast", "Tâche terminée avec succès!");
      })
      .catch(error => {
        console.error('Error updating task status:', error);
        // Optionally, revert the checkbox if API call fails
        event.target.checked = false;
        this.$emit("show-toast", "Erreur lors de la mise à jour de la tâche!", "error");
      });
  } else {
    // Handle unchecking if needed (optional based on your requirements)
    console.log('Unchecked task:', this.task.id);
  }
},},


  mounted() {
    this.$nextTick(() => {
      console.log("TaskDisplay component is mounted and ready");
    });
  },
};
</script>



<style scoped>
.task-display {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-display:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}

/* Custom Checkbox */
.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.8rem;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
  border: 2px solid #491784;
  border-radius: 50%; /* Makes it rounded */
  transition: background-color 0.2s ease, transform 0.2s ease;
}

/* Checked State */
.custom-checkbox input:checked ~ .checkmark {
  background-color: #491784;
  border-color: #491784;
  transform: scale(0.9);
}

/* Improved Checkmark */
.custom-checkbox .checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  width: 0.5rem;
  height: 0.8rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  border-radius: 2px; /* Optional to make the edges of the checkmark slightly rounded */
}

/* Task Date Styles */
.task-date {
  color: #333;
}

.task-date.text-danger {
  color: red; /* Red color for overdue tasks */
}

/* Three Dots Icon */
.task-options {
  font-size: 1.4rem;
  color: #491784;
  cursor: pointer;
}

/* Dropdown Menu */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: -5px; /* Adjust the distance from the bottom */
  right: 0px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 0.9rem;
}

.dropdown-item {
  padding: 0.4rem 1rem;
  color: #491784;   
  transition: transform 0.2s ease;
}

.dropdown-item:hover {
  color: #491784;
  background-color: hsl(268, 70%, 90%);
  transform: translateY(-3px) scale(1.05);
}

.dropdown-item.text-danger {
  color: #e63946;
}

.dropdown-item.text-danger:hover {
  background-color: rgba(230, 57, 70, 0.1);
  color: #e63847;
}


/* Tooltip Container */
/* Tooltip Container */
.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-content {
  display: none;
  position: absolute;
  top: -35px; /* Adjusted to keep the tooltip closer */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(73, 23, 132, 0.9);
  color: white;
  padding: 0.2rem 0.5rem; /* Reduced padding for a more compact look */
  border-radius: 5px;
  font-size: 0.8rem; /* Reduced font size */
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15); /* Adjusted box-shadow for a lighter effect */
  white-space: nowrap;
  z-index: 10;
}

.tooltip-container:hover .tooltip-content {
  display: block;
}


/* Tooltip Icon */
.task-tooltip-icon {
  font-size: 1.2rem;
  color: #491784;
  transition: color 0.2s ease;
}

.task-tooltip-icon:hover {
  color: hsl(268, 70%, 60%);
}

</style>