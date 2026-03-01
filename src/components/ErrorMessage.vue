<script setup>
defineProps({
  error: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>

<style scoped>
.error-message {
  margin-top: 1rem;
  color: #e53e3e;
}
</style>
