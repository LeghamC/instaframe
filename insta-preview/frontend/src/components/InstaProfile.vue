<template>
  <div class="insta-profile">
    <!-- Status bar -->
    <div class="status-bar">
      <span class="status-time">{{ currentTime }}</span>
      <div class="status-icons">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path
            d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path
            d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
        </svg>
      </div>
    </div>

    <!-- Top bar -->
    <div class="insta-topbar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <div class="topbar-center">
        <span class="insta-handle">{{ session?.username || 'username' }}</span>
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style="opacity:0.6">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div class="topbar-right">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>
    </div>

    <!-- Profile header -->
    <div class="profile-header">
      <div class="profile-avatar-ring">
        <div class="profile-avatar" :style="session?.profilePic ? `background-image:url(${session.profilePic})` : ''">
          <span v-if="!session?.profilePic">{{ (session?.username || '?')[0].toUpperCase() }}</span>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat"><strong>{{ photos.length }}</strong><span>posts</span></div>
        <div class="stat"><strong>0</strong><span>followers</span></div>
        <div class="stat"><strong>0</strong><span>following</span></div>
      </div>
    </div>

    <!-- Bio -->
    <div class="profile-bio">
      <div class="profile-name">{{ session?.username || 'yourhandle' }}</div>
      <div class="profile-bio-text" v-if="session?.bio">{{ session.bio }}</div>
    </div>

    <!-- Buttons -->
    <div class="profile-buttons">
      <button class="insta-btn">Edit profile</button>
      <button class="insta-btn">Share profile</button>
      <button class="insta-btn insta-btn-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      </button>
    </div>

    <!-- Story highlights -->
    <div class="highlights-row">
      <div class="highlight-item">
        <div class="highlight-new">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <span>New</span>
      </div>
    </div>

    <!-- Grid tabs -->
    <div class="grid-tabs">
      <button class="grid-tab active">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
        </svg>
      </button>
      <button class="grid-tab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </button>
    </div>

    <!-- Photo grid -->
    <div class="photo-grid" :class="`layout-${layout}`">
      <div v-for="(photo, idx) in sortedPhotos" :key="photo.id" class="grid-item"
        :class="{ 'grid-item-featured': layout === 'checkerboard' && idx % 4 === 0 }">
        <img :src="photo.url" :alt="photo.caption || `Photo ${idx + 1}`" loading="lazy" />
        <!-- Reel icon for non-square feel -->
        <div class="grid-item-overlay">
          <div class="overlay-stats">
            <span>❤️ 0</span>
            <span>💬 0</span>
          </div>
        </div>
      </div>
      <!-- Empty placeholders -->
      <div v-for="n in emptySlots" :key="`empty-${n}`" class="grid-item grid-item-empty"></div>
    </div>

    <!-- Bottom nav -->
    <div class="insta-bottomnav">
      <!-- Home -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="26" height="26">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
      <!-- Search -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="26" height="26">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <!-- New post -->
      <div class="insta-plus-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <!-- Reels -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="26" height="26">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
      </svg>
      <!-- Profile -->
      <div class="insta-profile-thumb"
        :style="session?.profilePic ? `background-image:url(${session.profilePic})` : ''">
        <span v-if="!session?.profilePic">{{ (session?.username || '?')[0].toUpperCase() }}</span>
      </div>
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
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 30000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.insta-profile {
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100%;
  position: relative;
  padding-bottom: 70px;
  font-size: 14px;
  overflow-x: hidden;
}

/* Status bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  gap: 5px;
  align-items: center;
}

/* Top bar */
.insta-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px 10px;
}

.topbar-center {
  display: flex;
  align-items: center;
  gap: 3px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.insta-handle {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.topbar-right {
  display: flex;
  gap: 14px;
}

/* Profile header */
.profile-header {
  display: flex;
  align-items: center;
  padding: 10px 16px 12px;
  gap: 16px;
}

.profile-avatar-ring {
  padding: 2px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.profile-avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 3px solid #000;
  background: #262626;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
}

.profile-stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.stat strong {
  font-size: 17px;
  font-weight: 700;
}

.stat span {
  font-size: 12px;
  color: #f5f5f5;
}

/* Bio */
.profile-bio {
  padding: 0 16px 10px;
}

.profile-name {
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 2px;
}

.profile-bio-text {
  font-size: 13px;
  color: #f5f5f5;
  white-space: pre-line;
  line-height: 1.4;
}

/* Buttons */
.profile-buttons {
  display: flex;
  gap: 6px;
  padding: 0 14px 14px;
}

.insta-btn {
  flex: 1;
  background: #262626;
  color: #fff;
  border-radius: 10px;
  padding: 7px 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.insta-btn-icon {
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

/* Highlights */
.highlights-row {
  display: flex;
  gap: 18px;
  padding: 4px 14px 14px;
  overflow-x: auto;
}

.highlights-row::-webkit-scrollbar {
  display: none;
}

.highlight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.highlight-new {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.highlight-item span {
  font-size: 11px;
  color: #f5f5f5;
}

/* Grid tabs */
.grid-tabs {
  display: flex;
  border-top: 1px solid #262626;
}

.grid-tab {
  flex: 1;
  padding: 11px;
  display: flex;
  justify-content: center;
  color: #555;
  border-top: 1px solid transparent;
  margin-top: -1px;
  transition: all 0.15s;
  background: none;
  border-bottom: none;
}

.grid-tab.active {
  color: #fff;
  border-top-color: #fff;
}

/* Photo grid — no gap like real Instagram */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.grid-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #111;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.grid-item:hover img {
  transform: scale(1.04);
}

.grid-item-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
}

.grid-item:hover .grid-item-overlay {
  background: rgba(0, 0, 0, 0.35);
  opacity: 1;
}

.overlay-stats {
  display: flex;
  gap: 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

/* Checkerboard layout */
.layout-checkerboard .grid-item-featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Empty placeholders */
.grid-item-empty {
  background: #111;
}

/* Bottom nav */
.insta-bottomnav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  border-top: 1px solid #1c1c1c;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 8px 22px;
  z-index: 50;
}

.insta-plus-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insta-profile-thumb {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #333;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}
</style>
