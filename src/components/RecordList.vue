<script setup>
defineProps({
  records: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div v-if="records.length > 0" class="records">
    <h2>記録</h2>
    <ul>
      <li v-for="record in records" :key="record.id">
        {{ record.date }} : <strong>{{ record.count }}</strong> 回
      </li>
    </ul>
  </div>
</template>

<style scoped>
.records {
  margin-top: 3rem;
  text-align: left;
  border-top: 1px solid #cbd5e0;
  padding-top: 1rem;
}

.records h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.records ul {
  list-style: none;
  padding: 0;
}

.records li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #edf2f7;
}
</style>
