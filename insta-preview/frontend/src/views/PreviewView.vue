<template>
  <div class="preview-view">
    <!-- Left panel: controls -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h2>Controls</h2>
        <button class="sidebar-close" @click="sidebarOpen = false">✕</button>
      </div>

      <!-- Session info -->
      <div class="sidebar-section">
        <div class="section-label">Session</div>
        <div class="session-badge">
          <div class="session-dot"></div>
          {{ store.currentSession?.name || 'No session' }}
        </div>
      </div>

      <!-- Device picker -->
      <div class="sidebar-section">
        <div class="section-label">Device Frame</div>
        <div class="device-picker">
          <button v-for="d in devices" :key="d.id"
                  class="device-opt" :class="{ active: store.selectedDevice === d.id }"
                  @click="store.setDevice(d.id)">
            <span class="device-icon">{{ d.icon }}</span>
            <span class="device-name">{{ d.name }}</span>
          </button>
        </div>
      </div>

      <!-- Layout picker -->
      <div class="sidebar-section">
        <div class="section-label">Grid Layout</div>
        <div class="layout-picker">
          <button v-for="l in layouts" :key="l.id"
                  class="layout-opt" :class="{ active: currentLayout === l.id }"
                  @click="currentLayout = l.id">
            <div class="layout-preview" :class="`lp-${l.id}`">
              <span v-for="n in 9" :key="n" :class="`lp-cell n${n}`"></span>
            </div>
            <span>{{ l.name }}</span>
          </button>
        </div>
      </div>

      <!-- Upload -->
      <div class="sidebar-section">
        <div class="section-label-row">
          <span class="section-label">Photos ({{ store.photos.length }})</span>
          <button v-if="store.photos.length > 0" class="btn-clear-all" @click="clearAll">
            Clear all
          </button>
        </div>
        <div class="upload-zone"
             :class="{ dragging }"
             @dragover.prevent="dragging = true"
             @dragleave="dragging = false"
             @drop.prevent="onDrop"
             @click="triggerUpload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Drop photos here</span>
          <span style="font-size:11px;color:var(--text-dim)">or click to browse</span>
          <input type="file" ref="fileInput" accept="image/*" multiple style="display:none" @change="onFileSelect" />
        </div>
        <div v-if="store.loading" class="upload-progress">
          <div class="progress-bar"><div class="progress-fill"></div></div>
          <span>Uploading…</span>
        </div>
      </div>

      <!-- Photos list -->
      <div class="sidebar-section" v-if="store.sortedPhotos.length > 0">
        <div class="section-label">Reorder & Edit</div>
        <div class="photos-list" ref="sortableEl">
          <div v-for="photo in store.sortedPhotos" :key="photo.id"
               class="photo-item" :data-id="photo.id">
            <div class="photo-drag-handle">⠿</div>
            <img :src="photo.url" class="photo-thumb" />
            <div class="photo-item-info">
              <input class="input input-xs" :value="photo.caption"
                     placeholder="Caption…"
                     @blur="store.updateCaption(photo.id, $event.target.value)" />
            </div>
            <button class="photo-delete" @click="store.deletePhoto(photo.id)">✕</button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Center: device preview -->
    <div class="preview-center">
      <div class="preview-topbar">
        <button class="btn btn-ghost btn-sm sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          Controls
        </button>
        <div class="device-label-badge">
          {{ devices.find(d => d.id === store.selectedDevice)?.name }}
        </div>
        <div class="preview-actions">
          <button class="btn btn-ghost btn-sm" @click="saveToHistory">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save
          </button>
        </div>
      </div>

      <div class="device-stage"
           :class="{ 'stage-dragging': stageDragging }"
           @dragover.prevent="stageDragging = true"
           @dragleave="stageDragging = false"
           @drop.prevent="onStageDrop">
        <DeviceFrame :device="store.selectedDevice">
          <InstaProfile
            :session="store.currentSession"
            :photos="store.sortedPhotos"
            :layout="currentLayout"
            @upload-click="triggerUpload"
          />
        </DeviceFrame>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../store/index.js'
import DeviceFrame from '../components/DeviceFrame.vue'
import InstaProfile from '../components/InstaProfile.vue'
import Sortable from 'sortablejs'

const store = useAppStore()
const route = useRoute()
const fileInput = ref(null)
const sortableEl = ref(null)
const dragging = ref(false)
const stageDragging = ref(false)
const sidebarOpen = ref(true)
const currentLayout = ref('grid3')

const devices = [
  { id: 'iphone16pro', name: 'iPhone 16 Pro', icon: '📱' },
  { id: 'iphone16', name: 'iPhone 16', icon: '📱' },
  { id: 'samsungs24ultra', name: 'Samsung S24 Ultra', icon: '📲' },
  { id: 'pixel9pro', name: 'Pixel 9 Pro', icon: '📲' }
]

const layouts = [
  { id: 'grid3', name: 'Standard' },
  { id: 'checkerboard', name: 'Feature' }
]

onMounted(async () => {
  const sessionId = route.params.sessionId
  store.currentSessionId = sessionId
  await store.loadPhotos(sessionId)
  if (!store.sessions.length) await store.loadSessions()
  await nextTick()
  initSortable()
  // Auto-close sidebar on mobile
  if (window.innerWidth < 900) sidebarOpen.value = false
})

function initSortable() {
  if (!sortableEl.value) return
  Sortable.create(sortableEl.value, {
    handle: '.photo-drag-handle',
    animation: 150,
    onEnd: async (evt) => {
      const items = sortableEl.value.querySelectorAll('[data-id]')
      const orderedIds = Array.from(items).map(el => el.dataset.id)
      await store.reorderPhotos(route.params.sessionId, orderedIds)
    }
  })
}

watch(() => store.photos.length, async () => {
  await nextTick()
  // Re-init if new photos added
})

function triggerUpload() { fileInput.value?.click() }

async function onFileSelect(e) {
  const files = Array.from(e.target.files)
  if (files.length) {
    await store.uploadPhotos(route.params.sessionId, files)
    await nextTick()
    initSortable()
  }
  e.target.value = ''
}

async function onDrop(e) {
  dragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length) {
    await store.uploadPhotos(route.params.sessionId, files)
    await nextTick()
    initSortable()
  }
}

async function onStageDrop(e) {
  stageDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length) {
    await store.uploadPhotos(route.params.sessionId, files)
    await nextTick()
    initSortable()
  }
}

async function clearAll() {
  if (!confirm('Remove all photos from this session?')) return
  await store.clearAllPhotos(route.params.sessionId)
}

function saveToHistory() {
  // Sessions are already persisted; just give feedback
  const toast = document.createElement('div')
  toast.textContent = '✓ Session saved!'
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#7af7b8;color:#000;padding:10px 24px;border-radius:100px;font-weight:600;font-size:14px;z-index:9999;transition:opacity 0.3s;'
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300) }, 2000)
}
</script>

<style scoped>
.preview-view {
  display: flex; gap: 0; min-height: calc(100vh - 60px);
  margin: -24px; overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 320px; flex-shrink: 0;
  background: var(--bg2); border-right: 1px solid var(--border);
  overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 4px;
  transition: transform var(--transition);
}
.sidebar-header {
  display: none; justify-content: space-between; align-items: center;
  padding-bottom: 16px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.sidebar-header h2 { font-size: 16px; font-weight: 600; }
.sidebar-close { color: var(--text-muted); font-size: 16px; padding: 4px; }

.sidebar-section { margin-bottom: 20px; }
.section-label-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.section-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim);
}
.btn-clear-all {
  font-size: 10px; font-weight: 600; color: var(--red, #f87171);
  background: none; border: none; cursor: pointer; padding: 2px 4px;
  opacity: 0.7; transition: opacity var(--transition);
}
.btn-clear-all:hover { opacity: 1; }

.session-badge {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: var(--text-muted);
}
.session-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }

/* Device picker */
.device-picker { display: flex; flex-direction: column; gap: 4px; }
.device-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: var(--radius-sm);
  font-size: 13px; color: var(--text-muted);
  border: 1px solid transparent; transition: all var(--transition);
  background: transparent; cursor: pointer;
}
.device-opt:hover { background: var(--bg3); color: var(--text); }
.device-opt.active { background: var(--bg3); border-color: var(--accent); color: var(--accent); }
.device-icon { font-size: 16px; }

/* Layout picker */
.layout-picker { display: flex; gap: 10px; }
.layout-opt {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 8px; border-radius: var(--radius-sm); font-size: 11px;
  color: var(--text-muted); border: 1px solid var(--border);
  transition: all var(--transition); cursor: pointer; background: var(--bg3);
}
.layout-opt:hover, .layout-opt.active { border-color: var(--accent); color: var(--accent); }
.layout-preview {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  width: 42px; height: 42px;
}
.lp-cell { background: var(--border-light); border-radius: 1px; }
.lp-checkerboard .n1 { grid-column: span 2; grid-row: span 2; background: var(--accent2); }

/* Upload zone */
.upload-zone {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  border: 2px dashed var(--border-light); border-radius: var(--radius);
  padding: 24px; cursor: pointer; transition: all var(--transition);
  color: var(--text-muted); font-size: 13px;
}
.upload-zone:hover, .upload-zone.dragging {
  border-color: var(--accent); color: var(--accent); background: rgba(232,213,176,0.04);
}
.upload-progress { display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 12px; color: var(--text-muted); }
.progress-bar { flex: 1; height: 4px; background: var(--bg3); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 2px; animation: fill 1.5s ease-in-out infinite; }
@keyframes fill { 0%{width:0%} 50%{width:80%} 100%{width:100%} }

/* Photos list */
.photos-list { display: flex; flex-direction: column; gap: 6px; max-height: 340px; overflow-y: auto; padding-right: 4px; }
.photo-item {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 6px 8px;
}
.photo-drag-handle { color: var(--text-dim); cursor: grab; font-size: 16px; flex-shrink: 0; }
.photo-thumb { width: 36px; height: 36px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
.photo-item-info { flex: 1; min-width: 0; }
.input-xs { font-size: 11px; padding: 4px 8px; }
.photo-delete {
  color: var(--text-dim); font-size: 12px; padding: 4px;
  transition: color var(--transition); flex-shrink: 0;
}
.photo-delete:hover { color: var(--red); }

/* Preview center */
.preview-center {
  flex: 1; display: flex; flex-direction: column;
  overflow: auto;
}
.preview-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; border-bottom: 1px solid var(--border);
  background: var(--bg2); gap: 12px;
  position: sticky; top: 0; z-index: 10;
}
.device-label-badge {
  font-size: 12px; font-weight: 600;
  background: var(--bg3); border: 1px solid var(--border);
  padding: 4px 12px; border-radius: 100px; color: var(--text-muted);
}
.sidebar-toggle { display: none; }

.device-stage {
  flex: 1; display: flex; justify-content: center;
  padding: 40px 24px;
  background: radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%);
  min-height: 600px;
  transition: background 0.2s;
}
.device-stage.stage-dragging {
  background: radial-gradient(ellipse at center, #1e2a1e 0%, #0a130a 70%);
  outline: 2px dashed var(--accent);
  outline-offset: -8px;
}

/* Responsive */
@media (max-width: 900px) {
  .preview-view { flex-direction: column; margin: -16px -12px; }
  .sidebar {
    position: fixed; top: 60px; left: 0; bottom: 0; z-index: 200;
    transform: translateX(-100%); width: 300px;
    box-shadow: var(--shadow-lg);
  }
  .sidebar-open { transform: translateX(0); }
  .sidebar-header { display: flex; }
  .sidebar-toggle { display: flex; }
  .preview-center { min-height: calc(100vh - 60px); }
  .device-stage { padding: 20px 12px; }
}
</style>
