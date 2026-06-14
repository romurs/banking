<script setup lang="ts">
import type { ProfileUpdatePayload, ProfileUser } from "./types";

const props = withDefaults(defineProps<{
  errorMessage?: string;
  isSaving?: boolean;
  user: ProfileUser;
}>(), {
  errorMessage: "",
  isSaving: false,
});

const emit = defineEmits<{
  save: [payload: ProfileUpdatePayload];
}>();

const form = reactive({
  email: "",
  firstName: "",
  lastName: "",
  password: "",
});

watch(
  () => props.user,
  (user) => {
    form.email = user.email;
    form.firstName = user.firstName || "";
    form.lastName = user.lastName || "";
    form.password = "";
  },
  { immediate: true },
);

const isPasswordInvalid = computed(() => {
  return form.password.length > 0 && form.password.length < 6;
});

const handleSubmit = () => {
  if (isPasswordInvalid.value) {
    return;
  }

  const payload: ProfileUpdatePayload = {
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
  };

  if (form.password.trim()) {
    payload.password = form.password.trim();
  }

  emit("save", payload);
};
</script>

<template>
  <form class="profile_form" @submit.prevent="handleSubmit">
    <div class="form_head">
      <h1>Редактирование профиля</h1>
    </div>

    <label class="field">
      <span>Фамилия</span>
      <input
        v-model="form.lastName"
        autocomplete="family-name"
        placeholder="Иванов"
        required
        type="text"
      />
    </label>

    <label class="field">
      <span>Имя</span>
      <input
        v-model="form.firstName"
        autocomplete="given-name"
        placeholder="Иван"
        required
        type="text"
      />
    </label>

    <label class="field">
      <span>Email</span>
      <input
        v-model="form.email"
        autocomplete="email"
        placeholder="your@email.com"
        required
        type="email"
      />
    </label>

    <label class="field">
      <span>Новый пароль</span>
      <input
        v-model="form.password"
        :class="{ invalid: isPasswordInvalid }"
        autocomplete="new-password"
        minlength="6"
        placeholder="Не менять"
        type="password"
      />
      <span v-if="isPasswordInvalid" class="field_error">
        Пароль должен быть не короче 6 символов
      </span>
    </label>

    <p v-if="props.errorMessage" class="form_message form_message-error">
      {{ props.errorMessage }}
    </p>

    <div class="form_actions">
      <button
        class="submit_button"
        type="submit"
        :disabled="props.isSaving || isPasswordInvalid"
      >
        {{ props.isSaving ? "Сохраняем..." : "Сохранить" }}
      </button>
      <NuxtLink class="cancel_button" to="/app/profile">
        Отмена
      </NuxtLink>
    </div>
  </form>
</template>

<style scoped lang="scss">
.profile_form {
  background: var(--color-surface);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.form_head {
  h1 {
    color: var(--color-text);
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;

  span {
    color: var(--color-text-muted);
    font-size: 0.86rem;
    font-weight: 700;
  }

  input {
    background: var(--color-surface-soft);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    color: var(--color-text);
    font-family: "Ubuntu", sans-serif;
    font-size: 1rem;
    min-height: 52px;
    outline: none;
    padding: 0 1rem;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-focus);
    }

    &.invalid {
      border-color: var(--color-danger);
      box-shadow: 0 0 0 3px var(--color-danger-focus);
    }
  }
}

.field_error {
  color: var(--color-danger) !important;
  font-size: 0.82rem !important;
  font-weight: 700;
}

.form_message {
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.35;
  padding: 0.85rem 1rem;
}

.form_message-error {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.form_actions {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.submit_button,
.cancel_button {
  align-items: center;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  font-family: "Ubuntu", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  min-height: 52px;
  padding: 0 1rem;
}

.submit_button {
  background: var(--color-primary);
  color: var(--color-surface);

  &:not(:disabled):hover {
    background: var(--color-primary-hover);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
}

.cancel_button {
  background: var(--color-surface-soft);
  color: var(--color-text);

  &:hover {
    box-shadow: inset 0 0 0 1px var(--color-primary-border);
    color: var(--color-primary);
  }
}

@media (max-width: 480px) {
  .profile_form {
    padding: 1.25rem 1rem;
  }

  .form_actions {
    grid-template-columns: 1fr;
  }
}
</style>
