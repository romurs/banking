<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import ProfileHero from "~/components/profile/ProfileHero.vue";
import ProfileInfoCard from "~/components/profile/ProfileInfoCard.vue";

useHead({
  title: "Профиль | Сбербанк Онлайн",
});

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logoutUser = async () => {
  await authStore.logout();
  await navigateTo("/");
};
</script>

<template>
  <div class="profile_page">
    <section v-if="user" class="profile_layout">
      <ProfileHero :user="user" @logout="logoutUser" />
      <ProfileInfoCard :user="user" />
    </section>

    <section v-else class="profile_empty">
      <p>Пользователь не найден. Пожалуйста, войдите снова.</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.profile_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile_layout {
  display: grid;
  gap: 1rem;
}

.profile_empty {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  color: #262626;
}

@media (max-width: 480px) {
  .profile_page {
    padding: 0 0.75rem;
  }
}
</style>
