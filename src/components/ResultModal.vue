<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const shareText = computed(() => `${props.count}回スクワットしました！ #スクワットタイマー`)
const shareUrl = 'https://freddiefujiwara.com/squat-timer/'

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'スクワットタイマー',
        text: shareText.value,
        url: shareUrl
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  } else {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank')
  }
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>計測終了！</h2>
      <p class="result-text">
        <span class="count">{{ count }}</span> 回スクワットしました！
      </p>

      <button class="btn-share" @click="handleShare">
        結果を共有する
      </button>

      <button class="btn-close" @click="$emit('close')">
        とじる
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-top: 0;
  color: #2d3748;
}

.result-text {
  font-size: 1.5rem;
  margin: 1.5rem 0;
  color: #4a5568;
}

.count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4fd1c5;
}

.btn-share {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 153, 225, 0.5);
}

.btn-share:active {
  transform: translateY(0);
}

.btn-close {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: #1a202c;
    color: white;
  }
  h2 {
    color: #edf2f7;
  }
  .result-text {
    color: #e2e8f0;
  }
}
</style>
