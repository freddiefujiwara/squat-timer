import { ref, readonly } from 'vue'

export function useRecords() {
  const records = ref([])

  const saveRecord = (count) => {
    const now = new Date()
    records.value.unshift({
      id: now.getTime(),
      date: now.toLocaleString(),
      count
    })
  }

  const clearRecords = () => {
    records.value = []
  }

  return {
    records: readonly(records),
    saveRecord,
    clearRecords
  }
}
