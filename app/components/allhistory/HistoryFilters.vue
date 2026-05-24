<script setup lang="ts">
const props = defineProps<{
  selectedType: string;
  transactionTypes: string[];
}>();

const emit = defineEmits<{
  "update:selected-type": [value: string];
}>();

const handleFilterChange = (type: string) => {
  if (props.selectedType === type) {
    emit("update:selected-type", "");
  } else {
    emit("update:selected-type", type);
  }
};
</script>

<template>
  <div class="filters_wrapper">
    <div class="filter_header">
      <h3>Фильтры</h3>
    </div>

    <div class="filter_group">
      <button
        class="filter_btn"
        :class="{ active: selectedType === '' }"
        @click="emit('update:selected-type', '')"
      >
        Все операции
      </button>
    </div>

    <div v-if="transactionTypes.length > 0" class="filter_group">
      <h4>По типу</h4>
      <button
        v-for="type in transactionTypes"
        :key="type"
        class="filter_btn type_filter"
        :class="{ active: selectedType === type }"
        @click="handleFilterChange(type)"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters_wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter_header {
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
}

.filter_group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.filter_btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-family: "Ubuntu", sans-serif;

  &:hover {
    border-color: #b0b0e4;
    background: #f0f0ff;
    color: #333;
  }

  &.active {
    background: linear-gradient(135deg, #d6e0ff, #e8d6f1);
    border-color: #b0b0e4;
    color: #333;
    font-weight: 600;
  }

  &.type_filter {
    font-size: 0.9rem;
    padding: 0.6rem 0.9rem;
  }
}
</style>
