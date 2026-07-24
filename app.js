  if (error.message?.includes('getUserMedia')) {
    return 'This browser context does not expose the microphone API. Try opening the same URL directly in Chrome or Safari.'
  }

  if (error.message?.includes('AudioContext')) {
    return 'Web Audio API is unavailable in this browser context.'
  }

  if (error.name === 'NotAllowedError') {
    return `Microphone access is required to scream. Please allow microphone permission for ${window.location.host} in your browser.`
  }

  if (error.name === 'NotFoundError') {
    return 'No microphone device was found. Check the selected input device and OS microphone settings.'
  }

  if (error.name === 'NotReadableError') {
    return 'Mic is allowed, but another app/browser may be using it. Close Zoom/Meet/other tabs and try again.'
  }

  if (error.name === 'AbortError') {
    return 'Browser started mic access but failed. Unplug/replug the mic or try another browser.'
  }

  if (error.name === 'SecurityError') {
    return 'Browser security blocked the mic. Try Chrome/Safari directly instead of embedded browser.'
  }

  return error.message || 'Microphone setup failed.'
}

function validateCaption(caption) {
  if (typeof caption !== 'string') return false
  if (!caption.trim()) return false
  if (caption.length > 120) return false
  if (caption.includes('\n')) return false
  if (caption.includes('#')) return false

  return caption.trim().split(/\s+/).length <= 14
}

function validateGif(gif) {
  if (!gif || typeof gif !== 'object') return false
  if (typeof gif.url !== 'string' || !gif.url) return false

  try {
    const url = new URL(gif.url, window.location.origin)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (error) {
    return false
  }
}

function frontendFallbackGif(score) {
  const bucket = captionBucketForScore(score)

  return {
    title: `${bucket} reaction`,
    url: FRONTEND_FALLBACK_GIFS[bucket] || FRONTEND_FALLBACK_GIFS.mystery,
    attribution: 'Local fallback reaction'
  }
}

function frontendFallbackCaption(score) {
  const bucket = captionBucketForScore(score)
  const captions = FRONTEND_FALLBACK_CAPTIONS[bucket] || FRONTEND_FALLBACK_CAPTIONS.mystery
  const available = captions.filter((caption) => !state.recentFallbackCaptions.includes(caption))
  const captionPool = available.length ? available : captions
  const caption = captionPool[Math.floor(Math.random() * captionPool.length)]

  state.recentFallbackCaptions.push(caption)
  if (state.recentFallbackCaptions.length > 12) {
    state.recentFallbackCaptions.shift()
  }

  return caption
}

function captionBucketForScore(score) {
  if (score >= 90) return 'extreme'
  if (score >= 75) return 'high'
  if (score >= 45) return 'medium'
  if (score >= 20) return 'low'

  return 'mystery'
}

function sanitizeNickname(value) {
  const nickname = String(value || '').replace(/\s+/g, ' ').trim()
  return nickname.length >= 2 && nickname.length <= 20 ? nickname : ''
}

function rankLabel(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

function leaderboardScreamType(value) {
  const screamType = String(value || '').replace(/\s+/g, ' ').trim()
  return LEGACY_SCREAM_TYPE_LABELS[screamType] || screamType || 'Unclassified Screaming Object'
}

function formatScore(score) {
  return Number(score || 0).toLocaleString()
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatLufs(value) {
  if (!Number.isFinite(value) || value <= LOUDNESS_FLOOR) return '-Inf LUFS'
  return `${value.toFixed(1)} LUFS`
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(2)}s`
}

function normalizeLufs(value) {
  if (!Number.isFinite(value)) return 0
  return clamp((value - LOUDNESS_FLOOR) / (LOUDNESS_CEILING - LOUDNESS_FLOOR), 0, 1)
}

function mean(values) {
  const finiteValues = values.filter(Number.isFinite)
  if (!finiteValues.length) return Number.NEGATIVE_INFINITY
  return finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
