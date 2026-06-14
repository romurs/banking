<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  canRetry?: boolean;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <section class="transaction_state">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <button v-if="canRetry" type="button" @click="$emit('retry')">
      Повторить
    </button>
  </section>
</template>

<style scoped lang="scss">
.transaction_state {
  align-items: center;
  background: var(--color-surface);
  border-radius: 20px;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 260px;
  padding: 1.5rem;
  text-align: center;
}

h2 {
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 0;
}

p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.4;
  margin-top: 0.6rem;
  max-width: 360px;
}

button {
  background: var(--color-primary);
  border: none;
  border-radius: 12px;
  color: var(--color-surface);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  margin-top: 1rem;
  min-height: 44px;
  padding: 0 1rem;
}
</style>
