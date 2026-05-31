<script setup lang="ts">
import ArrowLeft from "~/components/newAccount/arrowLeft.vue";

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  navigateTo("/app/main");
};
</script>

<template>
  <button class="account_back" type="button" @click="goBack">
    <span class="account_back_icon">
      <ArrowLeft />
    </span>
    <span>Назад</span>
  </button>
</template>

<style scoped lang="scss">
.account_back {
  align-items: center;
  align-self: flex-start;
  background: transparent;
  border: none;
  color: #262626;
  cursor: pointer;
  display: inline-flex;
  font-size: 1.2rem;
  font-weight: 700;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.account_back_icon {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
