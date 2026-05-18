<template>
  <div class="history-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Session History</h1>
        <p class="page-sub">All your preview sessions. Open, compare, or delete them.</p>
      </div>
      <RouterLink to="/" class="btn btn-primary">+ New Session</RouterLink>
    </div>

    <div v-if="!store.sessions.length" class="empty-state">
      <div class="empty-icon">⏱</div>
      <p>No sessions yet. Create your first preview from the home page!</p>
    </div>

    <div class="history-table" v-else>
      <div class="table-head">
        <span>Session</span>
        <span>Handle</span>
        <span>Created</span>
        <span>Compare</span>
        <span>Actions</span>
      </div>
      <div v-for="session in store.sessions" :key="session.id" class="table-row">
        <div class="row-name">
          <div class="row-avatar" :style="session.profilePic ? `background-image:url(${session.profilePic})` : ''">
            {{ session.profilePic ? '' : session.username?.[0]?.toUpperCase() }}
          </div>
          <div>
            <div class="name-text">{{ session.name }}</div>
            <div class="bio-preview">{{ session.bio || '—' }}</div>
          </div>
        </div>
        <div class="row-handle">@{{ session.username }}</div>
        <div class="row-date">{{ formatDate(session.createdAt) }}</div>
        <div class="row-compare">
          <button class="compare-toggle"
                  :class="{ selected: store.compareSessionIds.includes(session.id) }"
                  @click="store.toggleCompareSession(session.id)"
                  :disabled="!store.compareSessionIds.includes(session.id) && store.compareSessionIds.length >= 2">
            {{ store.compareSessionIds.includes(session.id) ? '✓' : '+' }}
          </button>
        </div>
        <div class="row-actions">
          <RouterLink :to="`/preview/${session.id}`" class="btn btn-ghost btn-sm">Open</RouterLink>
          <button class="btn btn-danger btn-sm" @click="del(session.id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Compare CTA -->
    <Transition name="fade">
      <div v-if="store.compareSessionIds.length === 2" class="compare-cta">
        <span>2 sessions selected</span>
        <RouterLink to="/compare" class="btn btn-primary btn-sm">Compare side-by-side →</RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useAppStore } from '../store/index.js'

const store = useAppStore()

async function del(id) {
  if (confirm('Delete this session?')) await store.deleteSession(id)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.history-view { max-width: 900px; margin: 0 auto; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 32px; gap: 16px;
}
.page-title { font-family: var(--font-display); font-size: 2rem; color: var(--accent); }
.page-sub { color: var(--text-muted); font-size: 14px; margin-top: 6px; }

.empty-state { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }

.history-table { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.table-head {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 60px 160px;
  gap: 12px; padding: 10px 16px;
  background: var(--bg3); font-size: 11px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim);
}
.table-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 60px 160px;
  gap: 12px; padding: 14px 16px; align-items: center;
  border-top: 1px solid var(--border);
  transition: background var(--transition);
}
.table-row:hover { background: var(--bg2); }

.row-name { display: flex; align-items: center; gap: 12px; }
.row-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg3); border: 1px solid var(--accent2);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; color: var(--accent);
  background-size: cover; background-position: center; flex-shrink: 0;
}
.name-text { font-size: 14px; font-weight: 500; }
.bio-preview { font-size: 11px; color: var(--text-dim); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-handle { font-size: 13px; color: var(--text-muted); }
.row-date { font-size: 12px; color: var(--text-dim); }
.row-compare { display: flex; justify-content: center; }
.compare-toggle {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid var(--border-light); background: var(--bg3);
  color: var(--text-muted); font-size: 14px;
  transition: all var(--transition); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.compare-toggle:hover { border-color: var(--accent); color: var(--accent); }
.compare-toggle.selected { background: var(--accent); color: #000; border-color: var(--accent); }
.compare-toggle:disabled:not(.selected) { opacity: 0.3; cursor: not-allowed; }
.row-actions { display: flex; gap: 6px; }

.compare-cta {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 16px;
  background: var(--bg2); border: 1px solid var(--accent);
  border-radius: 100px; padding: 10px 20px;
  box-shadow: var(--shadow-lg); font-size: 14px; font-weight: 500;
  z-index: 100;
}

@media (max-width: 700px) {
  .table-head, .table-row { grid-template-columns: 1fr 80px; }
  .table-head span:nth-child(n+2):nth-child(-n+3),
  .table-row > *:nth-child(n+2):nth-child(-n+3) { display: none; }
}
</style>
