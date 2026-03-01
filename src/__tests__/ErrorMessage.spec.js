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
    expect(wrapper.find('.error-message').text()).toBe('Test error')
  })

  it('should show reload button when isPermissionDenied is true', () => {
    const wrapper = mount(ErrorMessage, {
      props: { error: 'Test error', isPermissionDenied: true }
    })
    expect(wrapper.find('.btn-reload').exists()).toBe(true)
    expect(wrapper.find('.btn-reload').text()).toBe('再読み込みして許可する')
  })

  it('should not show reload button when isPermissionDenied is false', () => {
    const wrapper = mount(ErrorMessage, {
      props: { error: 'Test error', isPermissionDenied: false }
    })
    expect(wrapper.find('.btn-reload').exists()).toBe(false)
  })
})
