import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('useAudio', () => {
  let mockAudioContext
  let mockOscillator
  let mockGainNode

  beforeEach(async () => {
    vi.resetModules()
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
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      }
    }
    mockAudioContext = {
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGainNode),
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

  it('should use webkitAudioContext if AudioContext is not available', async () => {
    const { useAudio } = await import('../composables/useAudio')
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

  it('should initialize and play beep', async () => {
    const { useAudio } = await import('../composables/useAudio')
    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    // mockAudioContext.state is 'suspended' by default in beforeEach
    wrapper.vm.initAudio()

    // Reset state to running so playBeep proceeds
    mockAudioContext.state = 'running'

    // Clear calls from initAudio
    mockAudioContext.createOscillator.mockClear()
    mockAudioContext.createGain.mockClear()
    mockOscillator.start.mockClear()

    wrapper.vm.playBeep()

    expect(mockAudioContext.createOscillator).toHaveBeenCalled()
    expect(mockAudioContext.createGain).toHaveBeenCalled()
    expect(mockOscillator.start).toHaveBeenCalled()
    expect(mockOscillator.stop).toHaveBeenCalled()
    expect(mockAudioContext.resume).toHaveBeenCalled()
  })

  it('should play beep when audio context is already running', async () => {
    const { useAudio } = await import('../composables/useAudio')
    mockAudioContext.state = 'running'
    const TestComponent = defineComponent({
      setup() {
        return useAudio()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.initAudio() // Initialize first
    wrapper.vm.playBeep()

    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('should only create AudioContext once', async () => {
    const { useAudio } = await import('../composables/useAudio')
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
