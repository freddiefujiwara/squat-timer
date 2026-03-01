<script setup>
defineProps({
  timeLeft: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="timer-display">
    残り時間: <span class="time">{{ timeLeft }}</span>秒
  </div>
</template>

<style scoped>
.timer-display {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.time {
  font-weight: bold;
  color: #e53e3e;
}
</style>
