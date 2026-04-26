/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from "pinia";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
}

type AuthFetch = (request: string) => Promise<{ user: User }>;

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isInitialized = ref(false);
  const initializationPromise = shallowRef<Promise<boolean> | null>(null);

  const initialize = async (): Promise<boolean> => {
    if (isInitialized.value) {
      return isAuthenticated.value;
    }

    if (!initializationPromise.value) {
      initializationPromise.value = (async () => {
        const authFetch = (import.meta.server
          ? (useRequestFetch() as unknown)
          : ($fetch as unknown)) as AuthFetch;

        try {
          const response = await authFetch("/api/auth/me");
          user.value = response.user;
          return true;
        } catch {
          user.value = null;
          return false;
        } finally {
          isInitialized.value = true;
          initializationPromise.value = null;
        }
      })();
    }

    return initializationPromise.value;
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await $fetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: credentials,
    });

    user.value = response.user;
    isInitialized.value = true;

    return response.user;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await $fetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    user.value = response.user;
    isInitialized.value = true;

    return response.user;
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    isInitialized.value = true;
  };

  return {
    initialize,
    isAuthenticated,
    isInitialized: readonly(isInitialized),
    login,
    logout,
    register,
    user: readonly(user),
  };
});
