<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo">
      <span class="logo-icon">◈</span>
      <span class="logo-text">InstaFrame</span>
    </RouterLink>
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
        <span>Home</span>
      </RouterLink>
      <RouterLink to="/history" class="nav-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>History</span>
      </RouterLink>
      <RouterLink to="/compare" class="nav-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>
        <span>Compare</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: blur(10px);
}
.logo {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-display);
  font-size: 18px; font-weight: 700;
  color: var(--accent);
}
.logo-icon { font-size: 20px; }
.nav-links {
  display: flex; align-items: center; gap: 4px;
}
.nav-link {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 500; color: var(--text-muted);
  transition: all var(--transition);
}
.nav-link svg { width: 16px; height: 16px; }
.nav-link:hover, .nav-link.router-link-active {
  color: var(--text); background: var(--bg3);
}
.nav-link.router-link-exact-active { color: var(--accent); }

@media (max-width: 500px) {
  .navbar { padding: 0 12px; }
  .nav-link span { display: none; }
  .nav-link { padding: 8px 10px; }
  .logo-text { display: none; }
}
</style>
