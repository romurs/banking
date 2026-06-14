<script setup lang="ts">
const props = withDefaults(defineProps<{
  btype: "default" | "inverse";
  disabled?: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
}>(), {
  disabled: false,
  type: "button",
});
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="form-button"
    :class="props.btype === 'inverse' ? 'form-button-inverse' : ''"
  >
    {{ props.text }}
  </button>
</template>

<style scoped lang="scss">
.form-button {
  padding: 12px;
  background: var(--gradient-auth);
  color: var(--color-surface);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-glow);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.form-button-inverse {
  background: var(--color-surface);
  color: var(--color-primary);
}
</style>
