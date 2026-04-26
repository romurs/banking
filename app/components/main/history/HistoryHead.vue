<script setup lang="ts"></script>

<template>
  <div class="history-head">
    <h2 class="history-title">История</h2>
    <button class="all_history_btn">
      <NuxtLink to="operations">Все</NuxtLink>
    </button>
  </div>
</template>

<style scoped lang="scss">
.history-head {
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
}

.all_history_btn {
  background: none;
  border: none;
  color: #0b8523;
  font-weight: 500;
  font-size: medium;
  transition: 0.15s ease;
}

.all_history_btn:hover {
  color: black;
}
</style>
