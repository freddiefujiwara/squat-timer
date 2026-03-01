import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSquatCounter } from '../composables/useSquatCounter'

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

    global.DeviceMotionEvent = {
      requestPermission: vi.fn().mockResolvedValue('granted')
    }

    const counter = useSquatCounter()
    await counter.start()

    const handler = mockAddEventListener.mock.calls.find(call => call[0] === 'devicemotion')[1]

    // Simulate squatting down multiple times to overcome low-pass filter
    // Gravity is ~9.8. Target < -1.5.
    // Alpha is 0.2.
    for(let i=0; i<20; i++) {
        handler({
            accelerationIncludingGravity: { x: 0, y: 0, z: 5 } // 5 - 9.8 = -4.8
        })
    }
    expect(counter.isSquatting.value).toBe(true)

    // Simulate standing up
    for(let i=0; i<20; i++) {
        handler({
            accelerationIncludingGravity: { x: 0, y: 0, z: 15 } // 15 - 9.8 = 5.2
        })
    }
    expect(counter.count.value).toBe(1)
    expect(counter.isSquatting.value).toBe(false)
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

    // Immediate second squat (within 1s)
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(1) // Still 1 because of Date.now() and CHATTERING_DELAY

    // Need to advance system time for Date.now()
    vi.setSystemTime(Date.now() + 1100)

    // After delay
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 5 } })
    for(let i=0; i<20; i++) handler({ accelerationIncludingGravity: { x: 0, y: 0, z: 15 } })
    expect(counter.count.value).toBe(2)
  })
})
