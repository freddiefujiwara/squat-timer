import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CounterDisplay from '../components/CounterDisplay.vue'

describe('CounterDisplay', () => {
  it('should render the count', () => {
    const wrapper = mount(CounterDisplay, {
      props: { count: 42 }
    })
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('回')
  })
})
