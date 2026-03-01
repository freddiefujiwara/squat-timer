<script setup>
defineProps({
  isSquatting: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="status-feedback">
    <p v-if="isSquatting" class="status-text squatting">しゃがんでいます</p>
    <p v-else class="status-text standing">立ち上がっています</p>
  </div>
</template>

<style scoped>
.status-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  height: 2rem;
}

.squatting {
  color: #38b2ac;
}

.standing {
  color: #4a5568;
}
</style>
