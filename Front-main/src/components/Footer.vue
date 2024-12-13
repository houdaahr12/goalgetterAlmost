<template>
  <v-footer :class="{ 'dark-mode': darkMode }">
    <div class="foot">
      <div class="container-fluid">
        <!-- Icons -->
        <div class="social-media">
          <a href="#" class="icon fs-2 me-3"><i class="bi bi-facebook"></i></a>
          <a href="#" class="icon fs-2 me-3"><i class="bi bi-pinterest"></i></a>
          <a href="#" class="icon fs-2 me-3"><i class="bi bi-instagram"></i></a>
          <a href="#" class="icon fs-2"><i class="bi bi-linkedin"></i></a>
        </div>

        <hr>

        <!-- Links -->
        <div class="footer-links">
          <p class="mb-0">2024 © GoalGetter. Tous droits réservés.</p>
          <p>
            <router-link to="/UserTerms" class="terms-link">Politique de confidentialité </router-link>
          </p> 
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "FooterView",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.foot {
  background-color: #cccccc;
  padding-top: 10px;
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-media a {
  color: #491784;
  text-decoration: none;
}

.social-media a:hover {
  color: #823aa0;
}

.footer-links {
  justify-content: center;
  gap: 10px;
}

.footer-links a {
  color: #491784;
  text-decoration: none;
}

.footer-links a:hover {
  color: #823aa0;
}

hr {
  margin: 15px 0;
  border: 1px solid #491784;
}

.foot {
  background-color: #cccccc;
  padding-top: 10px;
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-media a {
  color: #491784;
  text-decoration: none;
}

.social-media a:hover {
  color: #823aa0;
}

.footer-links {
  justify-content: center;
  gap: 10px;
}

.footer-links a {
  color: #491784;
  text-decoration: none;
}

.footer-links a:hover {
  color: #823aa0;
}

hr {
  margin: 15px 0;
  border: 1px solid #491784;
}

/* Dark mode styles */
.dark-mode .foot {
  background-color: #333;
  color: #e0e0e0;
}

.dark-mode .social-media a {
  color: #d3d3d3;
}

.dark-mode .social-media a:hover {
  color: hsl(267, 34%, 55%)
}

.dark-mode .footer-links a {
  color: #d3d3d3;
}

.dark-mode .footer-links a:hover {
  color: hsl(267, 34%, 55%)
}

.dark-mode hr {
  border-color: hsl(267, 34%, 55%)
}


</style>
