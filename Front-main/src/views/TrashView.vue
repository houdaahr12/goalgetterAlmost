<template>
  <div class="trash-container">
    <div class="trash-header">
      <h3>Tâches Supprimées</h3>
    </div>
    <div class="trash-content">
      <div v-if="trash.length">
        <TaskDisplayTrash
          v-for="task in trash"
          :key="task.id"
          :task="task"
          class="full-width-task"
          @update-task="updateTaskStatus"
          @delete-task="handleDeleteTask"
        />
      </div>
      <div v-else class="no-tasks">
        <p>Aucune tâche supprimée</p>
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
import TaskDisplayTrash from "@/components/TaskDisplayTrash.vue";
import axios from "axios";

export default {
  name: "TrashView",
  components: { TaskDisplayTrash },
  data() {
    return {
      trash: [],
      toastMessage: "", // This will hold the toast message content
    };
  },
  mounted() {
    this.fetchDeletedTasks();
  },
  methods: {
    fetchDeletedTasks() {
      axios
        .get("http://localhost:3000/api/deleted")
        .then((response) => {
          this.trash = response.data;
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    },

    updateTaskStatus(updatedTask) {
      axios
        .put(`http://localhost:3000/api/restore/${updatedTask.id}`)
        .then((response) => {
          console.log(response.data.message);
          this.trash = this.trash.filter((task) => task.id !== updatedTask.id);
          this.showToast("Tâche restaurée avec succés !");
        })
        .catch((error) => {
          console.error("Error restoring task:", error);
        });
    },
    handleDeleteTask(taskId) {
    // This will remove the task from the trash list in the parent component
    this.trash = this.trash.filter(task => task.id !== taskId);
    this.showToast("Tâche supprimée définitivement !");
  },
    // Show toast with a 
    showToast(message) {
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = ""; // Hide the toast after 3 seconds
      }, 7000);
    },
  },
};
</script>

<style scoped>
.trash-container {
  width: 80%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  margin-left: 280px;
  margin-top: 40px;
}

.trash-header {
  margin-bottom: 20px;
  color: #491784;
}

.trash-header h3 {
  font-size: 24px;
  font-weight: bold;
}

.trash-content {
  padding: 15px;
  border-radius: 8px;
  display: block;
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
