<script setup>
import { ref } from 'vue'
import { useSquatCounter } from './composables/useSquatCounter'
import { useTimer } from './composables/useTimer'
import { useAudio } from './composables/useAudio'

import CounterDisplay from './components/CounterDisplay.vue'
import TimerDisplay from './components/TimerDisplay.vue'
import StatusFeedback from './components/StatusFeedback.vue'
import ControlPanel from './components/ControlPanel.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import ResultModal from './components/ResultModal.vue'

const { playBeep, initAudio } = useAudio()

const error = ref('')
const isPermissionDenied = ref(false)
const showModal = ref(false)
const finalCount = ref(0)

const handleTimeUp = () => {
  stopMeasurement()
}

const { timeLeft, isRunning, startTimer, stopTimer, resetTimer } = useTimer(60, handleTimeUp)

const { count, isSquatting, start, stop, reset } = useSquatCounter({
  onCount: () => playBeep()
})

const startMeasurement = async () => {
  try {
    error.value = ''
    isPermissionDenied.value = false
    await initAudio()
    await start()
    startTimer()
  } catch (e) {
    if (e.message === 'Permission denied') {
      error.value = 'センサーの利用が拒否されました。再度許可するには、ページを再読み込みして、もう一度「計測開始」ボタンを押してください。'
      isPermissionDenied.value = true
    } else {
      error.value = 'センサーの許可が必要です: ' + e.message
    }
  }
}

const stopMeasurement = () => {
  stop()
  stopTimer()
  if (count.value > 0) {
    finalCount.value = count.value
    showModal.value = true
  }
}

const resetAll = () => {
  reset()
  resetTimer()
  error.value = ''
  isPermissionDenied.value = false
}
</script>

<template>
  <div class="container" :class="{ 'squatting-bg': isSquatting }">
    <h1>スクワットタイマー</h1>

    <TimerDisplay :time-left="timeLeft" />
    <CounterDisplay :count="count" />
    <StatusFeedback :is-squatting="isSquatting" />

    <ControlPanel
      :is-running="isRunning"
      @start="startMeasurement"
      @stop="stopMeasurement"
      @reset="resetAll"
    />

    <ErrorMessage :error="error" :is-permission-denied="isPermissionDenied" />

    <ResultModal
      :show="showModal"
      :count="finalCount"
      @close="showModal = false"
    />
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
</style>
