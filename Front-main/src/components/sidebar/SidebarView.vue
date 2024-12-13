<template>
  <div class="sidebar" :class="{collapsed: collapsed}" :style="{ width: sidebarWidth }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <router-link to="/dashboard" class="logo-link">
        <img :src="logo" alt="Logo" class="logo" />
        <span v-if="!collapsed" class="app-name">GoalGetter</span>
      </router-link>
    </div>

  

    <!-- Sidebar Links -->
    <SidebarLink to="/dashboard" icon="fas fa-columns">Tableau de bord</SidebarLink>
    <SidebarLink to="/cat" icon="fas fa-tasks">Mes Tâches</SidebarLink>
    <SidebarLink to="/todo" icon="fas fa-calendar">Calendrier</SidebarLink>

    <!-- Sidebar Buttons -->
    <router-link class="sidebar-button ajout" to="/add">
      <i class="fas fa-plus icon"></i>
      <span v-if="!collapsed" class="text">Ajouter Tâche</span>
    </router-link>

    


    <SidebarLink to="/profil" icon="fas fa-user">Profil</SidebarLink>
    <SidebarLink to="/trash" icon="fas fa-trash">Corbeille</SidebarLink>
    <SidebarLink to="/history" icon="fas fa-history">Historique</SidebarLink>

    <!-- Bouton de Déconnexion -->
    <button class="sidebar-button logout" @click="logout">
      <i class="fas fa-sign-out-alt icon"></i>
      <span v-if="!collapsed" class="text">Se Déconnecter</span>
    </button>

    <!-- Collapse Button -->
    <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
      <i class="fas fa-angle-double-left"></i>
    </span>
  </div>
</template>



<script>
import SidebarLink from './SidebarLink.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { collapsed, toggleSidebar, sidebarWidth, useSidebarResponsive} from '../state';

export default {
  components: { SidebarLink },
  data() {
    return {
      isDarkMode: false,
      isAddViewVisible: false, 
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      // Optionally, save the dark mode state to localStorage or a cookie
      localStorage.setItem('darkMode', this.isDarkMode);
    },
    
  //   goToAddView() {
  //   this.$router.push('/add'); // Cela ouvre la vue AddView
  // },
    goToTodoCalendar() {
      this.$router.push('/todo'); // Naviguer vers la page "Calendrier"
    }
  },
  setup() {
    useSidebarResponsive()
    const logo = require('@/assets/logo.png');
    const user = ref({}); // Déclaration de l'objet utilisateur

    // Fonction pour récupérer les infos utilisateur
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/private', { withCredentials: true });
        user.value = response.data.user;
      } catch (error) {
        alert('Accès non autorisé, veuillez vous reconnecter.');
        window.location.href = '/auth?mode=login';
      }
    };

    // Fonction de déconnexion
    const logout = async () => {
      try {
        await axios.get('http://localhost:3000/logout', { withCredentials: true });
        alert('Déconnecté avec succès !');
        window.location.href = '/';
      } catch (error) {
        alert('Erreur lors de la déconnexion.');
      }
    };

    onMounted(fetchUser);

    return { collapsed, toggleSidebar, sidebarWidth, logo, user,logout };
  },
};
</script>


<style scoped>
/* Default Light Mode */
.sidebar {
  background-color: #e4c1f9;
  color: #491784;
}

.dark-mode .sidebar {
  background-color:rgb(55, 54, 56);/* Dark background */
  color: #fff; /* Light text */
}

.sidebar .sidebar-button {
  background-color: #cb6ce6;
  color: #fff;
}
.dark-mode .ajout{
  background-color:hsl(268, 75%, 67%);
  
}
.dark-mode .ajout:hover{
  background-color:hsl(268, 35%, 48%);
}
.sidebar.dark .sidebar-button {
  background-color: #555; /* Dark button */
}

.sidebar .logout {
  background-color: #ff6f6f;
}

.dark-mode .logout {
  background-color: #dc5757; /* Dark logout button */
}
.dark-mode .logout:hover{
  background-color: #9f3c3c;
}

.sidebar .collapse-icon {
  color: #9755e1;
}

.sidebar.dark .collapse-icon {
  color: #9c9a9a; /* Light icon in dark mode */
}

.dark-mode .logo-link{
  color: #948dbc;
}
.sidebar {
  all: unset;
  width: var(--sidebar-width);
  background-color:  #e4c1f9;
  color: #491784;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 999; /* Make sure sidebar appears above other elements */
}
.sidebar.collapsed {
  z-index: 1000; /* Make sure sidebar appears above the header */
}

.sidebar-header {
  all: unset;
  display: flex;
  align-items: center;
}
.logo-link{
  text-decoration: none;
  display: flex;
  color: #491784;
  
}
.sidebar.collapsed .sidebar-header {
  margin-bottom: 2.2rem; /* Reduce margin when collapsed */
}


.logo {
  all: unset;
  width: 40px;
  height: 22px;
  margin-right: 0.5rem;
  margin-bottom: 7rem;
}

.sidebar.collapsed .logo {
  margin-bottom: 2.7rem; /* If the logo itself needs space */
}

.app-name {
  font-size: 1rem;
  font-weight: bold;
}

/* Welcome Message */
.welcome h4{
  font-size: 1.4rem;
  margin: 2.5rem 0;
}

.sidebar.collapsed .welcome {
  all: unset;
  display: none; /* Hide welcome message completely when collapsed */
  margin-bottom: 10rem;
}


.sidebar.collapsed .link.active {
  color: #fff; /* Change text color to white for contrast */
  font-weight: bold; /* Keep the font bold */
  background-color: hsl(268, 70%, 40%); /* Add a background color for active state */
  padding: 0.4rem; /* Add padding for better touch area */
  border-radius: 10%; /* Make the link circular */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */
  width: 70%;
}

.sidebar.collapsed .link.active:hover  {
    transform: translateY(-3px) scale(1.05); /* Lifts and scales slightly */

  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Adds shadow for depth */
}


/* Sidebar Buttons */
.sidebar-button {
  width: 100%;
  margin: 1rem 0; /* Space between buttons */
  padding: 0.5rem 1rem; /* Padding for better click area */
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex; /* Enable flexbox for alignment */
  align-items: center; /* Center align icon and text */
  justify-content: flex-start; /* Left-align content */
  gap: 0.5rem; /* Space between icon and text */
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

}

/* Button Icon */
.sidebar-button .icon {
  font-size: 1.2rem; 
  text-align: center;
  width: 25px; 
  color: inherit; 
}

/* Button Text */
.sidebar-button .text {
  font-size: 0.9rem; 
  color: inherit; 
}
.sidebar.collapsed .sidebar-button {
  justify-content: center; 
  text-align: center;
  display: flex;
  padding-right: 9px;
}

/* Ajout Button */
.ajout {
  background-color: #cb6ce6;
  color: #fff;
  text-decoration: none;

}

.ajout:hover {
  background-color: #a653bd;
  transform: translateY(-3px) scale(1.05); /* Lifts and scales slightly */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Adds shadow for depth */
}
.ajout:active {
  transform: translateY(0); /* Returns to original position */
  box-shadow: none; /* Removes shadow */
}
/* Button Icon Styling */
.sidebar-button .icon {
  width: 25px;
  margin-right: 8px;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}




/* Logout Button */
.logout {
  background-color: #ff6f6f;
  color: #fff;
}

.logout:hover {
  background-color: #e05353;
  transform: translateY(-3px) scale(1.05); /* Lifts and scales slightly */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Adds shadow for depth */
}

.logout:active {
  transform: translateY(0); /* Returns to original position */
  box-shadow: none; /* Removes shadow */
}
/* Sidebar Links */



/* Collapse Button */
.collapse-icon {
  margin-top: auto;
  align-self: center;
  cursor: pointer;
  font-size: 1.5rem; 
  color: #491784; 
  padding: 0.5rem;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.collapse-icon:hover {
  transform: scale(1.3); 
}

.collapse-icon:active {
  transform: scale(1); 
}

.rotate-180 {
  transform: rotate(180deg) scale(1.1); 
  transition: transform 0.4s ease, color 0.3s ease; 
}
</style>