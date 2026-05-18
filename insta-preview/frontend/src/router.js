import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import PreviewView from './views/PreviewView.vue'
import HistoryView from './views/HistoryView.vue'
import CompareView from './views/CompareView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/preview/:sessionId', component: PreviewView },
    { path: '/history', component: HistoryView },
    { path: '/compare', component: CompareView }
  ]
})
