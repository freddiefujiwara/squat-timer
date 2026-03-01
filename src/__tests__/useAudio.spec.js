import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAudio } from '../composables/useAudio'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('useAudio', () => {
  let mockAudioContext
  let mockOscillator
  let mockGainNode

  beforeEach(() => {
    mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      type: '',
      frequency: {
        setValueAtTime: vi.fn()
      }
    }
    mockGainNode = {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      }
    }
    mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      createBuffer: vi.fn(() => ({})),
      createBufferSource: vi.fn(() => ({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn()
      })),
      destination: {},
      currentTime: 0,
      state: 'suspended',
      resume: vi.fn().mockResolvedValue()
    }

    // Use a class mock
    global.window.AudioContext = class {
        constructor() { return mockAudioContext }
    }
    global.window.webkitAudioContext = undefined
  })

  it('should use webkitAudioContext if AudioContext is not available', () => {
    global.window.AudioContext = undefined
    global.window.webkitAudioContext = class {
        constructor() { return mockAudioContext }
    }

    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    const ctx = wrapper.vm.initAudio()
    expect(ctx).toBe(mockAudioContext)
  })

  it('should initialize and play beep', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.playBeep()

    expect(mockAudioContext.createOscillator).toHaveBeenCalled()
    expect(mockAudioContext.createGain).toHaveBeenCalled()
    expect(mockOscillator.start).toHaveBeenCalled()
    expect(mockOscillator.stop).toHaveBeenCalled()
    expect(mockAudioContext.resume).toHaveBeenCalled()
  })

  it('should play beep when audio context is already running', () => {
    mockAudioContext.state = 'running'
    mockAudioContext.resume.mockClear()
    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.playBeep()

    expect(mockAudioContext.resume).not.toHaveBeenCalled()
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('should only create AudioContext once', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.initAudio()
    const ctx1 = wrapper.vm.initAudio()
    const ctx2 = wrapper.vm.initAudio()

    expect(ctx1).toBe(ctx2)
  })
})
