import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { ref } from 'vue'

import * as useSquatCounterModule from '../composables/useSquatCounter'
import * as useTimerModule from '../composables/useTimer'
import * as useAudioModule from '../composables/useAudio'

describe('Bugs Reproduction', () => {
  let mockSquatCounter
  let mockTimer
  let mockAudio

  beforeEach(() => {
    vi.restoreAllMocks()

    mockSquatCounter = {
      count: ref(0),
      isSquatting: ref(false),
      start: vi.fn().mockResolvedValue(),
      stop: vi.fn(),
      reset: vi.fn()
    }
    vi.spyOn(useSquatCounterModule, 'useSquatCounter').mockReturnValue(mockSquatCounter)

    mockTimer = {
      timeLeft: ref(60),
      isRunning: ref(false),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
      resetTimer: vi.fn()
    }
    vi.spyOn(useTimerModule, 'useTimer').mockReturnValue(mockTimer)

    mockAudio = {
      playBeep: vi.fn(),
      initAudio: vi.fn()
    }
    vi.spyOn(useAudioModule, 'useAudio').mockReturnValue(mockAudio)
  })

  it('Issue 1: resetAll should call stop() to remove motion listener', async () => {
    const wrapper = mount(App)
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('reset')
    expect(mockSquatCounter.stop).toHaveBeenCalled()
  })

  it('Issue 2: manual stop should NOT show ResultModal', async () => {
    const wrapper = mount(App)
    mockSquatCounter.count.value = 5
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('stop')

    // ResultModal should NOT be shown
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('show')).toBe(false)
  })

  it('Issue 2: timer expiration SHOULD show ResultModal', async () => {
    const wrapper = mount(App)
    const onTimeUpCallback = useTimerModule.useTimer.mock.calls[0][1]
    mockSquatCounter.count.value = 5

    onTimeUpCallback()
    await wrapper.vm.$nextTick()

    // ResultModal SHOULD be shown
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('show')).toBe(true)
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('count')).toBe(5)
  })
})
