import { ref, onUnmounted, readonly } from 'vue'

export function useTimer(duration = 60, onTimeUp = null) {
  const timeLeft = ref(duration)
  const isRunning = ref(false)
  let timerId = null

  const startTimer = () => {
    if (isRunning.value) return

    timeLeft.value = duration
    isRunning.value = true

    timerId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stopTimer()
        if (onTimeUp) onTimeUp()
      }
    }, 1000)
  }

  const stopTimer = () => {
    isRunning.value = false
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    timeLeft.value = duration
  }

  onUnmounted(() => {
    stopTimer()
  })

  return {
    timeLeft: readonly(timeLeft),
    isRunning: readonly(isRunning),
    startTimer,
    stopTimer,
    resetTimer
  }
}
