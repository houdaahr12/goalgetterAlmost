<template>
  <div class="container-fluid d-flex align-items-center justify-content-center mt-4">
    <!-- Left Section: Welcome Message -->
    <div class="welcome-text" :class="{ 'animate-fall': animate }">
      <h1 class="display-4">Bienvenue {{ capitalizedName }}</h1>
      <p class="lead fw-bold">Ajoutez vos tâches et commencez à voir votre progression.!</p>
    </div>

    <!-- Right Section: Illustration -->
    <div class="illustration" :class="{ 'animate-fall': animate }">
      <img :src="require('@/assets/welcome.png')" alt="Welcome Illustration" class="img-fluid" />
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import axios to make API requests
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      userName: "", // Start with an empty string for the username
      animate: false, // Control the animation state
    };
  },
  computed: {
    capitalizedName() {
      if (!this.userName) return "";
      return this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    },
  },
  mounted() {
    // Make an API call to fetch the user data from the backend when the component is mounted
    axios
      .get("http://localhost:3000/api/user", { withCredentials: true })
      .then((response) => {
        if (response.data.userName) {
          this.userName = response.data.userName; // Assign the fetched name to userName
          this.animate = true; // Trigger the animation after fetching the data
        } else {
          console.error("User not authenticated");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  },
};
</script>


<style scoped>
@keyframes fall {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  50% {
    transform: translateY(10px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fall {
  animation: fall 1.3s ease-out;
}

.container-fluid {
  background: #e4c1f9;
  padding-left: 0;
  padding-right: 0;
  max-width: 80%;
  margin-left: 280px;
  margin-bottom: 26px;
  border-radius: 30px;
  box-shadow: 5px 18px 22px rgba(194, 38, 38, 0.1);
}
.dark-mode .container-fluid {
  background: rgb(55, 54, 56);
  box-shadow: 5px 18px 22px rgba(0, 0, 0, 0.324);
}
.dark-mode .display-4 {
  color: hsl(268, 75%, 67%);
}
.dark-mode p {
  color: #d1d1d1db;
}
.welcome-text {
  max-width: 70%;
  text-align: start;
  padding-right: 300px;
}

.display-4 {
  color: #491784;
  font-weight: bold;
}

.illustration {
  max-width: 300px;
}

.illustration img {
  max-width: 100%;
  object-fit: contain;
}

h1 {
  font-size: 3rem;
}

p {
  font-size: 1.25rem;
}
</style>
