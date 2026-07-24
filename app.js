const LOUDNESS_FLOOR = -70
const LOUDNESS_CEILING = -5
const LOCAL_LEADERBOARD_KEY = 'scream-app-local-leaderboard'
const { LoudnessMeter } = window.Needles || {}
const FRONTEND_FALLBACK_CAPTIONS = {
  low: [
    'Yếu vậy mà cũng bấm ghi âm hả trời.',
    'Tiếng này còn thua thông báo ngân hàng.',
    'Micro đang hỏi bạn đã hét chưa đó.',
    'Cái hét này chắc đi bằng xe đạp.',
    'Nghe như mèo con xin nghỉ phép.',
    'Bạn hét hay đang tiết kiệm pin vậy?',
    'Âm lượng này làm con muỗi tự tin hơn.',
    'Cái này là bản demo của tiếng hét.',
    'Hét nhẹ vậy chắc sợ làm phiền bụi.',
    'Wi-Fi nhà bạn còn gào mạnh hơn.'
  ],
  medium: [
    'Ai lấy trà sữa của bạn đúng không?',
    'Nghe như vừa thấy deadline nhắn tin.',
    'Tiếng này chắc do group project gây ra.',
    'Ổn đó, nhưng hàng xóm chưa cần họp.',
    'Có chuyện rồi, nhưng chưa tới mức gọi bảo vệ.',
    'Nghe như vừa đọc tin nhắn seen không rep.',
    'Cái hét này có mùi bị giao việc.',
    'Bạn vừa nhớ ra mai có thuyết trình à?',
    'Nghe như Shopee hết mã giảm giá.',
    'Tiếng hét vừa đủ làm mẹ hỏi gì đó.'
  ],
    'THE WIFI DISCONNECT': '📶 Wi-Fi Router in Pain',
  'THE SILENT ALARM': 'Unclassified Screaming Object'
}

const elements = {
  screamButton: document.getElementById('screamButton'),
  micStatus: document.getElementById('micStatus'),
  micStatusDot: document.getElementById('micStatusDot'),
  nicknameForm: document.getElementById('nicknameForm'),
  nicknameInput: document.getElementById('nicknameInput'),
  nicknameStartButton: document.getElementById('nicknameStartButton'),
  nicknameError: document.getElementById('nicknameError'),
  playerChip: document.getElementById('playerChip'),
  playerName: document.getElementById('playerName'),
  liveMomentary: document.getElementById('liveMomentary'),
  liveMode: document.getElementById('liveMode'),
  meterFill: document.getElementById('meterFill'),
  durationLive: document.getElementById('durationLive'),
  peakResult: document.getElementById('peakResult'),
  integratedResult: document.getElementById('integratedResult'),
  durationResult: document.getElementById('durationResult'),
  scoreResult: document.getElementById('scoreResult'),
  screamTypeResult: document.getElementById('screamTypeResult'),
  reactionMedia: document.getElementById('reactionMedia'),
  reactionGif: document.getElementById('reactionGif'),
  reactionAttribution: document.getElementById('reactionAttribution'),
  captionIcon: document.getElementById('captionIcon'),
  captionResult: document.getElementById('captionResult'),
  todayRank: document.getElementById('todayRank'),
  debugMicDetected: document.getElementById('debugMicDetected'),
  debugMomentary: document.getElementById('debugMomentary'),
  debugShortTerm: document.getElementById('debugShortTerm'),
  debugIntegrated: document.getElementById('debugIntegrated'),
  debugDuration: document.getElementById('debugDuration'),
  debugScore: document.getElementById('debugScore'),
  debugLatency: document.getElementById('debugLatency'),
  debugMicApi: document.getElementById('debugMicApi'),
  debugOrigin: document.getElementById('debugOrigin'),
  debugSecureContext: document.getElementById('debugSecureContext'),
  debugMicPermission: document.getElementById('debugMicPermission'),
  debugMicError: document.getElementById('debugMicError'),
  debugNotes: document.getElementById('debugNotes'),
  enableMicButton: document.getElementById('enableMicButton'),
  testMicButton: document.getElementById('testMicButton'),
  restartButton: document.getElementById('restartButton'),
  screamAgainButton: document.getElementById('screamAgainButton'),
  submitScoreButton: document.getElementById('submitScoreButton'),
  shareButton: document.getElementById('shareButton'),
  viewLeaderboardButton: document.getElementById('viewLeaderboardButton'),
  todayTab: document.getElementById('todayTab'),
  allTimeTab: document.getElementById('allTimeTab'),
  leaderboardPanel: document.getElementById('leaderboardPanel'),
  leaderboardList: document.getElementById('leaderboardList'),
  leaderboardEmpty: document.getElementById('leaderboardEmpty'),
  rankCallout: document.getElementById('rankCallout'),
  userRank: document.getElementById('userRank')
}

const state = {
  audioContext: null,
  micStream: null,
  micSource: null,
  loudnessMeter: null,
  micReady: false,
  isRecording: false,
  isStarting: false,
  holdRequested: false,
  startedAt: 0,
  timerId: null,
  firstNeedlesEventAt: 0,
  captionRequestId: 0,
  nickname: '',
  lastSummary: null,
  lastReaction: null,
  leaderboardMode: 'today',
  leaderboardTimer: null,
  recentFallbackCaptions: [],
  latest: {
    momentary: Number.NEGATIVE_INFINITY,
    shortTerm: Number.NEGATIVE_INFINITY,
    integrated: Number.NEGATIVE_INFINITY
  },
  observed: {
    peak: Number.NEGATIVE_INFINITY,
    momentaryValues: [],
    integrated: Number.NEGATIVE_INFINITY
  }
}

setCaptionIcon('default', 0)
setScreamButtonReady(false)
elements.submitScoreButton.title = 'Finish a scream first, then submit the result.'
initializeNickname()
initializeEnvironmentStatus()
loadLeaderboard('today')
state.leaderboardTimer = setInterval(() => loadLeaderboard(state.leaderboardMode, { quiet: true }), 12000)

elements.nicknameForm.addEventListener('submit', handleNicknameSubmit)
elements.nicknameStartButton.addEventListener('click', handleNicknameSubmit)
elements.nicknameStartButton.addEventListener('pointerdown', handleNicknameSubmit)
elements.enableMicButton.addEventListener('click', enableMicrophone)
elements.testMicButton.addEventListener('click', testRawMicrophoneAccess)
elements.restartButton.addEventListener('click', restartPrototype)
elements.screamAgainButton.addEventListener('click', restartPrototype)
elements.submitScoreButton.addEventListener('click', submitScoreToLeaderboard)
elements.shareButton.addEventListener('click', shareChallenge)
elements.viewLeaderboardButton.addEventListener('click', scrollToLeaderboard)
elements.todayTab.addEventListener('click', () => loadLeaderboard('today'))
elements.allTimeTab.addEventListener('click', () => loadLeaderboard('all-time'))
elements.reactionGif.addEventListener('error', handleReactionImageError)
elements.screamButton.addEventListener('pointerdown', startScream)
elements.screamButton.addEventListener('pointerup', stopScream)
elements.screamButton.addEventListener('pointercancel', stopScream)
elements.screamButton.addEventListener('lostpointercapture', stopScream)
elements.screamButton.addEventListener('mousedown', startScream)
document.addEventListener('mouseup', stopScream)
elements.screamButton.addEventListener('touchstart', (event) => {
  event.preventDefault()
  startScream(event)
}, { passive: false })
document.addEventListener('touchend', stopScream)
elements.screamButton.addEventListener('keydown', (event) => {
  if ((event.code === 'Space' || event.code === 'Enter') && !state.isRecording) {
    event.preventDefault()
    startScream(event)
  }
})
elements.screamButton.addEventListener('keyup', (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    stopScream()
  }
})

window.addEventListener('beforeunload', () => {
  stopMicrophoneTracks()
})
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
