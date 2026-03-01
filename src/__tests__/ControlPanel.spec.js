import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ControlPanel from '../components/ControlPanel.vue'

describe('ControlPanel', () => {
  it('should render start button when not running', () => {
    const wrapper = mount(ControlPanel, {
      props: { isRunning: false }
    })
    expect(wrapper.find('.primary').text()).toBe('計測開始')
    expect(wrapper.find('.secondary').exists()).toBe(false)
  })

  it('should render stop button when running', () => {
    const wrapper = mount(ControlPanel, {
      props: { isRunning: true }
    })
    expect(wrapper.find('.secondary').text()).toBe('計測停止')
    expect(wrapper.find('.primary').exists()).toBe(false)
  })

  it('should emit events on button clicks', async () => {
    const wrapper = mount(ControlPanel, {
      props: { isRunning: false }
    })

    await wrapper.find('.primary').trigger('click')
    expect(wrapper.emitted().start).toBeTruthy()

    await wrapper.find('.outline').trigger('click')
    expect(wrapper.emitted().reset).toBeTruthy()

    const wrapperRunning = mount(ControlPanel, {
      props: { isRunning: true }
    })
    await wrapperRunning.find('.secondary').trigger('click')
    expect(wrapperRunning.emitted().stop).toBeTruthy()
  })
})
