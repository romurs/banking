<script setup lang="ts">
import ArrowLeft from "~/components/newAccount/arrowLeft.vue";

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    navigateTo("/app/new-account");
  }
};
</script>

<template>
  <div class="goBack">
    <button @click="goBack" class="goBack_btn">
      <div class="arrowLeft">
        <ArrowLeft />
      </div>
      <p class="text_btn">Назад</p>
    </button>
  </div>
</template>

<style scoped lang="scss">
.goBack {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
}

.goBack_btn {
  background-color: initial;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.arrowLeft {
  height: auto;
  width: auto;
  align-items: center;
}

.text_btn {
  margin-left: 0.8rem;
  font-size: 20px;
  font-weight: 700;
}
</style>
