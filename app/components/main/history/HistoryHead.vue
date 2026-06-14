<script setup lang="ts"></script>

<template>
  <div class="history-head">
    <h2 class="history-title">История</h2>
    <button class="all_history_btn">
      <NuxtLink to="/app/operations">Все</NuxtLink>
    </button>
  </div>
</template>

<style scoped lang="scss">
.history-head {
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
}

.all_history_btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 500;
  font-size: medium;
  transition: 0.15s ease;
  cursor: pointer;
}

.all_history_btn:hover {
  color: var(--color-text-strong);
}
</style>
