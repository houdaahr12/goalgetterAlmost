<template>
  <div class="main-container">
    <!-- Section Profil -->
    <div class="container profile-section">
      <h2 class="heading">Mon Profil</h2>

      <div class="profile-photo-section">
        <img :src="require('@/assets/user.jpg')" alt="Photo de profil" class="profile-photo" />
       
      </div>
      
    <!--affichage des informations de l'utilisateur -->
      <form @submit.prevent="saveChanges" class="form">
        <div v-if="!isEditing">
          <p>Prénom : {{ profile.name }}</p>
          <p>Nom : {{ profile.surname }}</p>
          <p>Email : {{ profile.email }}</p>
          <p>Mot de passe : ********</p>
          <button type="button" @click="isEditing = true" class="login-button">Modifier</button>
        </div>
    <!--changer les informations de l'utilisateur -->
        <div v-if="isEditing">
          <input type="text" v-model="profile.name" placeholder="Changer le prénom" class="input" />
          <input type="text" v-model="profile.surname" placeholder="Changer le nom" class="input" />
          <input type="email" v-model="profile.email" placeholder="Changer l'email" class="input" />
          <input type="password" v-model="profile.password" placeholder="Changer le mot de passe" class="input" />
          <button type="submit" class="login-button">Enregistrer les changements</button>
          <button type="button" @click="isEditing = false" class="login-button cancel-button">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Section Statistiques -->
    <div class="container2 stats-section">
      <h2 class="heading">Statistiques des tâches</h2>
     
      <div class="stats-container">
    <!-- Toggle for Weekly/Monthly Graph -->
    <div class="toggle-buttons">
      <button 
        :class="{ active: isWeekly }" 
        @click="isWeekly = true; renderChart()"
      >
        Graphes Hebdomadaires
      </button>
      <button 
        :class="{ active: !isWeekly }" 
        @click="isWeekly = false; renderChart()"
      >
        Graphes Mensuels
      </button>
    </div>

    <!-- Graph Section -->
    <div class="graph-section">
      <canvas id="tasksChart"></canvas>
    </div>

    <!-- Circular Progress Indicators -->
    <div class="circular-progress-section">
      <div class="circular-indicator" v-for="(value, label) in taskProgress" :key="label">
        <div class="circle" :style="{ '--progress': value }">
          <span>{{ value }}%</span>
        </div>
        <p>{{ label }}</p>
      </div>
    </div>
  </div>
     </div>
 </div>
</template>

<script>
import axios from "axios";
import { Chart } from "chart.js";


export default {
  data() {
    return {
      isEditing: false, // Pour savoir si on est en mode modification
      profilePhoto: "/default-profile.jpg",
      profile: {
        name: "",
        surname: "",
        email: "",
        password: "",
      },
      isWeekly: true, // Toggles between weekly and monthly graphs
      weeklyStats: [], // Weekly task data
      monthlyStats: [], // Monthly task data
      taskProgress: {
        "Not Started": 0,
        "In Progress": 0,
        Done: 0,
      },
    };
    
  },
  methods: {
    // Methode pour afficher les informations de l'utilisateur
    async fetchProfileData() {
  try {
    const response = await axios.get("http://localhost:3000/profile", { withCredentials: true });
    const data = response.data || {};
    this.profile.name = data.name || "Nom non défini";
    this.profile.surname = data.surname || "Prénom non défini";
    this.profile.email = data.email || "Email non défini";
    
  } catch (error) {
    console.error("Erreur lors du chargement des données du profil :", error);
  }
},
async renderChart() {
  const ctx = document.getElementById("tasksChart").getContext("2d");
  const data = this.isWeekly ? this.weeklyStats : this.monthlyStats;
  
  const labels = data.map(item => (this.isWeekly ? `Semaine ${item.week}` : item.month));
  const values = data.map(item => item.completed);

  if (this.chartInstance) {
    this.chartInstance.destroy(); // Détruire l'ancien graphique
  }

  this.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Tâches complétées",
          data: values,
          backgroundColor: "rgba(98, 0, 234, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
},

 // Fetch weekly data
 async fetchWeeklyStats() {
      try {
        const response = await axios.get("http://localhost:3000/tasks/weeklyStats");
        this.weeklyStats = response.data; // [{ week: 1, completed: 10, total: 20 }, ...]
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques hebdomadaires :", error);
      }
    },
    async fetchTaskStatistics() {
  if (this.isWeekly) {
    await this.fetchWeeklyStats();
  } else {
    await this.fetchMonthlyStats();
  }
  await this.fetchTaskProgress();
},

    // Fetch monthly data
    async fetchMonthlyStats() {
      try {
        const response = await axios.get("http://localhost:3000/tasks/monthlyStats");
        this.monthlyStats = response.data; // [{ month: "January", completed: 40, total: 80 }, ...]
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques mensuelles :", error);
      }
    },
 // Fetch task progress breakdown
 async fetchTaskProgress() {
      try {
        const response = await axios.get("http://localhost:3000/tasks/progress");
        this.taskProgress = response.data; // { "Not Started": 25, "In Progress": 50, "Done": 25 }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de progression :", error);
      }
    },
   
    onPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePhoto = URL.createObjectURL(file);
      }
    },
    async uploadPhoto() {
      // Ajoute la logique pour uploader la photo
    },
    async saveChanges() {
      const updatedProfile = {};

      if (this.profile.name) updatedProfile.name = this.profile.name;
      if (this.profile.surname) updatedProfile.surname = this.profile.surname;
      if (this.profile.email) updatedProfile.email = this.profile.email;
      if (this.profile.password) updatedProfile.password = this.profile.password;

      try {
        await axios.put("http://localhost:3000/profile", updatedProfile, { withCredentials: true });
        alert("Les changements ont été enregistrés !");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
      }
    },
  },
  mounted() {
    this.fetchProfileData();
    this.fetchTaskStatistics();
  
  },
};
</script>

<style scoped>


.dark-mode .container,
.dark-mode .container2 {
  background-color:rgb(55, 54, 56);
  color:rgba(209, 209, 209, 0.858) ;
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
  border:none;
}

.dark-mode .input {
  background:rgb(108, 108, 108);
  color:  rgba(209, 209, 209, 0.858) ;
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
}


.dark-mode .circle {
  background: conic-gradient(
    #bb86fc calc(  rgba(209, 209, 209, 0.858) * 1%),
    #444 0%
  );
}
.dark-mode .heading{
  color:hsl(268, 75%, 67%);
}
.form {
 font-size: large;
}
.main-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center; /* Center elements on smaller screens */
}

.container {
  background: #f8f9fd;
  border-radius: 20px;
  padding: 30px;
  border: 5px solid #fff;
  box-shadow: rgba(182, 133, 215, 0.5) 0px 15px 20px -10px;
  margin: 20px; /* Adjust for better spacing on smaller screens */
  flex: 1; /* Make the container grow and shrink */
  max-width: 400px;
}

.container2 {
  background: #f8f9fd;
  border-radius: 20px;
  padding: 30px;
  border: 5px solid #fff;
  box-shadow: rgba(182, 133, 215, 0.5) 0px 15px 20px -10px;
  margin: 20px; /* Adjust for better spacing on smaller screens */
  flex: 2; /* Allow more space for stats */
  max-width: 600px;
  
}

.statistics {
  display: flex;
  flex-wrap: wrap; /* Allow cards to stack on smaller screens */
  justify-content: space-around; /* Distribute cards evenly */
  gap: 50px;
}

.stat-card {
  flex: 1 1 calc(33.33% - 40px); /* Ensure cards take up equal space */
  text-align: center;
  
}

/* Media Query for Small Screens */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column; /* Stack elements vertically */
  }

  .container {
    margin-left:100px; /* Remove margin for smaller screens */
    max-width: 100%;

  }

  .container2 {
    max-width: 80%; /* Take full width */
    margin-left:100px ;
  }

  .statistics {
    flex-direction: column; /* Stack stat cards vertically */
    gap: 10px;
  }

  .stat-card {
    flex: 1 1 100%; /* Full width for each stat card */
  }
}
.profile-section {
  max-width: 400px;
}
.heading {
  text-align: center;
  font-weight: 900;
  font-size: 28px;
  color: rgb(82, 26, 122);
  margin-bottom: 20px;
}

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 30px;
}

.input {
  width: 100%;
  background: white;
  border: none;
  padding: 10px 15px;
  border-radius: 15px;
  margin-top: 10px;
  box-shadow: rgba(238, 207, 255, 0.8) 0px 10px 10px -5px;
}

.input:focus {
  outline: none;
  border-inline: 2px solid #7b12d1;
}

.login-button, .cancel-button {
  width: 100%;
  background: linear-gradient(45deg, rgb(162, 16, 211), rgb(114, 18, 209));
  color: white;
  padding: 12px;
  border-radius: 15px;
  margin-top: 15px;
  font-weight: bold;
  text-align: center;
  transition: 0.3s ease;
}

.cancel-button {
  background: #ccc;
  color: black;
}

.circle {
  width: 100px;
  height: 100px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(
    #6200ea calc(var(--progress) * 1%),
    #ddd 0%
  );
}



</style>