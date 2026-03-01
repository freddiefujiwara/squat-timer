import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from '../components/ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('should not render when error is empty', () => {
    const wrapper = mount(ErrorMessage, {
      props: { error: '' }
    })
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('should render error message', () => {
    const wrapper = mount(ErrorMessage, {
      props: { error: 'Test error' }
    })
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.text()).toBe('Test error')
  })
})
