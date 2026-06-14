<script setup lang="ts">
const props = defineProps<{
  value: string;
  link: string;
}>();
</script>

<template>
  <NuxtLink class="nav-link" :to="props.link">
    <span class="nav__link-icon">
      <slot name="icon"> </slot>
    </span>
    <span class="nav__link-text">{{ props.value }}</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.nav-link {
  &.router-link-exact-active {
    color: var(--color-primary);
    font-weight: bold;
    font-size: larger;
  }
}
@media (min-width: 1200px) {
  .nav-link {
    width: auto;
    height: 3.5rem;

    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding: 0;
    cursor: pointer;

    padding: 0.6rem;
    margin-left: 24px;
    // margin-bottom: 0.6rem;

    .nav__link-icon {
      margin-right: 0.6rem;
    }

    &:hover {
      color: var(--color-primary);
    }

    // color: var(--color-primary)
  }
}

@media (max-width: 1200px) {
  .nav-link {
    width: auto;
    height: 3.5rem;

    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    cursor: pointer;
  }
}
</style>
