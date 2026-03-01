<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="counter-display">
    <span class="count">{{ count }}</span>
    <span class="unit">回</span>
  </div>
</template>

<style scoped>
.counter-display {
  font-size: 8rem;
  font-weight: bold;
  margin: 2rem 0;
}

.unit {
  font-size: 2rem;
  margin-left: 0.5rem;
}
</style>
