<template>
  <div id="app-shell">
    <NavBar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { useAppStore } from './store/index.js'
import { onMounted } from 'vue'

const store = useAppStore()
onMounted(() => store.loadSessions())
</script>

<style>
#app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
@media (max-width: 768px) {
  .main-content { padding: 16px 12px; }
}
</style>
