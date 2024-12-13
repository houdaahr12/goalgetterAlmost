<template>
  <router-link :to="to" class="link" :class="{ active: isActive }">
    <i class="icon" :class="icon" />
    <transition name="fade">
      <span v-if="!collapsed">
        <slot />
      </span>
    </transition>
  </router-link>
</template>


<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collapsed } from '../state'

export default {
  props: {
    to: { type: String, required: true },
    icon: { type: String, required: true }
  },
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive, collapsed }
  }
}
</script>



<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;   
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.link {
  display: flex;
  align-items: center;

  cursor: pointer;
  position: relative;
  font-weight: 400;
  user-select: none;

  margin: 0.5em 0;
  padding: 0.4em;
  border-radius: 0.25em;
  height: 1.5em;

  color: #491784;
  text-decoration: none;

  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;



}

.link:hover {
  color: hsl(268, 70%, 60%);
  transform: translateY(-3px) scale(1.05); /* Lifts and scales slightly */

}

.link.active {
  color: hsl(268, 70%, 20%); /* A bold and rich purple for active text */
  font-weight: bold; /* Make the text stand out */
  border-bottom: 2px solid hsl(268, 70%, 30%); /* A solid underline for emphasis */
  padding-bottom: 10px; /* Add space to accommodate the border */
  transform: translateY(0); /* Returns to original position */
  box-shadow: none;
}




.link .icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 10px;
}
.dark-mode .link{
  color:rgba(209, 209, 209, 0.858);
  transition: 0.3s;
}
.dark-mode .link.active{
  border-bottom: 2px solid hsl(268, 75%, 67%); /* A solid underline for emphasis */
  
}
.dark-mode .link:hover{
  color: hsl(268, 75%, 67%);
}
</style>