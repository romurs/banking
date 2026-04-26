<template>
  <div class="auth_wrapper">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.auth_wrapper {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #148f2b 0%, #7de590 100%);
}
</style>
