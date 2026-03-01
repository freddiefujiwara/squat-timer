<script setup>
defineProps({
  isRunning: {
    type: Boolean,
    required: true
  }
})

defineEmits(['start', 'stop', 'reset'])
</script>

<template>
  <div class="controls">
    <button v-if="!isRunning" @click="$emit('start')" class="btn primary">計測開始</button>
    <button v-else @click="$emit('stop')" class="btn secondary">計測停止</button>
    <button @click="$emit('reset')" class="btn outline">リセット</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary {
  background-color: #4fd1c5;
  color: white;
}

.primary:hover {
  background-color: #38b2ac;
}

.secondary {
  background-color: #fc8181;
  color: white;
}

.outline {
  background-color: transparent;
  border: 2px solid #cbd5e0;
  color: #4a5568;
}
</style>
