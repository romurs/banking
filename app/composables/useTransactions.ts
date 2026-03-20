export const useTransactions = () => {
  const transactions = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTransactions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch("/api/transactions");
      transactions.value = data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch transactions";
      console.error("Error fetching transactions:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchTransactionDetail = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch(`/api/transactions/${id}`);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch transaction";
      console.error("Error fetching transaction:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchTransactions();
  });

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchTransactionDetail,
  };
};
