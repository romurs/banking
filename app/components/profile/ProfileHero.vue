<script setup lang="ts">
import type { ProfileUser } from "./types";
import { getProfileFullName, getProfileInitials } from "./types";

const props = defineProps<{
  user: ProfileUser;
}>();

defineEmits<{
  logout: [];
}>();

const fullName = computed(() => {
  return getProfileFullName(props.user) || "Профиль";
});

const initials = computed(() => getProfileInitials(props.user));
</script>

<template>
  <section class="profile_hero">
    <div class="profile_identity">
      <div class="avatar" aria-hidden="true">
        {{ initials }}
      </div>

      <div>
        <h1>{{ fullName }}</h1>
        <p>{{ props.user.email }}</p>
      </div>
    </div>

    <div class="profile_actions">
      <NuxtLink class="profile_action" to="/app/profile/edit">
        Редактировать
      </NuxtLink>
      <button class="profile_action profile_action-danger" type="button" @click="$emit('logout')">
        Выйти
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile_hero {
  background: linear-gradient(135deg, #d6e0ff, #f6e4f1);
  border-radius: 20px;
  padding: 1.5rem;
}

.profile_identity {
  align-items: center;
  display: flex;
  gap: 1rem;

  h1 {
    color: #262626;
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    overflow-wrap: anywhere;
  }

  p {
    color: rgba(38, 38, 38, 0.62);
    font-size: 0.95rem;
    font-weight: 700;
    margin-top: 0.35rem;
    overflow-wrap: anywhere;
  }
}

.avatar {
  align-items: center;
  background: #fff;
  border-radius: 18px;
  color: #0b8523;
  display: flex;
  flex: 0 0 72px;
  font-size: 1.35rem;
  font-weight: 700;
  height: 72px;
  justify-content: center;
}

.profile_actions {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1.35rem;
}

.profile_action {
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 14px;
  color: #262626;
  cursor: pointer;
  display: flex;
  font-family: "Ubuntu", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  min-height: 48px;
  padding: 0 1rem;

  &:hover {
    background: #f8fbf8;
    box-shadow: inset 0 0 0 1px rgba(11, 133, 35, 0.22);
    color: #0b8523;
  }
}

.profile_action-danger {
  color: #d32f2f;

  &:hover {
    background: #fff5f6;
    box-shadow: inset 0 0 0 1px rgba(211, 47, 47, 0.2);
    color: #d32f2f;
  }
}

@media (max-width: 480px) {
  .profile_hero {
    padding: 1.25rem 1rem;
  }

  .profile_identity {
    align-items: flex-start;
  }

  .avatar {
    border-radius: 16px;
    flex-basis: 60px;
    height: 60px;
  }

  .profile_actions {
    grid-template-columns: 1fr;
  }
}
</style>
