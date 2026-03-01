export function useAudio() {
  // インスタンスをクロージャの外、またはシングルトンとして保持
  let audioCtx = null

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    // iOS対策: 常にresumeを試みる
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // 【重要】初回のクリック時に「空のバッファ」を再生してアンロックする
    const buffer = audioCtx.createBuffer(1, 1, 22050)
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    source.start(0)

    return audioCtx
  }

  const playBeep = () => {
    // 既に初期化されている前提（センサー反応時に実行）
    if (!audioCtx || audioCtx.state === 'suspended') return

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime)
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
