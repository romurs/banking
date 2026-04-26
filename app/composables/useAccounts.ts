/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAccounts = () => {
  const accounts = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAccounts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch("/api/accounts");
      accounts.value = data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch accounts";
      console.error("Error fetching accounts:", err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchAccounts();
  });

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
  };
};
