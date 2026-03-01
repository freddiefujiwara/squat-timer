import { ref, onUnmounted, getCurrentInstance, readonly } from 'vue'

export function useSquatCounter(options = {}) {
  const { onCount } = options
  const count = ref(0)
  const isSquatting = ref(false)
  const lastCountTime = ref(0)

  // Low-pass filter alpha
  const alpha = 0.2
  let filteredMotion = 0

  // Thresholds
  const SQUAT_THRESHOLD = 1.5 // m/s^2 deviation from gravity
  const CHATTERING_DELAY = 1000 // 1 second

  const handleMotion = (event) => {
    const acc = event.accelerationIncludingGravity
    if (!acc) return

    // Calculate raw motion value (deviation from gravity)
    const rawMotion = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) - 9.8

    // Apply low-pass filter
    filteredMotion = alpha * rawMotion + (1 - alpha) * filteredMotion

    // We use the filtered value for thresholding to reduce noise
    const motionValue = filteredMotion

    if (!isSquatting.value) {
      if (motionValue > SQUAT_THRESHOLD) {
        isSquatting.value = true
      }
    } else {
      if (motionValue < -SQUAT_THRESHOLD) {
        const now = Date.now()
        if (now - lastCountTime.value > CHATTERING_DELAY) {
          count.value++
          lastCountTime.value = now
          if (onCount) onCount(count.value)
        }
        isSquatting.value = false
      }
    }
  }

  const start = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      const permission = await DeviceMotionEvent.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Permission not granted')
      }
    }
    window.addEventListener('devicemotion', handleMotion)
  }

  const stop = () => {
    window.removeEventListener('devicemotion', handleMotion)
  }

  const reset = () => {
    count.value = 0
    isSquatting.value = false
    lastCountTime.value = 0
    filteredMotion = 0
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      stop()
    })
  }

  return {
    count: readonly(count),
    isSquatting: readonly(isSquatting),
    start,
    stop,
    reset
  }
}
