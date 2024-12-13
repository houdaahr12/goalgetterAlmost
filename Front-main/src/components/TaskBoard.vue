<template>
  <div>
    <div class="task-board" v-if="!isAllEmpty">
      <!-- Loop through task statuses -->
      <div
        v-for="(tasks, status) in sortedTaskStatuses"
        :key="status"
        class="task-column"
        @dragover.prevent
        @drop="onDrop($event, status)"
      >
        <div class="header d-flex justify-content-between fw-bold">
          <h2 class="heading">
            {{ statusLabels[status] }}
            <span class="task-count">({{ tasks.length }})</span>
          </h2>
          <button class="add" @click="goToAddTask(status)"  title="ajouter tache">+</button>
        </div>

        <!-- Show message if column is empty -->
        <div v-if="tasks.length === 0" class="d-flex justify-content-center align-items-center gap-4 empty-column-message">
          <p class="text-muted">Oups...rien à voir ici</p>
          <img 
          :src="require('@/assets/NoTasksss.png')" 
          alt="No Tasks" 
          class="img-fluid animated-image" 
        />
        </div>

        <!-- Render tasks if there are any -->
        <div v-else class="task-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <TaskDisplay
              :task="task"
              :show-checkbox="false"
              @trigger-edit="openEditPopup"
              @delete-task="handleDeleteTask"
              @update-task="updateTaskStatus" 
              @remove-task="removeTask"
              @show-toast="showToast" 
            />
          </div>
        </div>
      </div>
    </div>

    <EditTask
      v-if="showEditPopup"
      :task="taskToEdit"
      @update-task="updateTask"
      @close="closeEditPopup"
    />

    <div
      v-if="isAllEmpty"
      class="d-flex align-items-center justify-content-center no-tasks-message"
    >
      <div class="no-tasks-content">
        <p>Rien à afficher ici</p>
        <img 
          :src="require('@/assets/NoTasksss.png')" 
          alt="No Tasks" 
          class="img-fluid animated-image" 
        />
      </div>
    </div>
    <!-- Toast notification -->
    <div v-if="toastMessage" class="toast-container">
      <div class="toast-message">{{ toastMessage }}</div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import TaskDisplay from "./TaskDisplay.vue";
import EditTask from "./EditTask.vue"; // Ensure EditTask is imported
axios.defaults.withCredentials = true;
export default {
 // Assure que les cookies de session sont envoyés

  name: "TaskBoard",
  components: { TaskDisplay, EditTask },

  data() {
    return {
      showEditPopup: false,
      taskToEdit: null,
      draggedTask: null,
      taskCount: 0,
      taskStatuses: {
        "pas commence": [],
        "en cours": [],
        "termine": [],
      },
      statusLabels: {
        "pas commence": "Pas Commencé",
        "en cours": "En Cours",
        "termine": "Terminé",
      },
      toastMessage: "",
    };
  },

  created() {
    axios
      .get("http://localhost:3000/api/tasks/today")
      .then((response) => {
        this.taskCount = response.data.taskCount;
      })
      .catch((error) => {
        console.error("Error fetching task count:", error);
      });
  },

  computed: {
    sortedTaskStatuses() {
      const priorityOrder = {
        urgent: 1,
        important: 2,
        "moins important": 3,
      };

      const sortTasks = (tasks) => {
        return tasks.sort((a, b) => {
          // Sort by priority first
          const priorityA = priorityOrder[a.priority?.toLowerCase()] || 4; // 4 for unknown priorities
          const priorityB = priorityOrder[b.priority?.toLowerCase()] || 4;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // If priorities are the same, sort by due date
          const dateA = a.due_date ? new Date(a.due_date) : null;
          const dateB = b.due_date ? new Date(b.due_date) : null;

          if (dateA && !dateB) return -1; // Task with a date comes first
          if (!dateA && dateB) return 1;
          if (!dateA && !dateB) return 0;

          return dateA - dateB; // Ascending order of dates
        });
      };

      return Object.keys(this.taskStatuses).reduce((sortedStatuses, status) => {
        sortedStatuses[status] = sortTasks([...this.taskStatuses[status]]);
        return sortedStatuses;
      }, {});
    },

    isAllEmpty() {
      return Object.values(this.taskStatuses).every(
        (tasks) => tasks.length === 0
      );
    },
  },

  methods: {
    async fetchTasksByStatus() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tasks-by-status"
        );
        this.taskStatuses = response.data;

        // Calculate total task count
        this.taskCount = Object.values(this.taskStatuses).reduce(
          (total, tasks) => total + tasks.length,
          0
        );

        this.sortTasksByDate();
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    },
    openEditPopup(task) {
      this.taskToEdit = task;
      this.showEditPopup = true;
    },
    closeEditPopup() {
      this.showEditPopup = false;
      this.taskToEdit = null;
    },

    sortTasksByDate() {
      for (const status in this.taskStatuses) {
        this.taskStatuses[status].sort((a, b) => {
          // If a task has no due_date, place it at the bottom
          const dateA = a.due_date ? new Date(a.due_date) : null;
          const dateB = b.due_date ? new Date(b.due_date) : null;

          if (dateA && !dateB) return -1; // Date A exists, B doesn't
          if (!dateA && dateB) return 1; // Date B exists, A doesn't

          // If both have dates, compare them
          return dateA - dateB; // Ascending order (earliest first)
        });
      }
    },

    onDragStart(event, task) {
      this.draggedTask = task;
      event.dataTransfer.effectAllowed = "move";
      task.dropped = false; // Reset dropped animation
    },

    onDragEnd() {
      if (this.draggedTask) {
        this.draggedTask.dropped = true; // Trigger drop animation
      }
      this.draggedTask = null;
    },

    onDrop(event, newStatus) {
      if (!this.draggedTask) return;

      const oldStatus = this.draggedTask.status;

      if (newStatus !== oldStatus) {
        this.taskStatuses[oldStatus] = this.taskStatuses[oldStatus].filter(
          (task) => task.id !== this.draggedTask.id
        );
        this.draggedTask.status = newStatus;
        this.taskStatuses[newStatus].push(this.draggedTask);

        this.draggedTask.dropped = true; // Apply drop animation
        axios
          .put(`http://localhost:3000/api/tasks/${this.draggedTask.id}`, {
            status: newStatus,
          })
          .then(() => console.log("Task status updated successfully."))
          .catch((error) => console.error("Error updating task status:", error));
      }

      this.draggedTask = null;
    },

    handleEditTask(task) {
      console.log("Editing task:", task);
    },

    async removeTask(taskId) {
  console.log("Deleting task with ID:", taskId);
  
  // Find the task and its status category
  let taskStatus = null;
  let taskIndex = null;
  
  // Search for the task in all status categories
  for (const status in this.taskStatuses) {
    taskIndex = this.taskStatuses[status].findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      taskStatus = status;
      break;
    }
  }
  
  if (taskStatus !== null && taskIndex !== -1) {
    // Remove the task locally
    this.taskStatuses[taskStatus].splice(taskIndex, 1);
    this.showToast("Tâche supprimée localement!");

    // Update the backend to mark the task as canceled
    try {
      await axios.put(`http://localhost:3000/api/tasks/cancel/${taskId}`);
      this.showToast("Tâche supprimée et déplacée vers la corbeille !");
    } catch (error) {
      console.error("Error updating task status:", error);
      this.showToast("Erreur lors de la mise à jour de l'état de la tâche sur le serveur.");
    }
  } else {
    console.error("Task not found locally.");
    this.showToast("Tâche introuvable.");
  }
},


   showToast(message) {
      console.log("Toast message: ", message); // Debugging line
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = ""; // Hide the toast after 7 seconds
      }, 7000);
},
updateTaskStatus(updatedTask) {
    const taskIndex = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      // Update the task's status locally
      this.tasks[taskIndex] = updatedTask;
    }
  },

    goToAddTask(status) {
    // Pass the column's status as a query parameter when navigating to the task creation page
    this.$router.push({ name: 'AddView', query: { status } });
  },
  },

  mounted() {
    this.fetchTasksByStatus();
  },
};
</script>



<style scoped>
.task-board {
  display: flex;
  justify-content: space-between;
  margin: 0 0 50px 120px;
  gap: 1.5rem;
  padding: 1rem;
  position: relative;
  width: 100%;
  border-radius: 20px;
  }

.heading {
  color: #491784;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #491784;
  margin-bottom: 1rem;
  
}
.task-count {
  color: #491784;
  font-size: 14px;
  margin-left: 5px;
  font-weight: normal;
}

.task-column {
  flex: 1;
  background-color: #e4d4f7;
  border: 1px solid #ddd;
  border-radius: 30px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.task-list {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.add {
  background-color: #491784;
  color: white;
  font-size: 25px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.add:hover {
  background: hsl(268, 70%, 60%);
  transform: scale(1.1);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Style for the scrollbar */
.task-list::-webkit-scrollbar {
  width: 8px;
}

.task-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.task-list::-webkit-scrollbar-track {
  background: #f9f9f9;
}

.task-item {
  cursor: grab; 
  transition: transform 0.2s, box-shadow 0.2s;
}


.no-tasks-message {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgba(217, 201, 233, 0.589);
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  margin-left: 260px;
  margin-bottom: 30px;
}

.no-tasks-content {
  display: flex;
  align-items: center; /* Align text and image vertically */
  justify-content: space-between; /* Space out text and image */
  width: 100%;
  max-width: 600px; /* You can adjust the max-width */
}

.no-tasks-message p {
  font-size: 1.5rem;
   color: #491784;
  font-weight: bold;
  margin-right: 20px; /* Space between text and image */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
}

.no-tasks-message p:hover {
  color: #370f66;
  transition: color 0.3s ease;
}

.animated-image {
  width: 100px;
  height: 100px;
  animation: imageZoom 7s ease-in-out infinite; /* Animation lasting 7 seconds */
}

@keyframes imageZoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Toast notification container */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px; /* Align to the right side */
  z-index: 9999;
  width: auto; /* Let the width adjust to content */
  max-width: 350px; /* Set a max-width for a more compact look */
  padding: 10px;
}

/* Toast message styles */
.toast-message {
  background-color: #e4c1f9; /* Green background */
  color: #491784;
  padding: 12px 20px; /* Increased padding for better spacing */
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  animation: fadeInRight 0.5s ease-out; /* Adding animation */
}

/* Animation for toast */
@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>

