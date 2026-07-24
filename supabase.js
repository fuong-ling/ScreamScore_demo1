const SUPABASE_TABLE = 'screams'
const MAX_SCORE = 100
const LEADERBOARD_FETCH_LIMIT = 200
const LEADERBOARD_LIMIT = 20

async function insertScream(payload) {
  assertSupabaseConfigured()

  const scream = validateScreamPayload(payload)
  const response = await supabaseFetch(`/${SUPABASE_TABLE}`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: JSON.stringify(scream)
  })

  if (!response.ok) {
    throw new Error(`Supabase insert failed with ${response.status}`)
  }

  const rows = await response.json()
  return rows[0]
}

async function getLeaderboard({ mode = 'today', nickname = '' } = {}) {
  assertSupabaseConfigured()

  const normalizedMode = mode === 'all-time' ? 'all-time' : 'today'
  const params = new URLSearchParams()
  params.set('select', 'id,nickname,score,duration,scream_type,caption,gif_url,created_at')
  params.set('order', 'score.desc,created_at.asc')
  params.set('limit', String(LEADERBOARD_FETCH_LIMIT))

  if (normalizedMode === 'today') {
    params.set('created_at', `gte.${startOfTodayIso()}`)
  }

  const response = await supabaseFetch(`/${SUPABASE_TABLE}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Supabase leaderboard query failed with ${response.status}`)
  }

  const rows = await response.json()
  const leaderboard = bestScorePerNickname(rows).slice(0, LEADERBOARD_LIMIT)
  const normalizedNickname = normalizeNicknameKey(nickname)
  const userRank = normalizedNickname
    ? leaderboard.findIndex((row) => normalizeNicknameKey(row.nickname) === normalizedNickname) + 1
    : 0

  return {
    mode: normalizedMode,
    leaderboard,
    userRank: userRank || null
  }
}

function validateScreamPayload(payload) {
  const nickname = sanitizeNickname(payload.nickname)
  const score = Number(payload.score)
  const duration = Number(payload.duration)
  const screamType = sanitizeText(payload.screamType || payload.scream_type, 60)
  const caption = sanitizeText(payload.caption, 160)
  const gifUrl = sanitizeUrl(payload.gifUrl || payload.gif_url)

  if (!nickname) {
    throw validationError('Nickname must be 2-20 characters.')
  }

  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw validationError('Score must be an integer from 0 to 100.')
  }

  if (!Number.isFinite(duration) || duration < 0 || duration > 60) {
    throw validationError('Duration must be a valid number.')
  }

  return {
    nickname,
    score,
    duration: Number(duration.toFixed(2)),
    scream_type: screamType || 'THE MYSTERY NOISE',
    caption: caption || '',
    gif_url: gifUrl || ''
  }
}

function bestScorePerNickname(rows) {
  const best = new Map()

  for (const row of rows) {
    const key = normalizeNicknameKey(row.nickname)
    if (!key) continue

    const current = best.get(key)
    if (!current || row.score > current.score || (row.score === current.score && row.created_at < current.created_at)) {
      best.set(key, row)
    }
  }

  return Array.from(best.values())
    .sort((a, b) => b.score - a.score || new Date(a.created_at) - new Date(b.created_at))
}

function sanitizeNickname(value) {
  const nickname = String(value || '').replace(/\s+/g, ' ').trim()
  if (nickname.length < 2 || nickname.length > 20) return ''
  return nickname
}

function sanitizeText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function sanitizeUrl(value) {
  const url = String(value || '').trim()
  if (!url) return ''

  try {
    const parsed = new URL(url, 'http://localhost')
    if (!['http:', 'https:'].includes(parsed.protocol) && !url.startsWith('/assets/reactions/')) return ''
    return url.slice(0, 500)
  } catch (error) {
    return ''
  }
}

function normalizeNicknameKey(value) {
  return String(value || '').trim().toLowerCase()
}

function startOfTodayIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
}

function assertSupabaseConfigured() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    const error = new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.')
    error.statusCode = 503
    error.publicMessage = 'Leaderboard is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.'
    throw error
  }
}

function supabaseFetch(path, options = {}) {
  const baseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL)

  return fetch(`${baseUrl}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
}

function normalizeSupabaseUrl(value) {
  const url = new URL(value)
  url.pathname = url.pathname.replace(/\/rest\/v1\/?$/, '')
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

function validationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

module.exports = {
  insertScream,
  getLeaderboard,
  validateScreamPayload,
  bestScorePerNickname
}
