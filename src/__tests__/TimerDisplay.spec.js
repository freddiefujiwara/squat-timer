import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimerDisplay from '../components/TimerDisplay.vue'

describe('TimerDisplay', () => {
  it('should render the time left', () => {
    const wrapper = mount(TimerDisplay, {
      props: { timeLeft: 59 }
    })
    expect(wrapper.text()).toContain('残り時間: 59秒')
  })
})
