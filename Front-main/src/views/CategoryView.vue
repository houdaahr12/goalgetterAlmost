<template>
  <div class="category-view">

    <div v-if="allCategoriesEmpty" class="d-flex justify-content-center align-items-center gap-4 empty-column-message">
      <p class="text-muted">Vous n'avez aucune tâche pour le moment!</p>
      <img 
        :src="require('@/assets/NoTasksss.png')" 
        alt="No Tasks" 
        class="img-fluid animated-image" 
      />
    </div>
    
    <div v-else class="categories-container mt-3">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category-box"
        :style="{ backgroundColor: category.bgColor }"
      >
        <div class="category-heading">
          <h3>
            <i :class="category.icon" class="category-icon"></i>
            {{ category.label }}
          </h3>
          <button
            @click="addTask(category.name)"
            class="add-task-icon"
            title="Ajouter une tâche"
          >
            +
          </button>
        </div>

        <div v-if="category.tasks.length === 0" class="d-flex justify-content-center align-items-center gap-4 empty-column-message">
          <p class="text-muted">Aucune tâche dans cette catégorie!</p>
          <img 
            :src="require('@/assets/NoTasksss.png')" 
            alt="No Tasks" 
            class="img-fluid animated-image" 
          />
        </div>

        <div class="category-tasks">
          <div v-for="task in category.tasks" :key="task.id">
            <TaskDisplay 
              :task="task" 
              :show-checkbox="true" 
              :showTooltip="false" 
              @update-task="updateTaskStatus" 
              @delete-task="handleDeleteTask"
              @trigger-edit="openEditPopup" 
              @remove-task="removeTask" 
              @show-toast="showToast" 
            />
            <EditTask
              v-if="showEditPopup && task.id === taskToEdit.id"
              :task="taskToEdit"
              @update-task="updateTaskStatus"
              @close="closeEditPopup"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div v-if="toastMessage" class="toast-container">
      <div class="toast-message">{{ toastMessage }}</div>
    </div>
  </div>
</template>

<script>
import TaskDisplay from "@/components/TaskDisplay.vue";
import EditTask from '@/components//EditTask.vue';
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  name: "CategoryView",
  components: { TaskDisplay, EditTask },
  data() {
    return {
      showEditPopup: false,
      taskToEdit: null,
      categories: [
        { name: "etude", label: "Étude", tasks: [], bgColor: "#cdb4db", icon: "fas fa-book" },
        { name: "travail", label: "Travail", tasks: [], bgColor: "#ffc8dd", icon: "fas fa-briefcase" },
        { name: "maison", label: "Maison", tasks: [], bgColor: "#bde0fe", icon: "fas fa-home" },
        { name: "personnel", label: "Personnel", tasks: [], bgColor: "#ced4da", icon: "fas fa-user" },
        { name: "loisirs", label: "Loisirs", tasks: [], bgColor: "#eae2b7", icon: "fas fa-gamepad" },
        { name: "autre", label: "Autre", tasks: [], bgColor: "#e07a5f", icon: "fas fa-cogs" },
      ],
      toastMessage: "",
    };
  },
  async created() {
    await this.fetchTasks();
    this.checkIfAllCategoriesEmpty();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get("http://localhost:3000/api/tasks-by-category");
        const tasksByCategory = response.data;

        this.categories.forEach((category) => {
          category.tasks = (tasksByCategory[category.name] || []).sort((a, b) => {
            const priorityOrder = {
              "urgent": 1,
              "important": 2,
              "moins important": 3
            };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
        });
        this.checkIfAllCategoriesEmpty();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    checkIfAllCategoriesEmpty() {

    this.allCategoriesEmpty = this.categories.every(category => category.tasks.length === 0);
    },
    addTask(categoryName) {
      this.$router.push({ name: "AddView", query: { categoryName } });
    },
    openEditPopup(task) {
      this.taskToEdit = task;
      this.showEditPopup = true;
    },
    closeEditPopup() {
      this.showEditPopup = false;
      this.taskToEdit = null;
    },
    updateTaskStatus(updatedTask) {
      const category = this.categories.find(c => c.tasks.some(task => task.id === updatedTask.id));
      if (category) {
        const taskIndex = category.tasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          category.tasks[taskIndex] = updatedTask;
        }
      }
    },
    async removeTask(taskId) {
      try {
        await axios.put(`http://localhost:3000/api/tasks/cancel/${taskId}`);
        this.categories.forEach(category => {
          category.tasks = category.tasks.filter(task => task.id !== taskId);
        });
        this.showToast("Tâche supprimée et déplacée vers la corbeille !");
        this.checkIfAllCategoriesEmpty(); // Vérifier à nouveau après suppression
      } catch (error) {
        console.error("Erreur lors de l'annulation de la tâche:", error);
        this.showToast("Erreur lors de l'annulation de la tâche.");
      }
    },
    showToast(message) {
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = "";
      }, 7000);
    },
  },
};
</script>

<style scoped>
.category-view {
  text-align: center;
  padding: 2rem;
}

.head {
  color: #491784;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 3rem;
  margin-left: 250px;
}

.category-box {
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px; 
  overflow: hidden; 
}

.category-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.category-heading h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.category-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.add-task-icon {
  font-size: 1.2rem;
  color: white;
  background-color: #333;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.category-tasks {
  max-height: 300px; 
  overflow-y: auto; 
  margin-top: 1rem;
  text-align: left;
}

.category-tasks::-webkit-scrollbar {
  width: 8px;
}

.category-tasks::-webkit-scrollbar-thumb {
  background: hsl(0, 0%, 75%);
  border-radius: 4px;
}

.category-tasks::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

@media (max-width: 1024px) {
  .categories-container {
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media (max-width: 768px) {
  .categories-container {
    margin-left: 90px;
    grid-template-columns: repeat(1, 1fr); 
  }}

/* Toast notification */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: auto;
  max-width: 350px;
  padding: 10px;
}

.toast-message {
  background-color: #e4c1f9;
  color: #491784;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.empty-column-message {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

.empty-column-message p {
  font-size: 1.2rem;
  color: #6c757d;
}

.empty-column-message img {
  max-width: 120px;
  animation: fadeInScale 1.5s ease-in-out; 

}
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8); 
  }
  100% {
    opacity: 1;
    transform: scale(1); 
  }
}
</style>
