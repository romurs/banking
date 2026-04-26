<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, ref } from "vue";
import FormButton from "~/components/authorization/formButton.vue";
import { useAuthStore } from "~/stores/auth";
import { APP_HOME_PATH, resolveAppRedirect } from "~/utils/auth-redirect";

const authStore = useAuthStore();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const redirectTarget = computed(() => resolveAppRedirect(route.query.redirect));

const navigateToRegister = async () => {
  await navigateTo({
    path: "/register",
    query: redirectTarget.value
      ? { redirect: redirectTarget.value }
      : undefined,
  });
};

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    await navigateTo(redirectTarget.value ?? APP_HOME_PATH);
  } catch (err: any) {
    error.value = err.data?.message ?? err.message ?? "Ошибка входа";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth_container">
    <div class="auth_card">
      <h1 class="auth_title">Сбербанк Онлайн</h1>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <FormButton
          :text="loading ? 'Вход...' : 'Войти'"
          btype="default"
          type="submit"
          :disabled="loading"
        />

        <FormButton
          text="Зарегистрироваться"
          btype="inverse"
          :disabled="loading"
          @click="navigateToRegister"
        />
      </form>

      <div class="auth-footer">
        <p>Забыли пароль?</p>
        <a href="#" class="auth-link">Восстановить пароль</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth_container {
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth_card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth_title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #1a1a1a;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #148f2b;
    box-shadow: 0 0 0 3px rgba(20, 143, 43, 0.14);
  }

  &::placeholder {
    color: #999;
  }
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  padding: 12px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 8px;
  text-align: center;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
}

.auth-link {
  color: #148f2b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #0f7021;
    text-decoration: underline;
  }
}

@media (max-width: 480px) {
  .auth_card {
    padding: 30px 20px;
  }

  .auth_title {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .auth-form {
    gap: 16px;
  }
}
</style>
