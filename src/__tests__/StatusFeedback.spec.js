import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusFeedback from '../components/StatusFeedback.vue'

describe('StatusFeedback', () => {
  it('should render standing status', () => {
    const wrapper = mount(StatusFeedback, {
      props: { isSquatting: false }
    })
    expect(wrapper.text()).toContain('立ち上がっています')
  })

  it('should render squatting status', () => {
    const wrapper = mount(StatusFeedback, {
      props: { isSquatting: true }
    })
    expect(wrapper.text()).toContain('しゃがんでいます')
  })
})
