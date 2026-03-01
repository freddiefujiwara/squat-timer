import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSquatCounter } from '../composables/useSquatCounter'
import { mount } from '@vue/test-utils'

describe('useSquatCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.restoreAllMocks()
    // Reset DeviceMotionEvent
    global.DeviceMotionEvent = undefined
  })

  it('should initialize with count 0', () => {
    const { count } = useSquatCounter()
    expect(count.value).toBe(0)
  })

  it('should increment count when a squat sequence is detected', async () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener')
    const onCount = vi.fn()

    global.DeviceMotionEvent = {
      requestPermission: vi.fn().mockResolvedValue('granted')
    }

    const counter = useSquatCounter({ onCount })
    await counter.start()

    const handler = mockAddEventListener.mock.calls.find(call => call[0] === 'devicemotion')[1]

    // Simulate squatting down
    for(let i=0; i<20; i++) {
        handler({
            accelerationIncludingGravity: { x: 0, y: 0, z: 5 }
        })
    }
    expect(counter.isSquatting.value).toBe(true)

    // Simulate standing up
    for(let i=0; i<20; i++) {
        handler({
            accelerationIncludingGravity: { x: 0, y: 0, z: 15 }
        })
    }
    expect(counter.count.value).toBe(1)
    expect(counter.isSquatting.value).toBe(false)
    expect(onCount).toHaveBeenCalledWith(1)
  })

  it('should not count twice within chattering delay', async () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener')
    global.DeviceMotionEvent = {
      requestPermission: vi.fn().mockResolvedValue('granted')
    }

    const counter = useSquatCounter()
    await counter.start()
    const handler = mockAddEventListener.mock.calls.find(call => call[0] === 'devicemotion')[1]

    // First squat
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(1)

    // Immediate second squat
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(1)

    vi.setSystemTime(Date.now() + 1100)

    // After delay
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(2)
  })

  it('should handle missing accelerationIncludingGravity', async () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener')
    const counter = useSquatCounter()
    await counter.start()
    const handler = mockAddEventListener.mock.calls.find(call => call[0] === 'devicemotion')[1]

    expect(() => handler({})).not.toThrow()
  })

  it('should handle permission denial', async () => {
    global.DeviceMotionEvent = {
      requestPermission: vi.fn().mockResolvedValue('denied')
    }
    const counter = useSquatCounter()
    await expect(counter.start()).rejects.toThrow('Permission not granted')
  })

  it('should stop listening on stop()', async () => {
    const mockRemoveEventListener = vi.spyOn(window, 'removeEventListener')
    const counter = useSquatCounter()
    counter.stop()
    expect(mockRemoveEventListener).toHaveBeenCalledWith('devicemotion', expect.any(Function))
  })

  it('should reset state on reset()', async () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener')
    const counter = useSquatCounter()
    await counter.start()
    const handler = mockAddEventListener.mock.calls.find(call => call[0] === 'devicemotion')[1]

    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(1)

    counter.reset()
    expect(counter.count.value).toBe(0)
    expect(counter.isSquatting.value).toBe(false)
  })

  it('should stop listening on unmount', () => {
    const mockRemoveEventListener = vi.spyOn(window, 'removeEventListener')
    const TestComponent = {
      setup() {
        return useSquatCounter()
      },
      template: '<div></div>'
    }
    const wrapper = mount(TestComponent)
    wrapper.unmount()
    expect(mockRemoveEventListener).toHaveBeenCalledWith('devicemotion', expect.any(Function))
  })
})
