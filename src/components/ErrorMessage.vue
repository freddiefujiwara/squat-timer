<script setup>
defineProps({
  error: {
    type: String,
    required: true
  },
  isPermissionDenied: {
    type: Boolean,
    default: false
  }
})

const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div v-if="error" class="error-container">
    <div class="error-message">
      {{ error }}
    </div>
    <button v-if="isPermissionDenied" @click="reloadPage" class="btn-reload">
      再読み込みして許可する
    </button>
  </div>
</template>

<style scoped>
.error-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.error-message {
  color: #e53e3e;
}

.btn-reload {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-reload:hover {
  background-color: #2d3748;
}
</style>
