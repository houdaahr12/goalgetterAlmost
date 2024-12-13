<template>
  <div class="container-lg">
    <div class="text-center">
      <h1 class="display-5 title fw-bold mb-13">Pourquoi GoalGetter?</h1>
    </div>

    <div class="row my-5 align-items-end justify-content-center g-2">
      <!-- Première carte -->
      <div class="col-8 col-lg-6 d-flex">
        <div class="card border flex-fill">
          <div class="card-body text-center py-5">
            <h4 class="card-title fw-bold">Rester Organisé</h4>
            <img :src="require('@/assets/card1.png')" alt="features" class="img-ftrs my-4">
            <p class="card-text fs-5 mx-5 text-muted">
              Suivez l'avancement de vos tâches et restez organisé(e) sans effort. Priorisez ce qui compte le plus grâce à notre interface de liste de tâches intuitive.
            </p>
          </div>
        </div>
      </div>

      <!-- Deuxième carte -->
      <div class="col-8 col-lg-6 d-flex">
        <div class="card border flex-fill shorter-card">
          <div class="card-body text-center py-4">
            <h4 class="card-title fw-bold mt-3">Gérez Vos Priorités</h4>
            <p class="card-text fs-5 text-muted mt-3">
              Concentrez-vous sur ce qui est important et atteignez vos objectifs efficacement grâce à notre système de priorisation intégré.
            </p>
            <img :src="require('@/assets/card2.png')" alt="" class="img-ftrs-shorter"><br>

            <button class="btn explore mt-4">
              <i class="bi bi-arrow-right text-light"></i>
              Explorer Plus!
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeaturesView",
};
</script>

<style scoped>
.container-lg {
  margin: 0 auto 250px;
}

.title {
  color: hsl(268, 70%, 30%);
  margin-top: 70px;
}

.img-ftrs {
  object-fit: cover; /* L'image couvre entièrement l'espace de l'élément sans déformation */
  width: 50%; /* Assurez-vous que l'image occupe toute la largeur de son conteneur */
  height: auto; /* La hauteur de l'image sera proportionnelle à sa largeur */
}

.img-ftrs-shorter {
  object-fit: cover;
  width: 50%; /* Assurez-vous que l'image occupe toute la largeur de son conteneur */
  height: auto; /* Hauteur réduite pour la deuxième image */
}

.card {
  border-radius: 25px;
  background: hsl(0, 0%, 90%);
}

.explore {
  background: #491784;
  color: whitesmoke;
  border-radius: 15px;
  transition: transform 0.5s ease, color 0.5s ease, box-shadow 0.5s ease;
}

.explore:hover {
  background: hsl(268, 70%, 60%);
  color: black;
  transform: scale(1.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Ajoute une ombre au survol */
}

.card-title {
  color: #491784;
}
</style>
