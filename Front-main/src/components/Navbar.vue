<template>
  <header>
    <nav class="navbar navbar-expand-lg px-4 mb-5">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img :src="require('@/assets/logo.png')" alt="GoalGetter logo" width="45" height="24">
          <span>GoalGetter</span>
        </a>

        <!-- Toggler -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Navigation Links -->
          <ul class="navbar-nav mx-auto text-center">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact-active-class="active">Accueil</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" exact-active-class="active">A Propos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link" exact-active-class="active">Contact</router-link>
            </li>
          </ul>

          <!-- Buttons and Dark Mode Toggle -->
          <div class="d-flex mt-2 mt-md-0 justify-content-center align-items-center">
            <!-- Dark Mode Toggle Icon -->
            <div class="dark-mode-toggle me-3">
              <i 
                class="fas" 
                :class="darkMode ? 'fa-sun' : 'fa-moon'" 
                @click="toggleDarkMode"
                style="cursor: pointer; font-size: 20px; color: hsl(268, 70%, 30%);"
              ></i>
            </div>

            <!-- Buttons -->
            <router-link to="/auth?mode=login" class="btn me-3 login">Se connecter</router-link>
            <router-link to="/auth?mode=signup" class="btn start">Démarrez Maintenant</router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "NavbarView",
  data() {
    return {
      darkMode: false, // Track dark mode state
    };
  },
  created() {
    // Check if dark mode is already set in localStorage
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.darkMode = true;
      document.body.classList.add("dark-mode");
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  background: #cccccc;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.navbar-brand span {
  font-weight: bold;
  font-size: 16px;
  color: hsl(268, 70%, 30%);
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: hsl(268, 70%, 30%);
}

.nav-link:hover {
  color: hsl(268, 70%, 60%);
  transform: scale(1.1);
}

.nav-link.active {
  color: #42204b !important;
  font-weight: bold;
}

button {
  font-size: 14px;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.start {
  background-color: hsl(268, 70%, 30%);
  color: whitesmoke;
  transition: 0.3s;
}

.start:hover {
  background-color: hsl(268, 70%, 50%);

  transform: scale(1.06);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.login {
  background: hsl(0, 0%, 65%);
  transition: 0.3s;
}

.login:hover {
  transform: scale(1.1);
  background: hsl(0, 0%, 35%);
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dark Mode styles */
body.dark-mode {
  background-color: #8d8080;
  color: #e0e0e0;
}

body.dark-mode .navbar {
  background-color: #333;
}
body.dark-mode .nav-link {
  color: #e0e0e0;
}

body.dark-mode .nav-link:hover {
  color: #9b67c8;
}

body.dark-mode .start {
  background-color:  hsl(267, 34%, 55%);
}

body.dark-mode .start:hover {
  background-color: #8a24b0;
}
body.dark-mode .navbar-brand span {
  font-weight: bold;
  font-size: 16px;
  color: hsl(267, 34%, 55%);
}
body.dark-mode .nav-link.active {
  color:  hsl(267, 34%, 55%)!important;
  font-weight: bold;
}
body.dark-mode i {
  color:  hsl(267, 34%, 55%)!important;
}
</style>