import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../composables/useTimer'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with duration and not running', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.timeLeft).toBe(60)
    expect(wrapper.vm.isRunning).toBe(false)
  })

  it('should start timer and decrement timeLeft', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.startTimer()
    expect(wrapper.vm.isRunning).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(wrapper.vm.timeLeft).toBe(59)
  })

  it('should stop timer', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.startTimer()
    wrapper.vm.stopTimer()
    expect(wrapper.vm.isRunning).toBe(false)

    vi.advanceTimersByTime(1000)
    expect(wrapper.vm.timeLeft).toBe(60)
  })

  it('should reset timer', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.startTimer()
    vi.advanceTimersByTime(2000)
    expect(wrapper.vm.timeLeft).toBe(58)

    wrapper.vm.resetTimer()
    expect(wrapper.vm.timeLeft).toBe(60)
    expect(wrapper.vm.isRunning).toBe(false)
  })

  it('should call onTimeUp when timer reaches 0', () => {
    const onTimeUp = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        return useTimer(2, onTimeUp)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.startTimer()

    vi.advanceTimersByTime(2000)
    expect(wrapper.vm.timeLeft).toBe(0)
    expect(wrapper.vm.isRunning).toBe(false)
    expect(onTimeUp).toHaveBeenCalled()
  })

  it('should not start multiple timers', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    const setIntervalSpy = vi.spyOn(global, 'setInterval')

    wrapper.vm.startTimer()
    expect(wrapper.vm.isRunning).toBe(true)

    wrapper.vm.startTimer()
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle timer expiration without onTimeUp callback', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(1)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.startTimer()
    vi.advanceTimersByTime(1000)
    expect(wrapper.vm.timeLeft).toBe(0)
    expect(wrapper.vm.isRunning).toBe(false)
  })

  it('should handle stopTimer when timer is not running', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    expect(() => wrapper.vm.stopTimer()).not.toThrow()
  })

  it('should use default parameters', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.timeLeft).toBe(60)
  })

  it('should clear existing interval if startTimer is called again after reset', () => {
    const TestComponent = defineComponent({
      setup() {
        return useTimer(60)
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    wrapper.vm.startTimer()
    wrapper.vm.resetTimer()
    wrapper.vm.startTimer()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('should clear timer on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const TestComponent = defineComponent({
      setup() {
        const timer = useTimer(60)
        timer.startTimer()
        return timer
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
