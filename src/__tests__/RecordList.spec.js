import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecordList from '../components/RecordList.vue'

describe('RecordList', () => {
  it('should not render when records are empty', () => {
    const wrapper = mount(RecordList, {
      props: { records: [] }
    })
    expect(wrapper.find('.records').exists()).toBe(false)
  })

  it('should render records list', () => {
    const records = [
      { id: 1, date: '2023/1/1 10:00:00', count: 10 },
      { id: 2, date: '2023/1/1 11:00:00', count: 20 }
    ]
    const wrapper = mount(RecordList, {
      props: { records }
    })
    expect(wrapper.find('.records').exists()).toBe(true)
    const items = wrapper.findAll('li')
    expect(items.length).toBe(2)
    expect(items[0].text()).toContain('2023/1/1 10:00:00')
    expect(items[0].text()).toContain('10')
  })
})
