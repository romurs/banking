<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import ProfileEditForm from "~/components/profile/ProfileEditForm.vue";
import BackButton from "~/components/newAccount/backButton.vue";

useHead({
  title: "Редактирование профиля | Lumos Bank",
});

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const isSaving = ref(false);
const errorMessage = ref("");

const handleSave = async (payload: {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}) => {
  if (!user.value) {
    errorMessage.value = "Пользователь не найден";
    return;
  }

  isSaving.value = true;
  errorMessage.value = "";

  try {
    await authStore.updateProfile(payload);
    await navigateTo("/app/profile");
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Не удалось сохранить изменения";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="profile_page">
    <BackButton />
    <section v-if="user" class="profile_page-body">
      <ProfileEditForm
        :user="user"
        :is-saving="isSaving"
        :error-message="errorMessage"
        @save="handleSave"
      />
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

.profile_page-body {
  display: flex;
  flex-direction: column;
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
