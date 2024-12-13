<template>
    <div
      class="task-display d-flex justify-content-between align-items-center"
      :style="getPriorityStyle(task.priority)"
    >
      <div class="d-flex align-items-center">
        <div>
          <p
            class="task-name mb-0"
          >
            {{ task?.task_name || "Nom de la tâche non disponible" }}
          </p>
          <small
            class="task-date"
          
          >
            {{ formatTaskDateTime(task.due_date, task.due_time) }}
          </small>
        </div>
      </div>
  
      <div class="d-flex align-items-center">
        <div class="position-relative tooltip-container">
          <i class="fa fa-info-circle task-tooltip-icon"></i>
          <div class="tooltip-content">
            <p><strong>Priorité:</strong> {{ task?.priority || 'Non spécifiée' }}</p>
            <p><strong>Catégorie:</strong> {{ task?.category || 'Non spécifiée' }}</p>
          </div>
        </div>
        <div class="dropdown ms-3">
          <i
            class="fa fa-ellipsis-v task-options"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          ></i>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
  import axios from "axios";
  
  export default {
    name: "TaskDisplayHistory",
    data() {
      return {
        showMessage: false,
        actionMessage: "",
      };
    },
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    computed: {
      isOverdue() {
        if (!this.task.completed_date) return false;
  
        const currentDateTime = new Date();
        const completedDateTime = new Date(this.task.completed_date);
        
        return completedDateTime < currentDateTime && !this.task.completed;
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
          return `${formattedDate}, ${hours}h${minutes}`;
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
        this.$emit("edit-task", this.task);
      },
  
     
  handleDeleteClick() {
    const taskId = this.task.id;

    axios
      .delete(`http://localhost:3000/api/tasks/${taskId}`)
      .then(() => {
        this.$emit("delete-task", taskId); // Emit event to parent to delete the task
        // Emit event to parent to show the delete message
        this.$emit("show-toast", "Tâche supprimée !");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  },
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
  
  /* Task Date Styles */
  .task-date {
    color: #333;
  }
  
  
  .task-action-icon {
    font-size: 1.4rem;
    color: #491784;
    cursor: pointer;
    margin-right: 10px;
    transition: color 0.2s ease;
    display: inline-block !important;
  }
  
  .task-action-icon:hover {
    color: hsl(268, 70%, 60%);
  }
  
  .task-action-icon.text-danger {
    color: #e63946;
  }
  
  .task-action-icon.text-danger:hover {
    color: hsl(0, 65%, 81%);
  }
  

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
.dropdown{
  cursor: pointer;
}


  </style>
