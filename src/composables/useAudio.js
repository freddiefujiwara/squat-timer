export function useAudio() {
  let audioCtx = null

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Force resume and play a silent buffer/oscillator to unlock audio on iOS
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Kickstart strategies for iOS
    try {
      // Strategy 1: Silent Buffer
      const buffer = audioCtx.createBuffer(1, 1, 22050)
      const source = audioCtx.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx.destination)
      source.start(0)

      // Strategy 2: Short silent oscillator
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      gain.gain.value = 0.001 // tiny volume
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(0)
      osc.stop(audioCtx.currentTime + 0.001)

      // Strategy 3: HTML5 Audio poke (many iOS versions require this for Web Audio to work)
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==')
      silentAudio.play().catch(() => {})
    } catch (e) {
      console.error('Audio kickstart failed:', e)
    }

    return audioCtx
  }

  const playBeep = () => {
    const ctx = initAudio()

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    // Use slightly higher frequency and longer duration for better audibility
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime)

    // Smooth gain envelope to avoid clicking and ensure it plays on all devices
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }

  return {
    initAudio,
    playBeep
  }
}
