<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description: string
  link: string
  clickable?: boolean
}>(), {
  clickable: true
})
</script>

<template>
  <div class="newAccount_btn">
    <NuxtLink :to="clickable ? link : undefined" :class="['account_link', { disabled: !clickable }]">
      <div class="account_icon">
        <slot name="account_icon"> </slot>
      </div>
      <div class="accountDesc">
        <h3>{{ props.title }}</h3>
        <p>{{ props.description }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.account_link {
  display: flex;
  min-height: 100px;
  margin-top: 1rem;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.account_link:hover {
  opacity: 0.4;
}

.disabled{
  pointer-events: none;
  opacity: 0.4;
}

.account_icon {
  margin: 1rem;
  margin-left: 0;
  min-width: 4.75rem;
  height: 4.75rem;
  background-color: #f1f1f1;
  justify-content: center;
  border-radius: 8px;
}

.account_icon :deep(img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.accountDesc {
  display: flex;
  display: block;
  height: auto;
  margin-left: 1rem;
  align-items: center;
}
</style>
