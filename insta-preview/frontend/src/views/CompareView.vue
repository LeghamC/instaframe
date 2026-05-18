<template>
  <div class="compare-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Compare Layouts</h1>
        <p class="page-sub">View two sessions side-by-side to pick the best arrangement.</p>
      </div>
      <RouterLink to="/history" class="btn btn-ghost btn-sm">← Pick sessions</RouterLink>
    </div>

    <div v-if="sessions.length < 2" class="empty-cta">
      <div class="empty-icon">◫</div>
      <p>Select 2 sessions from History to compare them here.</p>
      <RouterLink to="/history" class="btn btn-primary" style="margin-top:16px;">Go to History →</RouterLink>
    </div>

    <div v-else class="compare-grid">
      <div v-for="(session, idx) in sessions" :key="session.id" class="compare-panel">
        <div class="panel-header">
          <div class="panel-badge">Session {{ idx + 1 }}</div>
          <div class="panel-name">{{ session.name }}</div>
          <div class="panel-handle">@{{ session.username }}</div>
          <div class="panel-layout-pick">
            <span class="section-label">Layout:</span>
            <select class="layout-select" v-model="layouts[idx]">
              <option value="grid3">Standard 3×3</option>
              <option value="checkerboard">Feature</option>
            </select>
          </div>
        </div>
        <div class="panel-device">
          <DeviceFrame :device="store.selectedDevice">
            <InstaProfile
              :session="session"
              :photos="photosBySession[idx]"
              :layout="layouts[idx]"
            />
          </DeviceFrame>
        </div>
        <div class="panel-footer">
          <RouterLink :to="`/preview/${session.id}`" class="btn btn-ghost btn-sm">Edit →</RouterLink>
          <span class="photo-count">{{ photosBySession[idx].length }} photos</span>
        </div>
      </div>
    </div>

    <!-- Device switcher for both -->
    <div v-if="sessions.length === 2" class="device-switcher">
      <span class="section-label">Both on:</span>
      <div class="device-pills">
        <button v-for="d in devices" :key="d.id"
                class="device-pill" :class="{ active: store.selectedDevice === d.id }"
                @click="store.setDevice(d.id)">
          {{ d.icon }} {{ d.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../store/index.js'
import DeviceFrame from '../components/DeviceFrame.vue'
import InstaProfile from '../components/InstaProfile.vue'
import axios from 'axios'

const store = useAppStore()
const photosA = ref([])
const photosB = ref([])
const layouts = ref(['grid3', 'grid3'])

const devices = [
  { id: 'iphone16pro', name: 'iPhone 16 Pro', icon: '📱' },
  { id: 'iphone16', name: 'iPhone 16', icon: '📱' },
  { id: 'samsungs24ultra', name: 'S24 Ultra', icon: '📲' },
  { id: 'pixel9pro', name: 'Pixel 9', icon: '📲' }
]

const sessions = computed(() =>
  store.compareSessionIds.map(id => store.sessions.find(s => s.id === id)).filter(Boolean)
)

const photosBySession = computed(() => [photosA.value, photosB.value])

onMounted(async () => {
  if (!store.sessions.length) await store.loadSessions()
  if (store.compareSessionIds[0]) {
    const { data } = await axios.get(`/api/photos/${store.compareSessionIds[0]}`)
    photosA.value = data
  }
  if (store.compareSessionIds[1]) {
    const { data } = await axios.get(`/api/photos/${store.compareSessionIds[1]}`)
    photosB.value = data
  }
})
</script>

<style scoped>
.compare-view { max-width: 1400px; margin: 0 auto; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 32px; gap: 16px;
}
.page-title { font-family: var(--font-display); font-size: 2rem; color: var(--accent); }
.page-sub { color: var(--text-muted); font-size: 14px; margin-top: 6px; }

.empty-cta { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.empty-icon { font-size: 56px; margin-bottom: 20px; opacity: 0.3; }

.compare-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
}

.compare-panel {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
  overflow: hidden;
}
.panel-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.panel-badge {
  background: var(--bg3); border: 1px solid var(--accent2);
  color: var(--accent2); font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
}
.panel-name { font-weight: 600; font-size: 14px; flex: 1; }
.panel-handle { color: var(--text-muted); font-size: 12px; }
.panel-layout-pick { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); }
.layout-select {
  background: var(--bg3); border: 1px solid var(--border); color: var(--text);
  border-radius: var(--radius-sm); padding: 4px 8px; font-size: 12px; outline: none; cursor: pointer;
}

.panel-device {
  padding: 20px; display: flex; justify-content: center;
  background: radial-gradient(ellipse, #1a1a1a, #0a0a0a);
}
.panel-footer {
  padding: 12px 20px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.photo-count { font-size: 12px; color: var(--text-dim); }

.device-switcher {
  margin-top: 32px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 16px 0; border-top: 1px solid var(--border);
}
.device-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.device-pill {
  padding: 6px 14px; border-radius: 100px;
  border: 1px solid var(--border); background: var(--bg2);
  color: var(--text-muted); font-size: 12px; cursor: pointer;
  transition: all var(--transition);
}
.device-pill:hover { border-color: var(--border-light); color: var(--text); }
.device-pill.active { border-color: var(--accent); color: var(--accent); background: rgba(232,213,176,0.08); }

@media (max-width: 900px) {
  .compare-grid { grid-template-columns: 1fr; }
}
</style>
