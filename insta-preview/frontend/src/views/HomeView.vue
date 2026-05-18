<template>
  <div class="home">
    <div class="home-header">
      <div>
        <h1 class="title">Your Sessions</h1>
        <p class="subtitle">Create a new session to preview your Instagram profile layout before posting.</p>
      </div>
      <button class="btn btn-primary" @click="showCreate = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>
        New Session
      </button>
    </div>

    <!-- Create session modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
          <div class="modal">
            <h2 class="modal-title">New Preview Session</h2>
            <p class="modal-sub">Set up your mock account info</p>
            <div class="form-group">
              <label>Session Name</label>
              <input class="input" v-model="form.name" placeholder="e.g. Portfolio – Dark Feed" />
            </div>
            <div class="form-group">
              <label>Instagram Handle</label>
              <div class="input-prefix">
                <span>@</span>
                <input class="input" v-model="form.username" placeholder="yourhandle" />
              </div>
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea class="input" v-model="form.bio" rows="3" placeholder="📸 Photographer · Paris" style="resize:vertical"></textarea>
            </div>
            <div class="form-group">
              <label>Profile Picture</label>
              <div class="avatar-upload" @click="triggerAvatarUpload">
                <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" />
                <div v-else class="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Click to upload</span>
                </div>
              </div>
              <input type="file" ref="avatarInput" accept="image/*" style="display:none" @change="onAvatarChange" />
            </div>
            <div class="modal-actions">
              <button class="btn btn-ghost" @click="showCreate = false">Cancel</button>
              <button class="btn btn-primary" @click="createSession" :disabled="!form.name">Create →</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Sessions grid -->
    <div v-if="store.sessions.length === 0" class="empty-state">
      <div class="empty-icon">◈</div>
      <p>No sessions yet. Create your first preview!</p>
    </div>

    <div v-else class="sessions-grid">
      <div v-for="session in store.sessions" :key="session.id" class="session-card">
        <div class="session-card-top">
          <div class="session-avatar" :style="session.profilePic ? `background-image:url(${session.profilePic})` : ''">
            <span v-if="!session.profilePic">{{ (session.username || '?')[0].toUpperCase() }}</span>
          </div>
          <div class="session-info">
            <div class="session-name">{{ session.name }}</div>
            <div class="session-handle">@{{ session.username }}</div>
            <div class="session-date">{{ formatDate(session.createdAt) }}</div>
          </div>
        </div>
        <div class="session-actions">
          <RouterLink :to="`/preview/${session.id}`" class="btn btn-primary btn-sm">
            Open →
          </RouterLink>
          <button class="btn btn-danger btn-sm" @click="deleteSession(session.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAppStore } from '../store/index.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()
const showCreate = ref(false)
const avatarInput = ref(null)
const avatarPreview = ref('')
const avatarFile = ref(null)

const form = reactive({ name: '', username: '', bio: '' })

function triggerAvatarUpload() { avatarInput.value?.click() }

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function createSession() {
  let profilePic = ''
  if (avatarFile.value) {
    profilePic = await store.uploadProfilePic(avatarFile.value)
  }
  const session = await store.createSession({ ...form, profilePic })
  showCreate.value = false
  form.name = ''; form.username = ''; form.bio = ''
  avatarPreview.value = ''; avatarFile.value = null
  router.push(`/preview/${session.id}`)
}

async function deleteSession(id) {
  if (confirm('Delete this session and all its photos?')) {
    await store.deleteSession(id)
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.home { max-width: 900px; margin: 0 auto; }
.home-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 32px; gap: 16px;
}
.title { font-family: var(--font-display); font-size: 2rem; color: var(--accent); line-height: 1.1; }
.subtitle { color: var(--text-muted); font-size: 14px; margin-top: 6px; max-width: 360px; }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 999;
  padding: 20px;
}
.modal {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 32px; width: 100%; max-width: 480px;
  box-shadow: var(--shadow-lg);
}
.modal-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--accent); margin-bottom: 4px; }
.modal-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
.input-prefix { display: flex; align-items: center; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
.input-prefix span { padding: 10px 12px; color: var(--text-muted); font-size: 14px; }
.input-prefix .input { border: none; border-radius: 0; padding-left: 0; }
.avatar-upload { cursor: pointer; }
.avatar-preview { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); }
.avatar-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  width: 80px; height: 80px; border-radius: 50%; border: 2px dashed var(--border-light);
  color: var(--text-dim); font-size: 11px;
  transition: all var(--transition);
}
.avatar-placeholder:hover { border-color: var(--accent); color: var(--accent); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

/* Empty state */
.empty-state {
  text-align: center; padding: 80px 20px; color: var(--text-muted);
}
.empty-icon { font-size: 48px; color: var(--accent2); margin-bottom: 16px; opacity: 0.4; }

/* Sessions grid */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.session-card {
  background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 20px; transition: all var(--transition);
  display: flex; flex-direction: column; gap: 16px;
}
.session-card:hover { border-color: var(--border-light); transform: translateY(-2px); box-shadow: var(--shadow); }
.session-card-top { display: flex; align-items: center; gap: 14px; }
.session-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--bg3); border: 2px solid var(--accent2);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 18px; color: var(--accent);
  background-size: cover; background-position: center; flex-shrink: 0;
}
.session-name { font-weight: 600; font-size: 15px; }
.session-handle { color: var(--text-muted); font-size: 12px; }
.session-date { color: var(--text-dim); font-size: 11px; margin-top: 2px; }
.session-actions { display: flex; gap: 8px; }
</style>
