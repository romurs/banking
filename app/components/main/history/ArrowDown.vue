<script setup lang="ts"></script>

<template>
  <slot>
    <div class="icon_arrow_down">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <!-- Icon from IconaMoon by Dariush Habibpour - https://creativecommons.org/licenses/by/4.0/ -->
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M12 19V5m-7 7l7 7l7-7"
        />
      </svg>
    </div>
  </slot>
</template>

<style scoped lang="scss">
.icon_arrow_down {
  background: var(--color-success-soft);
  color: var(--color-primary);
  align-items: center;
  border-radius: 50%;
  display: flex;
  flex: 0 0 48px;
  height: 48px;
  justify-content: center;
  width: 48px;
}
svg {
  flex-shrink: 0;
}
</style>
