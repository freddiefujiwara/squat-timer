// インスタンスをクロージャの外、またはシングルトンとして保持
let audioCtx = null

export function useAudio() {
  const initAudio = async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    // iOS対策: 常にresumeを試みる
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }

    // 【重要】初回のクリック時に「空のバッファ」を再生してアンロックする
    const buffer = audioCtx.createBuffer(1, 1, 22050)
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    source.start(0)

    // オシレーターも一瞬鳴らして念押しでアンロック
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    gain.gain.value = 0.001
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(0)
    osc.stop(audioCtx.currentTime + 0.01)

    return audioCtx
  }

  const playBeep = () => {
    // 既に初期化されている前提（センサー反応時に実行）
    if (!audioCtx) return

    // もしsuspendedなら再度resumeを試みる（iOSではバックグラウンド遷移などで止まることがある）
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.type = 'sine'
    // 少し周波数を上げて聞き取りやすくする
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime)

    // 0.1秒だと短すぎて消えることがあるので少し長め(0.15s)に
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)

    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.15)
  }

  return {
    initAudio,
    playBeep
  }
}
