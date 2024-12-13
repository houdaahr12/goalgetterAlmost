<template>
    <v-container style="padding-bottom: 180px;">
      <v-row>
        <v-col cols="12">
          <v-card class="elevation-2 " >
            <v-card-title>
              <h2>Conditions d'utilisation</h2>
            </v-card-title>
            <v-card-text>
              <p><strong>Introduction</strong></p>
              <p>
                Ces conditions d'utilisation ("Conditions") régissent votre utilisation de notre site web et de nos services ("Service").
                En accédant ou en utilisant le Service, vous acceptez de respecter ces Conditions. Si vous n'êtes pas d'accord avec ces Conditions,
                veuillez ne pas utiliser le Service.
              </p>
  
              <p><strong>1. Responsabilités de l'utilisateur</strong></p>
              <p>
                En tant qu'utilisateur du Service, vous acceptez de l'utiliser conformément aux lois, règles et règlements applicables. 
                Vous vous engagez à ne pas participer à des activités illégales, y compris mais sans s'y limiter, le spam, le piratage ou les activités frauduleuses.
              </p>
  
              <p><strong>2. Sécurité du compte</strong></p>
              <p>
                Vous êtes responsable de la confidentialité de vos informations de compte, y compris votre nom d'utilisateur et votre mot de passe.
                Vous devez nous informer immédiatement si vous suspectez un accès non autorisé à votre compte.
              </p>
  
              <p><strong>3. Résiliation du service</strong></p>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre accès au Service à tout moment en cas de violation de ces Conditions ou pour toute autre raison.
              </p>
  
              <p><strong>4. Limitation de responsabilité</strong></p>
              <p>
                Notre responsabilité pour toute réclamation liée au Service est limitée dans la mesure maximale autorisée par la loi.
              </p>
  
              <p><strong>5. Modifications des conditions</strong></p>
              <p>
                Nous pouvons mettre à jour ces Conditions de temps à autre. Toute modification sera publiée sur cette page, et votre utilisation continue du Service
                constituera votre acceptation des Conditions mises à jour.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "UserTerms",
  };
  </script>
  
  <style scoped>
  /* Ajoute ton style personnalisé pour la page des conditions */
  v-card {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
    margin-bottom: 60px; 
  }
  </style>
  