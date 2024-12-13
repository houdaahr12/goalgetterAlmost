<template>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8">
          <v-card class="elevation-6">
            <v-card-text>
              <h2 class="text-center mb-4">Bienvenue, {{ user.name }} {{ user.surname }} !</h2>
              <p class="text-center">
                Vous êtes dans votre espace privé. Gérez vos tâches et objectifs ici.
              </p>
              <v-btn color="hsl(268, 70%, 30%)" dark block @click="logout">Se déconnecter</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>

  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const user = ref({});
  
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/private", { withCredentials: true });
      user.value = response.data.user;
    } catch (error) {
      alert("Accès non autorisé, veuillez vous reconnecter.");
      window.location.href = "/auth?mode=login";
    }
  };
  
  onMounted(fetchUser);
  
  // Fonction de déconnexion
  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/logout", { withCredentials: true });
      alert("Déconnecté avec succès !");
      window.location.href = "/";
    } catch (error) {
      alert("Erreur lors de la déconnexion.");
    }
  };
  </script>
  