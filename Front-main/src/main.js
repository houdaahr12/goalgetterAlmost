import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
// main.js or App.vue


loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
