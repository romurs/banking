<script setup lang="ts">
import type { ProfileUser } from "./types";

const props = defineProps<{
  user: ProfileUser;
}>();

const profileRows = computed(() => [
  {
    label: "Email",
    value: props.user.email,
  },
  {
    label: "Фамилия",
    value: props.user.lastName || "Не указана",
  },
  {
    label: "Имя",
    value: props.user.firstName || "Не указано",
  },
]);
</script>

<template>
  <section class="profile_card">
    <h2>Данные профиля</h2>

    <div class="profile_rows">
      <div v-for="row in profileRows" :key="row.label" class="profile_row">
        <p>{{ row.label }}</p>
        <span>{{ row.value }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile_card {
  background: var(--color-surface);
  border-radius: 20px;
  padding: 1.5rem;
}

h2 {
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.profile_rows {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 1rem;
}

.profile_row {
  align-items: center;
  background: var(--color-surface-soft);
  border-radius: 14px;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  min-height: 52px;
  padding: 0 1rem;

  p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    font-weight: 700;
  }

  span {
    color: var(--color-text);
    font-size: 0.98rem;
    font-weight: 700;
    overflow-wrap: anywhere;
    text-align: right;
  }
}

@media (max-width: 480px) {
  .profile_card {
    padding: 1.25rem 1rem;
  }

  .profile_row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
    justify-content: center;
    padding: 0.75rem 1rem;

    span {
      text-align: left;
    }
  }
}
</style>
