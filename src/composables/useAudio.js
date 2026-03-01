export function useAudio() {
  let audioCtx = null

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Play a silent buffer to unlock audio on iOS
    const buffer = audioCtx.createBuffer(1, 1, 22050)
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    source.start()

    return audioCtx
  }

  const playBeep = () => {
    initAudio()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
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

  return {
    initAudio,
    playBeep
  }
}
