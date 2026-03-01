<script setup>
import { ref, computed } from 'vue'
import { useSquatCounter } from './composables/useSquatCounter'

const { count, isSquatting, start, stop, reset, onCount } = useSquatCounter()

const isRunning = ref(false)
const timeLeft = ref(60)
const timer = ref(null)
const records = ref([])
const error = ref('')

let audioCtx = null

const playBeep = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 0.1)
}

onCount.value = () => {
  playBeep()
}

const startMeasurement = async () => {
  try {
    error.value = ''
    // Initialize audio context on user gesture
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    await start()
    isRunning.value = true
    startTimer()
  } catch (e) {
    error.value = 'センサーの許可が必要です: ' + e.message
  }
}

const startTimer = () => {
  timeLeft.value = 60
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopMeasurement()
      saveRecord()
    }
  }, 1000)
}

const saveRecord = () => {
  const now = new Date()
  records.value.unshift({
    date: now.toLocaleString(),
    count: count.value
  })
}

const stopMeasurement = () => {
  stop()
  isRunning.value = false
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const resetAll = () => {
  reset()
  timeLeft.value = 60
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  isRunning.value = false
}
</script>

<template>
  <div class="container" :class="{ 'squatting-bg': isSquatting }">
    <h1>スクワットカウンター</h1>

    <div class="timer-display">
      残り時間: <span class="time">{{ timeLeft }}</span>秒
    </div>

    <div class="counter-display">
      <span class="count">{{ count }}</span>
      <span class="unit">回</span>
    </div>

    <div class="status-feedback">
      <p v-if="isSquatting" class="status-text squatting">しゃがんでいます</p>
      <p v-else class="status-text standing">立ち上がっています</p>
    </div>

    <div class="controls">
      <button v-if="!isRunning" @click="startMeasurement" class="btn primary">計測開始</button>
      <button v-else @click="stopMeasurement" class="btn secondary">計測停止</button>
      <button @click="resetAll" class="btn outline">リセット</button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="records.length > 0" class="records">
      <h2>記録</h2>
      <ul>
        <li v-for="(record, index) in records" :key="index">
          {{ record.date }} : <strong>{{ record.count }}</strong> 回
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: #213547;
  background-color: #ffffff;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  width: 100%;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 20px;
}

.squatting-bg {
  background-color: #e6fffa;
}

.counter-display {
  font-size: 8rem;
  font-weight: bold;
  margin: 2rem 0;
}

.unit {
  font-size: 2rem;
  margin-left: 0.5rem;
}

.status-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  height: 2rem;
}

.squatting {
  color: #38b2ac;
}

.standing {
  color: #4a5568;
}

.timer-display {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.time {
  font-weight: bold;
  color: #e53e3e;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary {
  background-color: #4fd1c5;
  color: white;
}

.primary:hover {
  background-color: #38b2ac;
}

.secondary {
  background-color: #fc8181;
  color: white;
}

.outline {
  background-color: transparent;
  border: 2px solid #cbd5e0;
  color: #4a5568;
}

.error-message {
  margin-top: 1rem;
  color: #e53e3e;
}

.records {
  margin-top: 3rem;
  text-align: left;
  border-top: 1px solid #cbd5e0;
  padding-top: 1rem;
}

.records h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.records ul {
  list-style: none;
  padding: 0;
}

.records li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #edf2f7;
}
</style>
