const LOUDNESS_FLOOR = -70
const LOUDNESS_CEILING = -5
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

const FRONTEND_FALLBACK_GIFS = {
  low: './low.svg',
  medium: './medium.svg',
  high: './high.svg',
  extreme: './extreme.svg',
  mystery: './mystery.svg'
}

const SCREAM_TYPES = {
  extreme: [
    '🚨 Human Fire Alarm',
    '🦖 Budget T-Rex',
    '🚀 Jet Engine Intern',
    '💥 Academic Detonation',
    '🏢 Building-Wide Announcement',
    '🌋 Emotional Volcano',
    '📡 Satellite Distress Signal',
    '🧯 Fire Drill Main Character',
    '⚡ Power Grid Villain',
    '🛫 Airport Runway Drama',
    '📢 Town Hall Meltdown',
    '🧨 Group Chat Explosion',
    '🏆 Olympic Overreaction',
    '🚒 Alarm System Influencer',
    '🎤 Stadium Mic Abuse',
    '🛰️ Space Program Mistake',
    '💀 Neighborhood Lore Event',
    '🌪️ Tiny Tornado With Rent',
    '🔊 Bluetooth Speaker Possession',
    '🎬 Disaster Movie Audition',
    '🏚️ Haunted Apartment Siren',
    '🧠 Brain Reboot Siren',
    '🚨 HR Emergency Broadcast'
  ],
  high: [
    '🫖 Boiling Kettle',
    '📣 Broken Megaphone',
    '🚂 Steam Engine Breakdown',
    '🔥 Emotional Fire Drill',
    '📮 Complaint Letter With Vocals',
    '🧾 Receipt Printer Rage',
    '📱 Phone at One Percent',
    '🛎️ Hotel Lobby Panic',
    '🥤 Soda Can Pressure Leak',
    '🚪 Doorbell With Trauma',
    '📚 Library Rule Violation',
    '🎧 Headphone Warning Label',
    '🍜 Instant Noodle Emergency',
    '🧯 Small Fire Big Feelings',
    '📦 Delivery Driver Jump Scare',
    '🛗 Elevator Panic Button',
    '🎮 Gamer Lobby Siren',
    '🧊 Freezer Burn Opera',
    '🚌 Bus Stop Meltdown',
    '📺 Reality Show Confession',
    '🍳 Angry Breakfast Whistle',
    '🛒 Shopping Cart Breakdown',
    '🎭 Drama Club Siren',
    '📞 Customer Support Hold Music'
  ],
  medium: [
    '📄 Corporate Breakdown',
    '⏰ Deadline Victim',
    '🎓 Finals Week Special',
    '☎️ Customer Service Final Boss',
    '🧃 Juice Box With Issues',
    '📎 Office Supply Protest',
    '💸 Budget Meeting Survivor',
    '🗓️ Calendar Invite Trauma',
    '📬 Inbox Notification Spiral',
    '🍟 Fries Fell Down',
    '🧼 Laundry Day Villain',
    '🧍 Queue Anxiety Soundtrack',
    '🖱️ Frozen Cursor Crisis',
    '🧋 Missing Boba Incident',
    '📖 Syllabus Plot Twist',
    '🧮 Calculator Giving Up',
    '🚌 Almost Missed Bus',
    '🍚 Rice Cooker Drama',
    '📦 Package Delivery Suspense',
    '📝 Pop Quiz Siren',
    '💻 Laptop Fan Cosplay',
    '🎒 Backpack Zipper Crisis',
    '📉 Spreadsheet Downfall',
    '🧍 Social Battery Warning'
  ],
  low: [
    '🖨️ Dying Printer',
    '📶 Wi-Fi Router in Pain',
    '🐬 Dolphin With Taxes',
    '🐐 Possessed Goat',
    '🔔 Tiny Notification Panic',
    '🧊 Ice Cube Complaining',
    '📎 Paperclip Under Pressure',
    '🔋 Low Battery Whisper',
    '🧃 Empty Juice Box',
    '🛏️ Pillow Argument',
    '🧦 Lost Sock Protest',
    '🥄 Spoon Dropped Once',
    '📱 Silent Mode Rebellion',
    '🍞 Toast With Anxiety',
    '🧼 Soap Opera Extra',
    '📺 Remote Control Panic',
    '🪫 Charger Cable Sigh',
    '🧂 Salt Shaker Drama',
    '🥬 Lettuce With Feelings',
    '🖱️ Mouse Click Complaint',
    '📦 Tiny Package Alert',
    '🪑 Chair Noise Apology',
    '🧻 Toilet Paper Whisper',
    '💤 Alarm Clock Intern'
  ],
  mystery: [
    'Unclassified Screaming Object',
    '🌀 Mystery Noise Internship',
    '🧪 Lab Accident But Quiet',
    '📻 Static With Opinions',
    '🕳️ Plot Hole Screech',
    '🧠 Brain Tab Crashed',
    '🧾 Receipt of Confusion',
    '🫠 Emotionally Unrendered Sound',
    '🪩 Weird Little Audio Moment',
    '📼 Found Footage Squeak',
    '🧃 Unverified Juice Incident'
  ]
}

const LEGACY_SCREAM_TYPE_LABELS = {
  'THE NEIGHBORHOOD INCIDENT': '🚨 Human Fire Alarm',
  'THE BOILING KETTLE': '🫖 Boiling Kettle',
  'THE LONG-FORM CRISIS': '🎓 Finals Week Special',
  'THE JUMP SCARE': '📣 Broken Megaphone',
  'THE GROUP PROJECT': '⏰ Deadline Victim',
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

async function initializeEnvironmentStatus() {
  const hasMicApi = Boolean(getUserMediaApi())
  elements.debugMicApi.textContent = hasMicApi ? 'available' : 'unavailable'
  elements.debugOrigin.textContent = window.location.origin
  elements.debugSecureContext.textContent = window.isSecureContext ? 'true' : 'false'

  if (!window.isSecureContext) {
    setMicStatus(false, 'Microphone requires HTTPS or localhost')
    setNote('Open this prototype from localhost or HTTPS to use microphone access.')
    return
  }

  if (!hasMicApi) {
    setMicStatus(false, 'Microphone API unavailable')
    setNote('This browser does not expose navigator.mediaDevices.getUserMedia(). Open the HTTPS GitHub Pages URL in Chrome, Safari, or Edge.')
    return
  }

  const permissionState = await updateMicrophonePermissionStatus()
  if (permissionState === 'denied') {
    setMicStatus(false, 'Microphone permission denied')
    setNote('Mic is blocked for this site. Change microphone permission to Allow, then reload.')
    return
  }

  setNote('Click Ask Mic Permission once, choose Allow, then hold the scream button.')
}

async function enableMicrophone() {
  if (!state.nickname) {
    elements.nicknameError.textContent = 'Enter a name first. The screamboard needs a suspect.'
    elements.nicknameInput.focus()
    return
  }

  state.holdRequested = false
  elements.enableMicButton.disabled = true
  setNote('Requesting microphone access...')

  try {
    await ensureMeterReady()
    await state.audioContext.resume()
    state.micReady = true
    clearMicError()
    elements.enableMicButton.textContent = 'Mic Enabled'
    setScreamButtonReady(true)
    await updateMicrophonePermissionStatus()
    setNote('Microphone ready. Hold the scream button to start metering.')
  } catch (error) {
    state.micReady = false
    setMicError(error)
    elements.enableMicButton.disabled = false
    elements.enableMicButton.textContent = 'Ask Mic Permission'
    setScreamButtonReady(false)
    await updateMicrophonePermissionStatus(error)
    setMicStatus(false, microphoneErrorMessage(error))
    setNote(microphoneDebugMessage(error))
  }
}

async function testRawMicrophoneAccess() {
  if (!state.nickname) {
    elements.nicknameError.textContent = 'Enter a name first, then test the mic.'
    elements.nicknameInput.focus()
    return
  }

  elements.testMicButton.disabled = true
  setNote('Testing raw browser microphone access...')

  try {
    const stream = await getUserMedia({ audio: true })
    const audioTracks = stream.getAudioTracks()
    const deviceLabel = audioTracks[0]?.label || 'audio input track'

    audioTracks.forEach((track) => track.stop())
    clearMicError()
    setMicStatus(true, 'Raw microphone works')
    await updateMicrophonePermissionStatus()
    setScreamButtonReady(state.micReady)
    setNote(`Browser returned ${audioTracks.length || 1} audio track(s): ${deviceLabel}. Now click Ask Mic Permission or hold again to connect Needles.`)
  } catch (error) {
    setMicError(error)
    await updateMicrophonePermissionStatus(error)
    setMicStatus(false, microphoneErrorMessage(error))
    setNote(microphoneDebugMessage(error))
  } finally {
    elements.testMicButton.disabled = false
  }
}

async function startScream(event) {
  state.holdRequested = true
  if (!state.nickname) {
    elements.nicknameError.textContent = 'Enter your name before screaming into history.'
    elements.nicknameInput.focus()
    return
  }

  if (!state.micReady) {
    await enableMicrophone()
    if (!state.micReady || !state.holdRequested) return
  }
  if (state.isRecording || state.isStarting) return

  try {
    state.isStarting = true
    if (event?.pointerId !== undefined) {
      elements.screamButton.setPointerCapture(event.pointerId)
    }

    setNote('Requesting microphone access...')
    await ensureMeterReady()
    await state.audioContext.resume()

    if (!state.holdRequested) {
      setNote('Ready. Hold the button again to start metering.')
      return
    }

    resetScreamStats()
    state.isRecording = true
    state.isStarting = false
    state.startedAt = performance.now()
    state.firstNeedlesEventAt = 0
    elements.screamButton.classList.add('is-active')
    setNote('Recording through Needles. Release the button to stop.')

    state.loudnessMeter.reset()
    state.loudnessMeter.start()
    tickDuration()
  } catch (error) {
    state.isRecording = false
    state.isStarting = false
    setMicError(error)
    elements.screamButton.classList.remove('is-active')
    setMicStatus(false, microphoneErrorMessage(error))
    setNote(microphoneDebugMessage(error))
  } finally {
    state.isStarting = false
  }
}

function stopScream() {
  state.holdRequested = false
  if (!state.isRecording) return

  state.isRecording = false
  elements.screamButton.classList.remove('is-active')
  clearInterval(state.timerId)
  state.timerId = null

  const durationSeconds = elapsedSeconds()
  const summary = summarizeScream(durationSeconds)
  state.lastSummary = summary
  state.lastReaction = null

  elements.peakResult.textContent = formatLufs(summary.peak)
  elements.integratedResult.textContent = summary.integratedSource === 'fallback-average'
    ? `${formatLufs(summary.integrated)} avg`
    : formatLufs(summary.integrated)
  elements.durationResult.textContent = formatSeconds(summary.duration)
  elements.scoreResult.textContent = summary.score.toString()
  elements.screamTypeResult.textContent = summary.type
  setCaptionIcon(summary.type, summary.score)
  elements.captionResult.textContent = 'Summoning comedy...'
  setReactionGif(frontendFallbackGif(summary.score), { loading: true })
  elements.submitScoreButton.disabled = true
  elements.submitScoreButton.title = 'Finish a scream first, then submit the result.'
  elements.shareButton.disabled = true
  elements.todayRank.textContent = 'NOT SUBMITTED YET'
  const captionRequestId = ++state.captionRequestId

  updateDurationDisplays(durationSeconds)
  elements.debugScore.textContent = summary.score.toString()
  setNote(summary.integratedSource === 'fallback-average'
    ? 'Stopped. Integrated LUFS was not ready, so summary used average momentary LUFS.'
    : 'Stopped. Summary captured from Needles live readings.')

  state.loudnessMeter.stop()
  requestFunnyCaption(summary, captionRequestId)
}

function restartPrototype() {
  const wasRecording = state.isRecording

  state.holdRequested = false
  state.isRecording = false
  state.isStarting = false
  clearInterval(state.timerId)
  state.timerId = null
  elements.screamButton.classList.remove('is-active')

  if (state.loudnessMeter && state.loudnessMeter.state !== 'inactive') {
    state.loudnessMeter.stop()
  } else {
    state.loudnessMeter?.reset()
  }

  state.startedAt = 0
  state.firstNeedlesEventAt = 0
  state.captionRequestId += 1
  state.lastSummary = null
  state.lastReaction = null
  resetScreamStats()
  resetResultPanel()
  elements.debugLatency.textContent = 'waiting'
  setNote(wasRecording
    ? 'Restarted while recording. Hold the button to start again.'
    : 'Restarted. Hold the button to start again.')
}

function initializeNickname() {
  const savedNickname = readNicknameFromUrl() || readStoredNickname()
  if (savedNickname) {
    setNickname(savedNickname)
  } else {
    elements.enableMicButton.disabled = true
    setScreamButtonReady(false)
  }
}

function readNicknameFromUrl() {
  try {
    return sanitizeNickname(new URLSearchParams(window.location.search).get('nickname'))
  } catch (error) {
    return ''
  }
}

function handleNicknameSubmit(event) {
  event.preventDefault()

  const nickname = sanitizeNickname(elements.nicknameInput.value)
  if (!nickname) {
    elements.nicknameError.textContent = 'Name must be 2-20 characters.'
    return
  }

  setNickname(nickname)
  setNote('Name locked. Ask mic permission, then scream for the board.')
}

function setNickname(nickname) {
  state.nickname = nickname
  writeStoredNickname(nickname)
  elements.nicknameInput.value = nickname
  elements.nicknameError.textContent = ''
  elements.nicknameForm.hidden = true
  elements.playerChip.hidden = false
  elements.playerName.textContent = nickname
  elements.enableMicButton.disabled = false
  loadLeaderboard(state.leaderboardMode, { quiet: true })
}

function readStoredNickname() {
  try {
    return window.localStorage?.getItem('scream-app-nickname') || ''
  } catch (error) {
    return ''
  }
}

function writeStoredNickname(nickname) {
  try {
    window.localStorage?.setItem('scream-app-nickname', nickname)
  } catch (error) {
    // Storage is optional; the current session still keeps the nickname.
  }
}

async function submitScoreToLeaderboard() {
  if (!state.lastSummary || !state.lastReaction || !state.nickname) return

  elements.submitScoreButton.disabled = true
  elements.submitScoreButton.textContent = 'SUBMITTING...'

  try {
    const response = await fetch('/api/screams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname: state.nickname,
        score: state.lastSummary.score,
        duration: Number(state.lastSummary.duration.toFixed(2)),
        screamType: state.lastSummary.type,
        caption: state.lastReaction.caption,
        gifUrl: state.lastReaction.gifUrl
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Couldn't submit your score. Try again.")

    elements.submitScoreButton.textContent = 'SUBMITTED'
    elements.submitScoreButton.title = 'This scream has been submitted.'
    elements.todayRank.textContent = data.todayRank ? `YOU ARE #${data.todayRank} TODAY` : 'SUBMITTED'
    await loadLeaderboard('today')
    scrollToLeaderboard()
  } catch (error) {
    elements.submitScoreButton.disabled = false
    elements.submitScoreButton.textContent = 'SUBMIT TO LEADERBOARD'
    elements.submitScoreButton.title = ''
    setNote(error.message || "Couldn't submit your score. Try again.")
  }
}

async function loadLeaderboard(mode = state.leaderboardMode, options = {}) {
  state.leaderboardMode = mode === 'all-time' ? 'all-time' : 'today'
  elements.todayTab.classList.toggle('is-active', state.leaderboardMode === 'today')
  elements.allTimeTab.classList.toggle('is-active', state.leaderboardMode === 'all-time')

  try {
    const params = new URLSearchParams({
      mode: state.leaderboardMode
    })
    if (state.nickname) params.set('nickname', state.nickname)

    const response = await fetch(`/api/leaderboard?${params.toString()}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Leaderboard unavailable.')

    renderLeaderboard(data.leaderboard || [])
    renderUserRank(data.userRank)
  } catch (error) {
    if (!options.quiet) {
      elements.leaderboardList.innerHTML = ''
      elements.leaderboardEmpty.hidden = false
      elements.leaderboardEmpty.textContent = `${error.message} Core screaming still works.`
      elements.rankCallout.hidden = true
    }
  }
}

function renderLeaderboard(rows) {
  elements.leaderboardList.innerHTML = ''
  elements.leaderboardEmpty.hidden = rows.length > 0

  rows.forEach((row, index) => {
    const item = document.createElement('li')
    const screamType = leaderboardScreamType(row.scream_type)
    item.innerHTML = `
      <span class="leaderboard-rank">${rankLabel(index + 1)}</span>
      <span class="leaderboard-name">${escapeHtml(row.nickname).toUpperCase()}</span>
      <span class="leaderboard-score">${formatScore(row.score)}</span>
      <span class="leaderboard-type">${escapeHtml(screamType)}</span>
    `
    elements.leaderboardList.append(item)
  })
}

function renderUserRank(rank) {
  elements.rankCallout.hidden = !rank
  if (rank) elements.userRank.textContent = `#${rank}`
}

async function shareChallenge() {
  const score = state.lastSummary?.score ?? (Number.parseInt(elements.scoreResult.textContent, 10) || 0)
  const shareUrl = window.location.origin
  const text = `I scored ${formatScore(score)} on Scream App. Think you can beat me?`

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Scream App',
        text,
        url: shareUrl
      })
    } else {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      setNote('Challenge link copied. Send it to someone loud.')
    }
  } catch (error) {
    setNote('Could not share this round. The scream remains iconic.')
  }
}

function scrollToLeaderboard() {
  elements.leaderboardPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function ensureMeterReady() {
  if (!getUserMediaApi()) {
    throw new Error('navigator.mediaDevices.getUserMedia() is not available in this browser/context.')
  }

  if (!LoudnessMeter) {
    throw new Error('Needles loudness library did not load.')
  }

  if (!state.audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) throw new Error('Web Audio API AudioContext is not available.')
    state.audioContext = new AudioContext()
  }

  if (!state.micStream) {
    state.micStream = await requestMicrophoneStream()
    state.micStream.getTracks().forEach((track) => {
      track.onended = () => {
        state.micReady = false
        setScreamButtonReady(false)
        setMicStatus(false, 'Microphone disconnected')
        setNote('Microphone disconnected. Click Ask Mic Permission again.')
      }
    })
    setMicStatus(true, 'Microphone detected')
  }

  if (!state.micSource) {
    state.micSource = state.audioContext.createMediaStreamSource(state.micStream)
  }

  if (!state.loudnessMeter) {
    state.loudnessMeter = new LoudnessMeter({
      source: state.micSource,
      workerUri: './needles-worker.js',
      modes: ['momentary', 'short-term', 'integrated']
    })

    state.loudnessMeter.on('dataavailable', handleNeedlesData)
    state.loudnessMeter.on('stop', () => {
      elements.debugLatency.textContent = state.firstNeedlesEventAt
        ? `${Math.round(state.firstNeedlesEventAt - state.startedAt)}ms first event`
        : 'no event before stop'
    })
  }
}

async function requestMicrophoneStream() {
  try {
    return await getUserMedia({ audio: true })
  } catch (error) {
    if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      setNote('Mic constraints were not supported. Retrying with default microphone settings.')
      return getUserMedia({ audio: true })
    }
    throw error
  }
}

function getUserMediaApi() {
  return navigator.mediaDevices?.getUserMedia ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
}

function getUserMedia(constraints) {
  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints)
  }

  const legacyGetUserMedia = getUserMediaApi()
  if (!legacyGetUserMedia) {
    return Promise.reject(new Error('Microphone API unavailable.'))
  }

  return new Promise((resolve, reject) => {
    legacyGetUserMedia.call(navigator, constraints, resolve, reject)
  })
}

function handleNeedlesData(event) {
  const { mode, value } = event.data
  const normalizedMode = mode === 'short-term' ? 'shortTerm' : mode

  if (!state.isRecording) return

  state.latest[normalizedMode] = value

  if (Number.isFinite(value)) {
    if (!state.firstNeedlesEventAt) {
      state.firstNeedlesEventAt = performance.now()
      elements.debugLatency.textContent = `${Math.round(state.firstNeedlesEventAt - state.startedAt)}ms first event`
    }

    if (mode === 'momentary') {
      state.observed.peak = Math.max(state.observed.peak, value)
      state.observed.momentaryValues.push(value)
    }

    if (mode === 'integrated') {
      state.observed.integrated = value
    }
  }

  updateLiveLoudness(mode, value)
  updateDebugValues()
}

function summarizeScream(durationSeconds) {
  const values = state.observed.momentaryValues
  const averageMomentary = mean(values)
  const hasNeedlesIntegrated = Number.isFinite(state.observed.integrated)
  const integrated = hasNeedlesIntegrated ? state.observed.integrated : averageMomentary
  const consistency = calculateConsistency(values)
  const score = calculateScreamScore({
    peakLufs: state.observed.peak,
    integratedLufs: integrated,
    durationSeconds,
    consistency
  })
  const type = classifyScreamType({
    score,
    durationSeconds,
    peakLufs: state.observed.peak,
    integratedLufs: integrated
  })

  return {
    peak: state.observed.peak,
    integrated,
    integratedSource: hasNeedlesIntegrated ? 'needles-integrated' : 'fallback-average',
    duration: durationSeconds,
    consistency,
    score,
    type
  }
}

async function requestFunnyCaption(summary, requestId) {
  try {
    const response = await fetch('/api/funny-caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: summary.score,
        duration: Number(summary.duration.toFixed(2)),
        type: summary.type
      })
    })

    if (!response.ok) throw new Error(`Caption API returned ${response.status}`)

    const data = await response.json()
    if (requestId !== state.captionRequestId) return

    setCaptionIcon(summary.type, summary.score)
    elements.captionResult.textContent = validateCaption(data.caption)
      ? data.caption
      : frontendFallbackCaption(summary.score)
    setReactionGif(validateGif(data.gif) ? data.gif : frontendFallbackGif(summary.score))
    state.lastReaction = {
      caption: elements.captionResult.textContent,
      gifUrl: validateGif(data.gif) ? data.gif.url : frontendFallbackGif(summary.score).url
    }
    elements.submitScoreButton.disabled = false
    elements.submitScoreButton.title = ''
    elements.shareButton.disabled = false
  } catch (error) {
    if (requestId !== state.captionRequestId) return
    setCaptionIcon(summary.type, summary.score)
    elements.captionResult.textContent = frontendFallbackCaption(summary.score)
    setReactionGif(frontendFallbackGif(summary.score))
    state.lastReaction = {
      caption: elements.captionResult.textContent,
      gifUrl: frontendFallbackGif(summary.score).url
    }
    elements.submitScoreButton.disabled = false
    elements.submitScoreButton.title = ''
    elements.shareButton.disabled = false
  }
}

function calculateScreamScore({
  peakLufs,
  integratedLufs,
  durationSeconds,
  consistency
}) {
  const peakPoints = normalizeLufs(peakLufs) * 45
  const integratedPoints = normalizeLufs(integratedLufs) * 35
  const durationPoints = clamp(durationSeconds / 4, 0, 1) * 15
  const consistencyPoints = consistency * 5

  return Math.round(clamp(peakPoints + integratedPoints + durationPoints + consistencyPoints, 0, 100))
}

function calculateConsistency(values) {
  if (values.length < 3) return 0
  const avg = mean(values)
  const variance = mean(values.map((value) => (value - avg) ** 2))
  const standardDeviation = Math.sqrt(variance)
  return clamp(1 - standardDeviation / 18, 0, 1)
}

function classifyScreamType({
  score,
  durationSeconds,
  peakLufs,
  integratedLufs
}) {
  const seed = screamTypeSeed({ score, durationSeconds, peakLufs, integratedLufs })

  if (score >= 90) {
    return pickScreamType('extreme', seed)
  }

  if (score >= 75) {
    return pickScreamType('high', seed)
  }

  if (durationSeconds >= 3.5 && score >= 50) return pickScreamType('medium', seed + 17)
  if (Number.isFinite(peakLufs) && Number.isFinite(integratedLufs) && peakLufs - integratedLufs > 18) {
    return pickScreamType(score >= 45 ? 'medium' : 'low', seed + 31)
  }

  if (score >= 45) {
    return pickScreamType('medium', seed)
  }

  if (score >= 20) {
    return pickScreamType('low', seed)
  }

  return pickScreamType('mystery', seed)
}

function screamTypeSeed({
  score,
  durationSeconds,
  peakLufs,
  integratedLufs
}) {
  const peak = Number.isFinite(peakLufs) ? Math.round((peakLufs + 80) * 10) : 0
  const integrated = Number.isFinite(integratedLufs) ? Math.round((integratedLufs + 80) * 10) : 0
  return (score * 37) + Math.round(durationSeconds * 113) + (peak * 7) + (integrated * 13)
}

function pickScreamType(bucket, seed) {
  const types = SCREAM_TYPES[bucket] || SCREAM_TYPES.mystery
  return types[Math.abs(seed) % types.length]
}

function resetScreamStats() {
  state.latest.momentary = Number.NEGATIVE_INFINITY
  state.latest.shortTerm = Number.NEGATIVE_INFINITY
  state.latest.integrated = Number.NEGATIVE_INFINITY
  state.observed.peak = Number.NEGATIVE_INFINITY
  state.observed.momentaryValues = []
  state.observed.integrated = Number.NEGATIVE_INFINITY

  updateLiveLoudness('momentary', Number.NEGATIVE_INFINITY)
  updateDurationDisplays(0)
  updateDebugValues()
  elements.scoreResult.textContent = '0'
}

function resetResultPanel() {
  elements.peakResult.textContent = '-'
  elements.integratedResult.textContent = '-'
  elements.durationResult.textContent = '-'
  elements.scoreResult.textContent = '0'
  elements.screamTypeResult.textContent = '-'
  setCaptionIcon('default', 0)
  resetReactionGif()
  elements.captionResult.textContent = 'Funny reaction will appear here.'
  elements.todayRank.textContent = '#7 TODAY'
  elements.submitScoreButton.disabled = true
  elements.submitScoreButton.textContent = 'SUBMIT TO LEADERBOARD'
  elements.submitScoreButton.title = 'Finish a scream first, then submit the result.'
  elements.shareButton.disabled = true
}

function setReactionLoading() {
  elements.reactionMedia.hidden = false
  elements.reactionMedia.classList.add('is-loading')
  elements.reactionGif.removeAttribute('src')
  elements.reactionAttribution.textContent = ''
}

function setReactionGif(gif, options = {}) {
  elements.reactionMedia.hidden = false
  elements.reactionMedia.classList.toggle('is-loading', Boolean(options.loading))
  elements.reactionGif.src = gif.url
  elements.reactionGif.alt = gif.title || 'Funny scream reaction'
  elements.reactionAttribution.textContent = options.loading ? 'Loading matching reaction...' : gif.attribution || ''
}

function resetReactionGif() {
  elements.reactionMedia.hidden = true
  elements.reactionMedia.classList.remove('is-loading')
  elements.reactionGif.removeAttribute('src')
  elements.reactionGif.alt = 'Funny scream reaction'
  elements.reactionAttribution.textContent = ''
}

function handleReactionImageError() {
  const currentSrc = elements.reactionGif.getAttribute('src') || ''
  if (currentSrc.includes('assets/reactions/')) return

  const currentScore = Number.parseInt(elements.scoreResult.textContent, 10)
  setReactionGif(frontendFallbackGif(Number.isFinite(currentScore) ? currentScore : 0))
}

function setCaptionIcon(type, score) {
  const iconName = iconNameForScream(type, score)
  elements.captionIcon.innerHTML = iconSvg(iconName)
  elements.captionIcon.dataset.icon = iconName
}

function iconNameForScream(type, score) {
  const normalizedType = String(type || '').toLowerCase()
  if (score >= 90 || normalizedType.includes('fire alarm') || normalizedType.includes('t-rex') || normalizedType.includes('jet engine') || normalizedType.includes('detonation')) return 'broadcast'
  if (normalizedType.includes('kettle') || normalizedType.includes('steam') || normalizedType.includes('fire drill')) return 'flame'
  if (normalizedType.includes('finals') || normalizedType.includes('deadline')) return 'clock'
  if (normalizedType.includes('megaphone')) return 'bolt'
  if (normalizedType.includes('corporate') || normalizedType.includes('customer service')) return 'users'
  if (normalizedType.includes('wi-fi') || normalizedType.includes('router')) return 'wifiOff'
  if (normalizedType.includes('printer') || normalizedType.includes('unclassified')) return 'bell'
  return 'message'
}

function iconSvg(name) {
  const icons = {
    bell: coloredIcon('bell', '#8b5cf6', '#22d3ee', '<path d="M17 15H7c1.4-1.5 2-3.6 2-6a3 3 0 1 1 6 0c0 2.4.6 4.5 2 6Z" fill="#fff"/><path d="M11 18h2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'),
    bolt: coloredIcon('bolt', '#f97316', '#fde047', '<path d="M20 4 9 18h5l-1 7 11-15h-5l1-6Z" fill="#fff"/>'),
    broadcast: coloredIcon('broadcast', '#ef4444', '#f97316', '<circle cx="18" cy="18" r="3" fill="#fff"/><path d="M10 24a11 11 0 1 1 16 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M13 21a7 7 0 1 1 10 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>'),
    clock: coloredIcon('clock', '#06b6d4', '#3b82f6', '<circle cx="18" cy="18" r="10" fill="#fff"/><path d="M18 12v7l5 3" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
    flame: coloredIcon('flame', '#fb7185', '#facc15', '<path d="M18 29c5 0 8-3.4 8-8 0-5.7-5.2-8.3-5.2-14-4.4 2.7-8.8 6.7-8.8 14 0 4.6 2.5 8 6 8Z" fill="#fff"/><path d="M18 27c2.3 0 4-1.6 4-4 0-2.2-1.9-3.6-2.8-5.8-2.2 1.5-4.2 3.4-4.2 5.9 0 2.3 1.2 3.9 3 3.9Z" fill="#fb7185"/>'),
    message: coloredIcon('message', '#14b8a6', '#84cc16', '<path d="M9 10h18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H17l-6 4v-4H9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" fill="#fff"/>'),
    users: coloredIcon('users', '#6366f1', '#ec4899', '<circle cx="15" cy="15" r="4" fill="#fff"/><circle cx="24" cy="16" r="3" fill="#fff" opacity=".8"/><path d="M7 28c1-4 4-7 8-7s7 3 8 7H7Z" fill="#fff"/><path d="M20 28c.8-3 2.6-5 5-5 2.2 0 4.1 1.8 5 5H20Z" fill="#fff" opacity=".8"/>'),
    wifiOff: coloredIcon('wifiOff', '#64748b', '#22d3ee', '<path d="M8 15a16 16 0 0 1 20 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M12 20a10 10 0 0 1 12 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M16 25a4 4 0 0 1 4 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M8 8l20 20" stroke="#111827" stroke-width="3.2" stroke-linecap="round"/>')
  }

  return icons[name] || icons.message
}

function coloredIcon(id, startColor, endColor, content) {
  return `<svg viewBox="0 0 36 36" aria-hidden="true"><defs><linearGradient id="caption-${id}" x1="6" y1="4" x2="30" y2="32"><stop stop-color="${startColor}"/><stop offset="1" stop-color="${endColor}"/></linearGradient></defs><circle cx="18" cy="18" r="17" fill="url(#caption-${id})"/><circle cx="26.5" cy="8.5" r="4" fill="#fff" opacity=".28"/>${content}</svg>`
}

function updateLiveLoudness(mode, value) {
  if (mode === 'momentary') {
    elements.liveMomentary.textContent = formatLufs(value)
    elements.meterFill.style.height = `${normalizeLufs(value) * 100}%`
  }
  elements.liveMode.textContent = mode
}

function updateDebugValues() {
  const duration = state.isRecording ? elapsedSeconds() : Number.parseFloat(elements.durationLive.dataset.seconds || '0')
  const currentSummary = summarizeScream(duration)

  elements.debugMomentary.textContent = formatLufs(state.latest.momentary)
  elements.debugShortTerm.textContent = formatLufs(state.latest.shortTerm)
  elements.debugIntegrated.textContent = formatLufs(state.latest.integrated)
  elements.debugScore.textContent = currentSummary.score.toString()
}

function tickDuration() {
  clearInterval(state.timerId)
  updateDurationDisplays(0)
  state.timerId = setInterval(() => {
    const duration = elapsedSeconds()
    updateDurationDisplays(duration)
    updateDebugValues()
  }, 50)
}

function updateDurationDisplays(seconds) {
  const formatted = formatSeconds(seconds)
  elements.durationLive.dataset.seconds = seconds.toString()
  elements.durationLive.textContent = formatted
  elements.debugDuration.textContent = formatted
}

function elapsedSeconds() {
  if (!state.startedAt) return 0
  return (performance.now() - state.startedAt) / 1000
}

function setMicStatus(isReady, text) {
  elements.micStatus.textContent = text
  elements.debugMicDetected.textContent = isReady ? 'true' : 'false'
  elements.micStatusDot.classList.toggle('is-ready', isReady)
  elements.micStatusDot.classList.toggle('is-error', !isReady && text !== 'Microphone not requested')
}

function setScreamButtonReady(isReady) {
  elements.screamButton.disabled = !isReady
  elements.screamButton.textContent = isReady ? 'HOLD TO SCREAM' : 'ENABLE MIC FIRST'
}

async function updateMicrophonePermissionStatus(error) {
  if (error?.name === 'NotAllowedError') {
    elements.debugMicPermission.textContent = 'denied'
    return 'denied'
  }

  if (!navigator.permissions?.query) {
    elements.debugMicPermission.textContent = 'unknown'
    return 'unknown'
  }

  try {
    const permission = await navigator.permissions.query({ name: 'microphone' })
    elements.debugMicPermission.textContent = permission.state
    permission.onchange = () => {
      elements.debugMicPermission.textContent = permission.state
      if (permission.state === 'denied') {
        state.micReady = false
        setScreamButtonReady(false)
        setMicStatus(false, 'Microphone permission denied')
      }
    }
    return permission.state
  } catch (permissionError) {
    elements.debugMicPermission.textContent = 'unknown'
    return 'unknown'
  }
}

function setNote(text) {
  elements.debugNotes.textContent = text
}

function clearMicError() {
  elements.debugMicError.textContent = 'none'
}

function setMicError(error) {
  const name = error?.name || 'Error'
  const message = error?.message || 'No browser error message.'
  elements.debugMicError.textContent = `${name}: ${message}`
}

function stopMicrophoneTracks() {
  state.micStream?.getTracks().forEach((track) => track.stop())
}

function microphoneErrorMessage(error) {
  if (error.message?.includes('Needles loudness library')) return 'Needles library unavailable'
  if (error.message?.includes('getUserMedia')) return 'Microphone API unavailable'
  if (error.message?.includes('AudioContext')) return 'Web Audio unavailable'
  if (error.name === 'NotAllowedError') return 'Microphone permission denied'
  if (error.name === 'NotFoundError') return 'No microphone found'
  if (error.name === 'NotReadableError') return 'Microphone is busy'
  if (error.name === 'AbortError') return 'Microphone startup failed'
  if (error.name === 'SecurityError') return 'Microphone blocked by browser security'
  return 'Microphone unavailable'
}

function microphoneDebugMessage(error) {
  if (error.message?.includes('Needles loudness library')) {
    return 'Needles did not load, so microphone may be allowed but loudness metering cannot start. Reload the page and check the vendor script path.'
  }

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
