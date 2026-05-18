<template>
  <div class="insta-profile">
    <!-- Status bar -->
    <div class="status-bar">
      <span class="status-time">{{ currentTime }}</span>
      <div class="status-icons">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
      </div>
    </div>

    <!-- Top bar -->
    <div class="insta-topbar">
      <div class="insta-handle-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="insta-handle">{{ session?.username || 'username' }}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      </div>
    </div>

    <!-- Profile header -->
    <div class="profile-header">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar-ring">
          <div class="profile-avatar" :style="session?.profilePic ? `background-image:url(${session.profilePic})` : ''">
            <span v-if="!session?.profilePic">{{ (session?.username || '?')[0].toUpperCase() }}</span>
          </div>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat"><strong>{{ photos.length }}</strong><span>posts</span></div>
        <div class="stat"><strong>0</strong><span>followers</span></div>
        <div class="stat"><strong>0</strong><span>following</span></div>
      </div>
    </div>

    <div class="profile-bio">
      <div class="profile-name">{{ session?.username || 'yourhandle' }}</div>
      <div class="profile-bio-text">{{ session?.bio || '' }}</div>
    </div>

    <div class="profile-buttons">
      <button class="insta-btn">Edit profile</button>
      <button class="insta-btn">Share profile</button>
      <button class="insta-btn insta-btn-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      </button>
    </div>

    <!-- Story highlights (placeholder) -->
    <div class="highlights-row">
      <div class="highlight-item">
        <div class="highlight-circle">+</div>
        <span>New</span>
      </div>
    </div>

    <!-- Grid tabs -->
    <div class="grid-tabs">
      <button class="grid-tab active">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      </button>
      <button class="grid-tab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
      </button>
      <button class="grid-tab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>
    </div>

    <!-- Photo grid -->
    <div class="photo-grid" :class="`layout-${layout}`">
      <div v-for="(photo, idx) in sortedPhotos" :key="photo.id"
           class="grid-item"
           :class="{ 'grid-item-featured': layout === 'checkerboard' && idx % 4 === 0 }">
        <img :src="photo.url" :alt="photo.caption || `Photo ${idx + 1}`" loading="lazy" />
        <div class="grid-item-overlay">
          <div class="overlay-stats">
            <span>♥ 0</span>
            <span>💬 0</span>
          </div>
        </div>
      </div>
      <!-- Empty placeholders -->
      <div v-for="n in emptySlots" :key="`empty-${n}`" class="grid-item grid-item-empty">
        <div class="empty-slot">+</div>
      </div>
    </div>

    <!-- Bottom nav bar -->
    <div class="insta-bottomnav">
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <div class="insta-plus-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22"><path d="M12 5v14M5 12h14"/></svg>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      <div class="insta-profile-thumb" :style="session?.profilePic ? `background-image:url(${session.profilePic})` : ''"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  session: Object,
  photos: { type: Array, default: () => [] },
  layout: { type: String, default: 'grid3' }
})

const sortedPhotos = computed(() => [...props.photos].sort((a, b) => a.position - b.position))

const emptySlots = computed(() => {
  const count = sortedPhotos.value.length
  const row = count % 3
  return row === 0 ? 0 : 3 - row
})

const currentTime = ref('')
let timer = null
function updateTime() {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 30000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.insta-profile {
  background: #000; color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100%; position: relative;
  padding-bottom: 70px;
  font-size: 14px;
}

/* Status bar */
.status-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 20px; font-size: 12px; font-weight: 600;
}
.status-icons { display: flex; gap: 6px; align-items: center; }

/* Top bar */
.insta-topbar { padding: 4px 16px 8px; }
.insta-handle-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px;
}
.insta-handle { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; flex: 1; text-align: center; }

/* Profile header */
.profile-header {
  display: flex; align-items: center; padding: 8px 16px;
  gap: 20px;
}
.profile-avatar-ring {
  padding: 2px; border-radius: 50%;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}
.profile-avatar {
  width: 76px; height: 76px; border-radius: 50%;
  border: 3px solid #000;
  background: #333; background-size: cover; background-position: center;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 700; color: #fff;
}
.profile-stats {
  display: flex; gap: 8px; flex: 1; justify-content: space-around;
}
.stat {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.stat strong { font-size: 16px; font-weight: 700; }
.stat span { font-size: 12px; color: #aaa; }

/* Bio */
.profile-bio { padding: 4px 16px 10px; }
.profile-name { font-weight: 700; font-size: 13px; }
.profile-bio-text { font-size: 12px; color: #ccc; margin-top: 2px; white-space: pre-line; }

/* Buttons */
.profile-buttons { display: flex; gap: 6px; padding: 0 16px 14px; }
.insta-btn {
  flex: 1; background: #262626; color: #fff; border-radius: 8px;
  padding: 7px 8px; font-size: 13px; font-weight: 600;
  border: none; cursor: pointer; text-align: center;
}
.insta-btn-icon { flex: 0 0 36px; display: flex; align-items: center; justify-content: center; }

/* Highlights */
.highlights-row {
  display: flex; gap: 16px; padding: 0 16px 16px; overflow-x: auto;
}
.highlights-row::-webkit-scrollbar { display: none; }
.highlight-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.highlight-circle {
  width: 60px; height: 60px; border-radius: 50%;
  border: 1px solid #444;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #888;
}
.highlight-item span { font-size: 11px; color: #aaa; }

/* Tabs */
.grid-tabs {
  display: flex; border-top: 1px solid #262626;
  border-bottom: 1px solid #262626;
}
.grid-tab {
  flex: 1; padding: 10px; display: flex; justify-content: center;
  color: #888; border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.grid-tab.active { color: #fff; border-color: #fff; }

/* Photo grid */
.photo-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
}
.grid-item { position: relative; aspect-ratio: 1; overflow: hidden; background: #111; }
.grid-item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s;
  display: block;
}
.grid-item:hover img { transform: scale(1.05); }
.grid-item-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.2s;
}
.grid-item:hover .grid-item-overlay { background: rgba(0,0,0,0.4); opacity: 1; }
.overlay-stats { display: flex; gap: 16px; color: #fff; font-size: 12px; font-weight: 700; }

/* Checkerboard layout */
.layout-checkerboard .grid-item-featured {
  grid-column: span 2; grid-row: span 2;
}

/* Empty slots */
.grid-item-empty { background: #0a0a0a; }
.empty-slot {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: #333; font-size: 24px;
}

/* Bottom nav */
.insta-bottomnav {
  position: sticky; bottom: 0; left: 0; right: 0;
  background: #000; border-top: 1px solid #1a1a1a;
  display: flex; justify-content: space-around; align-items: center;
  padding: 10px 16px 20px; z-index: 50;
}
.insta-plus-btn {
  width: 38px; height: 38px; border-radius: 10px; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
}
.insta-profile-thumb {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid #fff;
  background: #333; background-size: cover; background-position: center;
}
</style>
