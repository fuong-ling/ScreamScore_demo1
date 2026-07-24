const http = require('node:http')
const fsSync = require('node:fs')
const fs = require('node:fs/promises')
const path = require('node:path')

loadLocalEnv()

const { createFunnyCaption } = require('./server/caption')
const { getLeaderboard, insertScream } = require('./server/supabase')

const PORT = Number(process.env.PORT || 4173)
const ROOT = __dirname

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
}

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fsSync.existsSync(envPath)) return

  const lines = fsSync.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`)

    if (request.method === 'POST' && url.pathname === '/api/funny-caption') {
      await handleFunnyCaption(request, response)
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/screams') {
      await handleSubmitScream(request, response)
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/leaderboard') {
      await handleLeaderboard(url, response)
      return
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(response, 405, { error: 'Method not allowed' })
      return
    }

    await serveStatic(url.pathname, response, request.method === 'HEAD')
  } catch (error) {
    sendJson(response, 500, { error: 'Internal server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Scream App prototype running at http://localhost:${PORT}/`)
})

async function handleFunnyCaption(request, response) {
  const body = await readJsonBody(request)
  const score = clampNumber(body.score, 0, 100)
  const duration = clampNumber(body.duration, 0, 60)
  const type = sanitizeType(body.type)

  const result = await createFunnyCaption({
    score: Math.round(score),
    duration: Number(duration.toFixed(2)),
    type
  })

  sendJson(response, 200, result)
}

async function handleSubmitScream(request, response) {
  try {
    const body = await readJsonBody(request)
    const inserted = await insertScream(body)
    const today = await getLeaderboard({
      mode: 'today',
      nickname: inserted.nickname
    })

    sendJson(response, 201, {
      scream: inserted,
      todayRank: today.userRank
    })
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: error.publicMessage || (error.statusCode ? error.message : "Couldn't submit your score. Try again.")
    })
  }
}

async function handleLeaderboard(url, response) {
  try {
    const mode = url.searchParams.get('mode') || 'today'
    const nickname = url.searchParams.get('nickname') || ''
    const result = await getLeaderboard({ mode, nickname })

    sendJson(response, 200, result)
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: error.publicMessage || 'Leaderboard unavailable.'
    })
  }
}

async function serveStatic(pathname, response, headOnly) {
  const decodedPath = decodeURIComponent(pathname)
  const safePath = decodedPath === '/' ? '/index.html' : decodedPath

  if (safePath.startsWith('/server/') || safePath === '/server.js' || path.basename(safePath).startsWith('.')) {
    sendJson(response, 404, { error: 'Not found' })
    return
  }

  const filePath = path.normalize(path.join(ROOT, safePath))

  if (!filePath.startsWith(ROOT)) {
    sendJson(response, 403, { error: 'Forbidden' })
    return
  }

  try {
    const content = await fs.readFile(filePath)
    writeStaticHeaders(response, MIME_TYPES[path.extname(filePath)] || 'application/octet-stream')
    if (!headOnly) response.end(content)
    else response.end()
  } catch (error) {
    sendJson(response, 404, { error: 'Not found' })
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 4096) {
        request.destroy()
        reject(new Error('Request body too large'))
      }
    })

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Permissions-Policy': 'microphone=(self), camera=()',
    'Feature-Policy': "microphone 'self'; camera 'none'"
  })
  response.end(JSON.stringify(payload))
}

function writeStaticHeaders(response, contentType) {
  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Permissions-Policy': 'microphone=(self), camera=()',
    'Feature-Policy': "microphone 'self'; camera 'none'"
  })
}

function clampNumber(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return min
  return Math.min(Math.max(number, min), max)
}

function sanitizeType(value) {
  const type = String(value || 'THE MYSTERY NOISE').replace(/[^a-z0-9 -]/gi, '').trim()
  return type.slice(0, 40) || 'THE MYSTERY NOISE'
}
