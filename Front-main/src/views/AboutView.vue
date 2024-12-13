<template>
  <div class="about">
    <h1 class="display-4 mt-5 mt-md-3 text-center title fw-bold mb-8 mb-md-0">À Propos</h1>
    <div class="container-fluid">
      <div class="row justify-content-center align-items-center">
        
        <div class="col-md-5 d-none d-md-block">
              <img :src="require('@/assets/apropos.png')" alt="contact" class="img-fluid d-none d-md-block" title="GoalGetter todolist">
        </div>

        <div class="col-md-5 text-center text-md-start">
          <p class="lead">
            Nous savons à quel point il peut être difficile de jongler entre plusieurs tâches importantes au quotidien. C’est pour cela que GoalGetter a été conçu pour vous aider à prioriser vos actions et suivre vos progrès.
          </p>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.title {
  color: hsl(268, 70%, 30%);
  font-size: 2rem;
}

.lead {
  color: hsl(268, 70%, 30%);
}

.features h2 {
  color: hsl(268, 70%, 30%);
}
img{
  width: 600px;
  height: 300px;
}




</style>