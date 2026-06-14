<script setup lang="ts">
const creditLimit = ref(300000);

const emit = defineEmits<{ (e: "update:limit", value: number): void }>();

const formattedLimit = computed(() => {
  return creditLimit.value.toLocaleString("ru-RU") + " ₽";
});

const presets = [50000, 100000, 150000, 200000, 300000, 500000, 750000, 950000];

const selectPreset = (value: number) => {
  creditLimit.value = value;
  emit("update:limit", creditLimit.value);
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let num = parseInt(target.value.replace(/\D/g, "")) || 0;

  // Ограничиваем минимум и максимум
  if (num < 50000) num = 50000;
  if (num > 1000000) num = 1000000;

  creditLimit.value = num;
  emit("update:limit", creditLimit.value);
};

// emit when slider or v-model changes
watch(creditLimit, (v) => emit("update:limit", v));
</script>

<template>
  <div class="limit-section">
    <div class="limit-header">
      <span class="limit-title">Кредитный лимит</span>
      <input
        :value="formattedLimit"
        class="limit-value-input"
        @blur="handleInput"
        @keypress.enter="handleInput"
      />
    </div>

    <div class="limit-presets">
      <button
        v-for="value in presets"
        :key="value"
        :class="{ active: creditLimit === value }"
        class="preset-btn"
        @click="selectPreset(value)"
      >
        {{ (value / 1000).toFixed(0) }} тыс.
      </button>
    </div>

    <input
      v-model="creditLimit"
      type="range"
      min="50000"
      max="1000000"
      step="1000"
      class="limit-slider"
    />

    <div class="limit-marks">
      <span>50 000 ₽</span>
      <span>1 000 000 ₽</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.limit-section {
  margin: 2rem 0 2.5rem;
}

.limit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;

  .limit-title {
    font-weight: 600;
    color: var(--color-text);
  }

  .limit-value-input {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-primary);
    background: var(--color-transparent);
    border: none;
    text-align: right;
    width: 180px;
    padding: 4px 8px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      background: var(--color-primary-soft);
      box-shadow: 0 0 0 3px var(--color-primary-focus);
    }
  }
}

.limit-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.1rem;
  justify-content: flex-start;
  max-width: 350px;
}

.preset-btn {
  padding: 5px 8px;
  font-size: 0.8rem;
  border: 2px solid var(--color-border-strong);
  background: var(--color-surface);
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-primary);
    color: var(--color-surface);
    border-color: var(--color-primary);
  }
}

.limit-slider {
  width: 100%;
  height: 6px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-border-strong);
  border-radius: 9999px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: var(--color-primary);
    border-radius: 50%;
    box-shadow: 0 4px 12px var(--color-primary-shadow);
    cursor: pointer;
    border: 3px solid var(--color-surface);
  }

  &::-moz-range-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    background: var(--color-primary);
    border-radius: 50%;
    box-shadow: 0 4px 12px var(--color-primary-shadow);
    cursor: pointer;
    border: 3px solid var(--color-surface);
  }
}

.limit-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}
</style>
