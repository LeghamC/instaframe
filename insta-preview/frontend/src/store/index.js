import { defineStore } from 'pinia'
import axios from 'axios'

const API = '/api'

export const useAppStore = defineStore('app', {
  state: () => ({
    sessions: [],
    currentSessionId: null,
    photos: [],
    loading: false,
    selectedDevice: 'iphone16pro',
    compareSessionIds: []
  }),

  getters: {
    currentSession: (state) => state.sessions.find(s => s.id === state.currentSessionId),
    sortedPhotos: (state) => [...state.photos].sort((a, b) => a.position - b.position)
  },

  actions: {
    async loadSessions() {
      const { data } = await axios.get(`${API}/sessions`)
      this.sessions = data
    },

    async createSession(payload) {
      const { data } = await axios.post(`${API}/sessions`, payload)
      this.sessions.push(data)
      this.currentSessionId = data.id
      return data
    },

    async updateSession(id, payload) {
      await axios.put(`${API}/sessions/${id}`, payload)
      const s = this.sessions.find(s => s.id === id)
      if (s) Object.assign(s, payload)
    },

    async deleteSession(id) {
      await axios.delete(`${API}/sessions/${id}`)
      this.sessions = this.sessions.filter(s => s.id !== id)
      if (this.currentSessionId === id) this.currentSessionId = null
    },

    async loadPhotos(sessionId) {
      const { data } = await axios.get(`${API}/photos/${sessionId}`)
      this.photos = data
    },

    async uploadPhotos(sessionId, files) {
      this.loading = true
      try {
        const form = new FormData()
        files.forEach(f => form.append('photos', f))
        form.append('sessionId', sessionId)
        const { data } = await axios.post(`${API}/upload`, form)
        this.photos.push(...data.photos)
        return data.photos
      } finally {
        this.loading = false
      }
    },

    async deletePhoto(id) {
      await axios.delete(`${API}/photos/${id}`)
      this.photos = this.photos.filter(p => p.id !== id)
    },

    async reorderPhotos(sessionId, orderedIds) {
      await axios.put(`${API}/photos/reorder`, { sessionId, orderedIds })
      orderedIds.forEach((id, idx) => {
        const p = this.photos.find(p => p.id === id)
        if (p) p.position = idx
      })
    },

    async updateCaption(id, caption) {
      await axios.put(`${API}/photos/${id}/caption`, { caption })
      const p = this.photos.find(p => p.id === id)
      if (p) p.caption = caption
    },

    async uploadProfilePic(file) {
      const form = new FormData()
      form.append('profilePic', file)
      const { data } = await axios.post(`${API}/profile-pic`, form)
      return data.url
    },

    setDevice(device) {
      this.selectedDevice = device
    },

    toggleCompareSession(id) {
      if (this.compareSessionIds.includes(id)) {
        this.compareSessionIds = this.compareSessionIds.filter(s => s !== id)
      } else if (this.compareSessionIds.length < 2) {
        this.compareSessionIds.push(id)
      }
    }
  }
})
