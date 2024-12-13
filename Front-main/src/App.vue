<template>
  <div id="app">
    <template v-if="isLoggedIn">
     <HeaderView />
      <router-view /> 
      <SidebarView />
    
        
    </template>
    <template v-else>
      <Navbar />
      <router-view /> 
      <add-view @task-added="refreshDashboard" />
      <Footer />
    </template>
    
  </div>
</template>

<script>
import Footer from "./components/Footer.vue"
import Navbar from "./components/Navbar.vue"
import SidebarView  from "./components/sidebar/SidebarView.vue";
import HeaderView from "./components/HeaderView.vue";


import axios from 'axios';

export default {
   components: { Navbar, Footer, SidebarView,HeaderView},
data() {
    return {
      isLoggedIn: false,
      user: null,
    };
  },
  created() {
    this.checkAuthStatus();
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await axios.get('http://localhost:3000/auth/status', { withCredentials: true });
        this.isLoggedIn = response.data.isLoggedIn;
        this.user = response.data.user;
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
      }
    },
  },
  refreshDashboard() {
      // Trigger the dashboard refresh here
      this.$refs.dashboard.fetchTasks(); // Assuming your Dashboard component has a fetchTasks method
    },
  name: 'App',

};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap');




html, body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Inter', sans-serif;
}
.dark-mode {
  background-color:#212121 ;
  color: #ffffff;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

v-footer {
  margin-top: auto; 
}
</style>
