import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRecords } from '../composables/useRecords'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('useRecords', () => {
  it('should initialize with empty records', () => {
    const TestComponent = defineComponent({
      setup() {
        return useRecords()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.records).toEqual([])
  })

  it('should save a record', () => {
    const TestComponent = defineComponent({
      setup() {
        return useRecords()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.saveRecord(10)

    expect(wrapper.vm.records.length).toBe(1)
    expect(wrapper.vm.records[0].count).toBe(10)
    expect(wrapper.vm.records[0].date).toBeDefined()
    expect(wrapper.vm.records[0].id).toBeDefined()
  })

  it('should clear records', () => {
    const TestComponent = defineComponent({
      setup() {
        return useRecords()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.saveRecord(10)
    expect(wrapper.vm.records.length).toBe(1)

    wrapper.vm.clearRecords()
    expect(wrapper.vm.records.length).toBe(0)
  })

  it('should keep records in reverse chronological order', () => {
    const TestComponent = defineComponent({
      setup() {
        return useRecords()
      },
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    wrapper.vm.saveRecord(10)

    // Simulate some time passed for id/date to change
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 1000)
    wrapper.vm.saveRecord(20)
    vi.useRealTimers()

    expect(wrapper.vm.records[0].count).toBe(20)
    expect(wrapper.vm.records[1].count).toBe(10)
  })
})
