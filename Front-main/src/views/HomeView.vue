<template>
  <div class="home">
    <!-- Hero Content (now using div instead of section) -->
    <div class="hero d-flex align-items-center justify-content-between px-5">
      <div class="container-fluid">
        <div class="row align-items-center">

          <div class="col-12 col-md-6 text-center text-md-start mb-md-5">
            <div class="hero-text">
              <h1 class="display-5 fw-bold quote text-center text-md-start mt-12 mt-md-0">
                Planifiez votre journée,<br>Accomplissez plus!
              </h1>
              <p class="fs-5 desc mt-7 mt-md-3">
                Conçu pour vous aider à prioriser vos tâches, afin que vous puissiez vous concentrer sur ce qui vous fait avancer !
              </p>

              <!-- Bouton -->
              <router-link to="/auth?mode=signup" class="custom-btn btn btn-lg mt-3 start">Démarrez maintenant</router-link>
            </div>
          </div>

          <div class="col-12 col-md-6 text-center">
            <div class="hero-image">
              <img :src="require('@/assets/hero.png')" alt="Illustration" class="img-fluid d-none d-md-block" title="GoalGetter todolist">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Component -->
    <Features />
  </div>
</template>

<script>
import Features from '../components/Features.vue';


export default {  
  name: 'HomeView',
  components: { Features, }
}


</script>

<style scoped>
.quote {
  color: hsl(268, 70%, 30%);
  text-align: start;
}

.desc {
  color: hsl(268, 70%, 30%);
  text-align: start;
}

.custom-btn {
  background: #491784;
  color: white;
  display: inline-block;
  padding: 12px 20px;
  border-radius: 5px;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
  font-size: 16px;
  border: none;
  text-align: center;
}

.custom-btn:hover {
  background: #613c8b;
  transform: scale(1.1);
  cursor: pointer;
}

.hero-image img {
  margin-left: 30px;
}

.start {
  background-color: hsl(268, 70%, 30%);
  color: whitesmoke;
}

.start:hover {
  background-color: hsl(268, 70%, 50%);
  color: black;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>