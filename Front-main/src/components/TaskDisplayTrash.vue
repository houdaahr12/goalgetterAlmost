<template>
  <div
    class="task-display d-flex justify-content-between align-items-center"
    :style="getPriorityStyle(task.priority)"
  >
    <div class="d-flex align-items-center">
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

    <div class="d-flex align-items-center ms-3">
      <i
        class="fa fa-undo task-action-icon"
        @click="handleRestoreClick"
        title="Restaurer"
      ></i>
      <i
        class="fa fa-trash task-action-icon text-danger ms-2"
        @click="handleDeleteClick"
        title="Supprimer définitivement"
      ></i>
    </div>

    

  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;


export default {
  name: "TaskDisplay",
  data() {
    return {
      showMessage: false,  // Variable pour contrôler l'affichage du message
      actionMessage: "",   // Contenu du message
    };
  },

  props: {
    task: {
      type: Object,
      required: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
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
        return `${formattedDate}, ${hours}h${minutes}`;
      }

      return formattedDate;
    },

    getPriorityStyle(priority) {
      const colors = {
        urgent: "rgba(255, 0, 0, 0.5)",  // Red
        important: "rgba(255, 165, 0, 0.5)", // Orange
        "moins important": "rgba(0, 128, 0, 0.5)", // Green
      };
      return {
        boxShadow: `0px 4px 8px ${colors[priority?.toLowerCase()] || "gray"}`,
      };
    },

 handleRestoreClick() {
    const updatedTask = { ...this.task, status: "pas commence" };
    this.$emit("update-task", updatedTask);
    // Emit event to the parent to handle the message
    this.$emit("show-toast", "Tâche restaurée !");
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

/* Task Date Styles */
.task-date {
  color: #333;
}

.task-date.text-danger {
  color: red; /* Red color for overdue tasks */
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


</style>
