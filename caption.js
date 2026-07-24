const OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite'

const CAPTION_PROMPT = `You are the comedy engine for a chaotic Gen Z scream-ranking app.

Your job is to create one funny caption and one matching GIPHY search query.

INPUT:

Scream Score: {{score}}
Duration: {{duration}}
Scream Type: {{type}}

HUMOR PRIORITY:

Humor is the #1 priority.

The result should feel like something users would screenshot, send to friends, or post on social media.

STYLE:

- Simple, instantly understandable humor
- Vietnamese or casual Viet-English is preferred
- Chaotic Gen Z internet humor
- Sarcastic
- Dramatic
- Slightly unhinged but not abstract
- Self-aware
- Meme-page energy
- Playfully judgmental
- Unexpected but easy to understand
- Sound like a funny friend reacting
- NEVER sound like an AI assistant

Use everyday situations, obvious exaggeration, and silly roasting.

GOOD EXAMPLES:

{
  "caption": "Tiếng hét này chắc làm hàng xóm rớt cái muỗng.",
  "gifQuery": "shocked reaction"
}

{
  "caption": "Yếu vậy mà cũng bấm ghi âm hả trời.",
  "gifQuery": "awkward confused reaction"
}

{
  "caption": "Ai lấy trà sữa của bạn đúng không?",
  "gifQuery": "shocked office reaction"
}

{
  "caption": "Cái này không phải hét, đây là báo động cháy.",
  "gifQuery": "screaming reaction"
}

{
  "caption": "Micro vừa nghe xong cũng muốn nghỉ việc.",
  "gifQuery": "dramatic office meltdown"
}

{
  "caption": "Nghe như deadline dí tới cổ rồi.",
  "gifQuery": "panic reaction"
}

{
  "caption": "Hàng xóm vừa tự động tham gia cuộc thi.",
  "gifQuery": "chaos screaming crowd"
}

{
  "caption": "Tiếng này chắc thang máy cũng dừng suy nghĩ.",
  "gifQuery": "stunned reaction"
}

{
  "caption": "Bạn hét xong cái nhà cũng im lặng theo.",
  "gifQuery": "dramatic silence reaction"
}

HUMOR BASED ON SCORE:

LOW SCORE:
Playfully roast the weak scream.

Example:
"Yếu vậy mà cũng bấm ghi âm hả trời." / "awkward confused reaction"

MEDIUM SCORE:
React as if something suspicious definitely happened today.

Example:
"Ai lấy trà sữa của bạn đúng không?" / "shocked office reaction"

HIGH SCORE:
Become more dramatic and absurd.

Example:
"Micro vừa nghe xong cũng muốn nghỉ việc." / "dramatic office meltdown"

EXTREME SCORE:
Treat it like a ridiculous world-changing event.

Example:
"Hàng xóm vừa tự động tham gia cuộc thi." / "chaos screaming crowd"

GIF QUERY RULES:

- 2 to 5 useful English search terms.
- Describe a visual reaction, not the exact caption.
- Prefer obvious reaction concepts: shocked reaction, dramatic crying, screaming reaction, confused reaction, celebration, exhausted reaction, office meltdown, dramatic collapse, side eye, applause, chaos reaction.
- Caption and gifQuery must feel like the same joke.

AVOID:

- Generic motivational quotes
- Therapy language
- Mental-health diagnosis
- "You seem stressed"
- "Let it all out"
- "You've got this"
- Dad jokes
- Overly wholesome responses
- Explaining the joke
- Repeating the Scream Score
- Hashtags
- Sounding like ChatGPT
- Generic phrases such as "Wow, that was loud!"

RULES:

- Return exactly ONE JSON object.
- JSON shape: {"caption":"...","gifQuery":"..."}
- Maximum 14 words.
- Keep it punchy.
- Make it very easy to understand.
- Make humor the highest priority.
- Match the intensity of the joke to the Scream Score.
- Do not insult protected characteristics.
- Do not make genuinely cruel personal attacks.
- Do not diagnose stress, anxiety, anger or any mental-health condition.
- Return ONLY valid JSON.
- No markdown.
- No explanation.`

const FALLBACK_CAPTIONS = {
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
  high: [
    'Micro vừa nghe xong cũng muốn nghỉ việc.',
    'Hàng xóm chắc đang mở camera kiểm tra.',
    'Tiếng này nghe như mất vé concert.',
    'Bạn hét cái deadline cũng giật mình.',
    'Cái hét này đủ làm thang máy đứng hình.',
    'Nghe như vừa phát hiện hết tiền trong ví.',
    'Hàng xóm vừa biết hôm nay bạn không ổn.',
    'Tiếng này chắc làm cái quạt quay chậm lại.',
    'Bạn hét như vừa bấm nhầm gửi cho crush.',
    'Cái này không hét, đây là thông báo khẩn.'
  ],
  extreme: [
    'Hàng xóm vừa tự động tham gia cuộc thi.',
    'Tiếng hét này chắc làm trời lag một nhịp.',
    'Bạn hét xong cái nhà cũng im lặng theo.',
    'Bình nước sôi nghe xong thấy áp lực.',
    'Cái hét này đủ gọi tổ dân phố.',
    'Tiếng này chắc làm chuông báo cháy quê ngang.',
    'Bạn vừa gửi thông báo khẩn cho cả khu.',
    'Micro sống sót sau cú đó là phép màu.',
    'Cái hét này nên có bảo hiểm riêng.',
    'Tường nhà vừa học được cảm giác sợ.'
  ],
  mystery: [
    'Không rõ chuyện gì, nhưng nghe mắc cười đó.',
    'Tiếng này có vẻ vừa buồn ngủ vừa cay.',
    'Bạn hét kiểu chưa quyết định có drama không.',
    'Micro nghe xong cũng hơi bối rối.',
    'Cái tiếng này cần phụ đề gấp.',
    'Nghe như não vừa mở nhầm tab.',
    'Tiếng này lạ nhưng có tiềm năng viral.',
    'Không mạnh lắm, nhưng rất có thái độ.',
    'Cái hét này đang trong giai đoạn thử việc.',
    'Nghe như linh hồn vừa quên mật khẩu.'
  ]
}

const FALLBACK_GIF_QUERIES = {
  low: 'awkward confused reaction',
  medium: 'shocked office reaction',
  high: 'dramatic office meltdown',
  extreme: 'chaos screaming crowd',
  mystery: 'confused reaction'
}

const FALLBACK_REACTION_ASSETS = {
  low: '/assets/reactions/low.svg',
  medium: '/assets/reactions/medium.svg',
  high: '/assets/reactions/high.svg',
  extreme: '/assets/reactions/extreme.svg',
  mystery: '/assets/reactions/mystery.svg'
}

const recentFallbackCaptions = []
const gifCache = new Map()

async function createFunnyCaption({ score, duration, type }) {
  const fallback = fallbackReaction(score)
  const apiKey = process.env.OPENROUTER_API_KEY
  let reaction = fallback

  if (apiKey) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:4173',
          'X-Title': 'Scream App Technical Prototype'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          temperature: 1.08,
          max_tokens: 80,
          messages: [
            {
              role: 'user',
              content: renderPrompt({ score, duration, type })
            }
          ]
        })
      })

      if (response.ok) {
        const data = await response.json()
        const parsed = parseReactionJson(data?.choices?.[0]?.message?.content)
        const caption = normalizeCaption(parsed?.caption)
        const gifQuery = normalizeGifQuery(parsed?.gifQuery)

        if (isValidCaption(caption) && isValidGifQuery(gifQuery)) {
          reaction = {
            caption,
            gifQuery,
            source: 'openrouter',
            model: OPENROUTER_MODEL
          }
        } else {
          reaction.reason = 'OpenRouter response failed validation'
        }
      } else {
        reaction.reason = `OpenRouter returned ${response.status}`
      }
    } catch (error) {
      reaction.reason = error.name === 'AbortError' ? 'OpenRouter request timed out' : error.message
    } finally {
      clearTimeout(timeout)
    }
  } else {
    reaction.reason = 'OPENROUTER_API_KEY is not set'
  }

  const gif = await findReactionGif({
    query: reaction.gifQuery,
    score
  })

  return {
    ...reaction,
    gif
  }
}

function renderPrompt({ score, duration, type }) {
  return CAPTION_PROMPT
    .replace('{{score}}', String(score))
    .replace('{{duration}}', `${duration}s`)
    .replace('{{type}}', type)
}

function normalizeCaption(value) {
  return String(value || '')
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)[0]
    ?.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .trim() || ''
}

function parseReactionJson(value) {
  const text = String(value || '').trim()
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || text

  try {
    return JSON.parse(jsonText)
  } catch (error) {
    return null
  }
}

function normalizeGifQuery(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isValidCaption(caption) {
  if (!caption) return false
  if (caption.length > 120) return false
  if (caption.includes('\n')) return false
  if (caption.includes('#')) return false

  const wordCount = caption.split(/\s+/).filter(Boolean).length
  return wordCount <= 14
}

function isValidGifQuery(query) {
  if (!query) return false
  if (query.length > 64) return false

  const wordCount = query.split(/\s+/).filter(Boolean).length
  return wordCount >= 2 && wordCount <= 5
}

async function findReactionGif({ query, score }) {
  const bucket = captionBucketForScore(score)
  const fallback = fallbackGif(bucket, query)
  const apiKey = process.env.GIPHY_API_KEY

  if (!apiKey) {
    console.error('[GIPHY] GIPHY_API_KEY is not set. Using fallback GIF.')
    return fallback
  }

  const cacheKey = query.toLowerCase()
  if (gifCache.has(cacheKey)) return gifCache.get(cacheKey)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6500)

  try {
    const url = new URL('https://api.giphy.com/v1/gifs/search')
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('q', query)
    url.searchParams.set('limit', '10')
    url.searchParams.set('offset', '0')
    url.searchParams.set('rating', 'g')
    url.searchParams.set('lang', 'en')

    const response = await fetch(url, { signal: controller.signal })
    if (response.status === 401) {
      console.error('[GIPHY] Invalid or missing GIPHY API key. Using fallback GIF.')
      return fallback
    }

    if (!response.ok) {
      console.error(`[GIPHY] Search API returned ${response.status}. Using fallback GIF.`)
      return fallback
    }

    const data = await response.json()
    const gif = selectGiphyCandidate(data?.data, query)
    if (!gif) {
      console.error(`[GIPHY] No GIF result for query "${query}". Using fallback GIF.`)
      return fallback
    }

    gifCache.set(cacheKey, gif)
    if (gifCache.size > 40) {
      const firstKey = gifCache.keys().next().value
      gifCache.delete(firstKey)
    }

    return gif
  } catch (error) {
    console.error(`[GIPHY] Search failed: ${error.name || 'Error'}. Using fallback GIF.`)
    return fallback
  } finally {
    clearTimeout(timeout)
  }
}

function selectGiphyCandidate(candidates, query) {
  if (!Array.isArray(candidates)) return null

  const allowedRatings = new Set(['g'])
  const viable = candidates
    .filter((candidate) => allowedRatings.has(String(candidate.rating || '').toLowerCase()))
    .map((candidate) => {
      const image = candidate.images?.fixed_height || candidate.images?.downsized_medium
      return {
        id: candidate.id,
        title: candidate.title || query,
        url: image?.url,
        width: Number(image?.width || 0),
        height: Number(image?.height || 0),
        source: 'giphy',
        attribution: 'Powered by GIPHY',
        giphyUrl: candidate.url
      }
    })
    .filter((candidate) => candidate.url && candidate.width >= 120 && candidate.height >= 90)

  return viable[0] || null
}

function fallbackReaction(score) {
  const bucket = captionBucketForScore(score)

  return {
    caption: fallbackCaption(score),
    gifQuery: FALLBACK_GIF_QUERIES[bucket],
    source: 'fallback',
    gif: fallbackGif(bucket, FALLBACK_GIF_QUERIES[bucket])
  }
}

function fallbackGif(bucket, query) {
  return {
    id: `fallback-${bucket}`,
    title: query,
    url: FALLBACK_REACTION_ASSETS[bucket] || FALLBACK_REACTION_ASSETS.mystery,
    width: 640,
    height: 360,
    source: 'fallback',
    attribution: 'Local fallback reaction'
  }
}

function fallbackCaption(score) {
  const normalizedScore = Number.isFinite(Number(score)) ? Number(score) : 0
  const bucket = captionBucketForScore(normalizedScore)
  const captions = FALLBACK_CAPTIONS[bucket] || FALLBACK_CAPTIONS.mystery
  const available = captions.filter((caption) => !recentFallbackCaptions.includes(caption))
  const captionPool = available.length ? available : captions
  const caption = captionPool[Math.floor(Math.random() * captionPool.length)]

  recentFallbackCaptions.push(caption)
  if (recentFallbackCaptions.length > 12) {
    recentFallbackCaptions.shift()
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

module.exports = {
  OPENROUTER_MODEL,
  CAPTION_PROMPT,
  FALLBACK_CAPTIONS,
  FALLBACK_GIF_QUERIES,
  FALLBACK_REACTION_ASSETS,
  createFunnyCaption,
  isValidCaption,
  isValidGifQuery,
  normalizeCaption,
  normalizeGifQuery,
  fallbackCaption,
  fallbackReaction
}
