import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultModal from '../components/ResultModal.vue'

describe('ResultModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock navigator.share
    Object.defineProperty(navigator, 'share', {
      writable: true,
      configurable: true,
      value: vi.fn()
    })
    // Mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => {})
  })

  it('should not render when show is false', () => {
    const wrapper = mount(ResultModal, {
      props: {
        count: 10,
        show: false
      }
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('should render count when show is true', () => {
    const wrapper = mount(ResultModal, {
      props: {
        count: 10,
        show: true
      }
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.count').text()).toBe('10')
  })

  it('should emit close when close button is clicked', async () => {
    const wrapper = mount(ResultModal, {
      props: {
        count: 10,
        show: true
      }
    })
    await wrapper.find('.btn-close').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should call navigator.share when share button is clicked and Web Share API is available', async () => {
    const wrapper = mount(ResultModal, {
      props: {
        count: 10,
        show: true
      }
    })

    await wrapper.find('.btn-share').trigger('click')

    expect(navigator.share).toHaveBeenCalledWith({
      title: 'スクワットタイマー',
      text: '10回スクワットしました！ #スクワットタイマー',
      url: 'https://freddiefujiwara.com/squat-timer/'
    })
  })

  it('should call window.open with Twitter URL when Web Share API is not available', async () => {
    // Mock navigator.share as undefined
    Object.defineProperty(navigator, 'share', {
      writable: true,
      configurable: true,
      value: undefined
    })

    const wrapper = mount(ResultModal, {
      props: {
        count: 10,
        show: true
      }
    })

    await wrapper.find('.btn-share').trigger('click')

    const expectedText = encodeURIComponent('10回スクワットしました！ #スクワットタイマー')
    const expectedUrl = encodeURIComponent('https://freddiefujiwara.com/squat-timer/')
    expect(window.open).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${expectedText}&url=${expectedUrl}`,
      '_blank'
    )
  })
})
