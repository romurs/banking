<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="detail_row">
    <p class="detail_label">{{ label }}</p>
    <p class="detail_value">{{ value }}</p>
  </div>
</template>

<style scoped lang="scss">
.detail_row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem 0;

  & + & {
    border-top: 1px solid var(--color-border);
  }
}

.detail_label {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.35;
}

.detail_value {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  max-width: 56%;
  text-align: right;
}

@media (max-width: 480px) {
  .detail_row {
    gap: 0.75rem;
  }

  .detail_label,
  .detail_value {
    font-size: 0.9rem;
  }
}
</style>
