<script setup lang="ts">
import NavigationItem from "~/components/navigationItem.vue";
import ProfileAside from "~/components/main/profileAside.vue";
</script>

<template>
  <div class="app_wrapper">
    <aside class="aside aside-left">
      <NavigationItem />
    </aside>
    <main>
      <div class="header"></div>
      <div class="container">
        <slot />
      </div>
    </main>
    <aside class="aside aside-right">
      <ProfileAside />
    </aside>
    <NavigationItem_mobile />
  </div>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  max-width: 720px;
  align-items: center;
}

.aside {
  display: flex;
  flex: 1 1 0;
}

@media (max-width: 1200px) {
  .aside {
    width: 0;
  }
}

.aside-left {
  flex-direction: column;
}

.aside-right {
  justify-content: flex-end;
}

.container {
  min-height: 100dvh;
  padding-top: 16px;
  width: 100%;
  background-color: #fff;
}

@media (max-width: 480px) {
  .container {
    padding-top: 0;
  }
}

.app_wrapper {
  display: flex;
  flex-grow: 1;
  min-height: 100dvh;
  margin: 0 auto;
  max-width: 1368px;
}
</style>
