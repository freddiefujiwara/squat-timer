import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { ref } from 'vue'

import * as useSquatCounterModule from '../composables/useSquatCounter'
import * as useTimerModule from '../composables/useTimer'
import * as useAudioModule from '../composables/useAudio'

describe('App.vue full tests', () => {
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

  it('should render the app title', () => {
    const wrapper = mount(App)
    expect(wrapper.find('h1').text()).toBe('スクワットタイマー')
  })

  it('should call startMeasurement on start event', async () => {
    const wrapper = mount(App)
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('start')
    // Wait for async startMeasurement to complete
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockAudio.initAudio).toHaveBeenCalled()
    expect(mockSquatCounter.start).toHaveBeenCalled()
    expect(mockTimer.startTimer).toHaveBeenCalled()
  })

  it('should handle start error (generic)', async () => {
    mockSquatCounter.start.mockRejectedValue(new Error('Some error'))
    const wrapper = mount(App)
    // Wait for internal promises in startMeasurement
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('start')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.findComponent({ name: 'ErrorMessage' }).props('error')).toContain('センサーの許可が必要です: Some error')
    expect(wrapper.findComponent({ name: 'ErrorMessage' }).props('isPermissionDenied')).toBe(false)
  })

  it('should handle permission denied error specifically', async () => {
    mockSquatCounter.start.mockRejectedValue(new Error('Permission denied'))
    const wrapper = mount(App)
    // Wait for internal promises in startMeasurement
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('start')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.findComponent({ name: 'ErrorMessage' }).props('error')).toContain('センサーの利用が拒否されました')
    expect(wrapper.findComponent({ name: 'ErrorMessage' }).props('isPermissionDenied')).toBe(true)
  })

  it('should call stopMeasurement on stop event', async () => {
    const wrapper = mount(App)
    mockSquatCounter.count.value = 10
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('stop')
    expect(mockSquatCounter.stop).toHaveBeenCalled()
    expect(mockTimer.stopTimer).toHaveBeenCalled()

    // ResultModal should be shown
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('show')).toBe(true)
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('count')).toBe(10)
  })

  it('should call resetAll on reset event', async () => {
    const wrapper = mount(App)
    await wrapper.findComponent({ name: 'ControlPanel' }).vm.$emit('reset')
    expect(mockSquatCounter.reset).toHaveBeenCalled()
    expect(mockTimer.resetTimer).toHaveBeenCalled()
  })

  it('should handle onCount callback', () => {
    mount(App)
    const onCountCallback = useSquatCounterModule.useSquatCounter.mock.calls[0][0].onCount
    onCountCallback()
    expect(mockAudio.playBeep).toHaveBeenCalled()
  })

  it('should handle timer expiration', async () => {
    const wrapper = mount(App)
    const onTimeUpCallback = useTimerModule.useTimer.mock.calls[0][1]
    mockSquatCounter.count.value = 15
    onTimeUpCallback()
    expect(mockSquatCounter.stop).toHaveBeenCalled()

    // ResultModal should be shown
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('show')).toBe(true)
    expect(wrapper.findComponent({ name: 'ResultModal' }).props('count')).toBe(15)
  })
})
