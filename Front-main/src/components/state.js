import { ref, computed, onMounted, onUnmounted } from 'vue'

// State for sidebar collapse
export const collapsed = ref(false)

// Function to toggle the sidebar manually
export const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

// Constants for sidebar width
export const SIDEBAR_WIDTH = 180
export const SIDEBAR_WIDTH_COLLAPSED = 38

// Computed property for the sidebar width based on the collapse state
export const sidebarWidth = computed(
  () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`
)

// Responsive behavior
export const isSmallScreen = ref(false)

// Function to detect screen size and auto-collapse on smaller screens
const updateScreenSize = () => {
  const SMALL_SCREEN_WIDTH = 768 // Define the breakpoint
  isSmallScreen.value = window.innerWidth < SMALL_SCREEN_WIDTH

  // Auto-collapse sidebar on small screens
  if (isSmallScreen.value) {
    collapsed.value = true
  } else if (!collapsed.value) {
    // Ensure sidebar is expanded on larger screens unless manually toggled
    collapsed.value = false
  }
}

// Hook to listen to screen resizing
const setupResponsiveBehavior = () => {
  updateScreenSize() // Initial screen size check
  window.addEventListener('resize', updateScreenSize) // Listen to resize events
}

// Cleanup function to remove event listeners
const cleanupResponsiveBehavior = () => {
  window.removeEventListener('resize', updateScreenSize)
}

// Export lifecycle hooks for components to use if necessary
export const useSidebarResponsive = () => {
  onMounted(setupResponsiveBehavior)
  onUnmounted(cleanupResponsiveBehavior)
}
