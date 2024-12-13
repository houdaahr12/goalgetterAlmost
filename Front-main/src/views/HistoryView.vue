<template>
  <div class="history-container">
    <div class="history-header">
      <h3>Historique des Tâches</h3>
    </div>
    <div class="history-content">
      <div v-if="Object.keys(groupedHistory).length">
        <div v-for="(tasks, date) in groupedHistory" :key="date" class="date-group">
          <h4 class="date-title">{{ formatDate(date) }}</h4>
          <TaskDisplayHistory
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            class="full-width-task"
            @delete-task="handleDeleteTask"
          />
        </div>
      </div>
      <div v-else class="no-tasks">
        <p>Aucune tâche terminée</p>
        <img
          :src="require('@/assets/NoTasksss.png')"
          alt="No History Tasks"
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
import TaskDisplayHistory from "@/components/TaskDisplayHistory.vue";
import axios from "axios";

export default {
  name: "HistoryView",
  components: { TaskDisplayHistory },
  data() {
    return {
      history: {}, // Now an object to hold grouped tasks by date
      toastMessage: "", // This will hold the toast message content
    };
  },
  computed: {
    groupedHistory() {
      return this.history;
    },
  },
  mounted() {
    this.fetchCompletedTasks();
  },
  methods: {
    fetchCompletedTasks() {
      axios
        .get("http://localhost:3000/api/history")
        .then((response) => {
          const data = response.data;
          if (typeof data === "object") {
            this.history = data;
          } else {
            this.history = {};  // Fallback to empty object
            console.error('Data is not an object:', data);
          }
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    },

    handleDeleteTask(taskId) {
      // Remove the task from the history list
      for (const date in this.history) {
        this.history[date] = this.history[date].filter((task) => task.id !== taskId);
      }
      this.showToast("Tâche supprimée de l'historique !");
    },

    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("fr-FR", options);
    },

    showToast(message) {
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = ""; // Hide the toast after 7 seconds
      }, 7000);
    },
  },
};
</script>

<style scoped>
.history-container {
  width: 80%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  margin-left: 280px;
  margin-top: 40px;
}

.history-header {
  margin-bottom: 20px;
  color: #8e33c2;
}

.history-header h3 {
  font-size: 24px;
  font-weight: bold;
}

.history-content {
  padding: 15px;
  border-radius: 8px;
  display: block;
}

.date-group {
  margin-bottom: 30px;
}

.date-title {
  font-size: 20px;
  font-weight: bold;
  color: #491784;
  margin-bottom: 10px;
}

.full-width-task {
  width: 100%;
  margin-bottom: 15px;
}

.no-tasks {
  text-align: left;
  padding: 20px;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.no-tasks p {
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
}

.no-tasks img {
  width: 130px;
  height: auto;
  margin-right: 70px;
}

.animated-image {
  width: 100px;
  height: 100px;
  animation: imageZoom 7s ease-in-out infinite;
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
  background-color: #c1f9e4; /* Green background */
  color: #2a7c1b;
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
