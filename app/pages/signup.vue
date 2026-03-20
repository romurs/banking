<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from "vue";
import FormButton from "~/components/authorization/formButton.vue";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const firstname = ref("");
const lastname = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    // TODO: Реализовать авторизацию через API
    // const response = await $fetch("/api/auth/login", {
    //   method: "POST",
    //   body: { email: email.value, password: password.value },
    // });

    // Для сейчас просто перенаправляем на главную страницу
    await navigateTo("/main");
  } catch (err: any) {
    error.value = err.message || "Ошибка при входе";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Сбербанк Онлайн</h1>

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

        <div class="form-group">
          <label for="lastname" class="form-label">Фамилия</label>
          <input
            id="lastname"
            v-model="lastname"
            type="text"
            class="form-input"
            placeholder="Иванов"
            required
          />
        </div>

        <div class="form-group">
          <label for="firstname" class="form-label">Имя</label>
          <input
            id="firstname"
            v-model="firstname"
            type="text"
            class="form-input"
            placeholder="Иван"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <FormButton
          :text="loading ? 'Загрузка...' : 'Зарегистрироваться'"
          btype="default"
          type="submit"
        />

        <FormButton
          text="Войти по логину"
          btype="inverse"
          :disabled="loading"
          @click="navigateTo('/')"
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
.auth-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-title {
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
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.auth-button {
  padding: 12px;
  background: linear-gradient(135deg, #148f2b 0%, #7de590 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.signup-button {
  padding: 12px;
  background: white;
  color: #148f2b;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.signup-link {
  display: flex;
  justify-content: center;
  width: 100%;
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
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-title {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .auth-form {
    gap: 16px;
  }
}
</style>
