<script setup lang="ts">
// import NavigationItem from "./components/navigation/nav-btn.vue";
import NavigationItem_mobile from "./components/navigationItem_mobile.vue";
import "./assets/main.scss";

const route = useRoute();

// На странице авторизации скрываем навигацию и заголовок
const isAuthPage = computed(() => route.path === "/" || route.path === "/signup");
</script>

<template>
  <div v-if="isAuthPage" class="auth-wrapper">
    <!-- На странице авторизации показываем только контент -->
    <NuxtPage />
  </div>
  <div v-else class="wrapper">
    <aside class="aside aside-left">
      <NavigationItem />
    </aside>
    <main>
      <div class="header"></div>
      <div class="container">
        <NuxtPage />
      </div>
    </main>
    <aside class="aside aside-right"></aside>
    <NavigationItem_mobile />
  </div>
</template>

<style scoped lang="scss">
.auth-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #148f2b 0%, #7de590 100%);
}

main {
  // flex: 1 0 auto;
  width: 100%;
  max-width: 720px;
}
.aside {
  display: flex;
  flex: 1 1 0;
}

@media (max-width: 1200) {
  .aside {
    width: 0;
  }
}

.aside-left {
  flex-direction: column;
}

.aside-right {
}

.container {
  padding-top: 16px;
  width: 100%;
  background-color: #fff;
}

@media (max-width: 480px) {
  .container {
    padding-top: 0;
  }
}
.wrapper {
  display: flex;
  flex-grow: 1;
  // width: 100%;
  margin: 0 auto;
}
</style>
