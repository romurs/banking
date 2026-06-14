<script setup lang="ts">
import type { RecentRecipient } from "./types";

const props = withDefaults(
  defineProps<{
    selectable?: boolean;
  }>(),
  {
    selectable: false,
  },
);

const emit = defineEmits<{
  select: [recipient: RecentRecipient];
}>();

const {
  data: recipients,
  pending,
  error,
} = await useFetch<RecentRecipient[]>("/api/payments/recent-recipients", {
  default: () => [],
});

const shortName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) {
    return name;
  }

  return `${parts[0]} ${parts?.[1]?.[0]}.`;
};

const selectRecipient = (recipient: RecentRecipient) => {
  if (!props.selectable) {
    navigateTo("/app/payments");
    return;
  }

  emit("select", recipient);
};
</script>

<template>
  <section class="quick_transfers">
    <h2>Переводы</h2>

    <div class="quick_scroller">
      <NuxtLink class="quick_item quick_item-new" to="/app/payments">
        <span class="new_icon">→</span>
        <span>Новый<br />перевод</span>
      </NuxtLink>

      <div v-if="pending" class="quick_placeholder">Загрузка...</div>
      <div v-else-if="error" class="quick_placeholder">
        Не удалось загрузить
      </div>

      <template v-else>
        <button
          v-for="recipient in recipients"
          :key="`${recipient.name}-${recipient.accountLastFour}`"
          class="quick_item"
          type="button"
          :disabled="
            props.selectable && !recipient.recipient && !recipient.cardLastFour
          "
          @click="selectRecipient(recipient)"
        >
          <span class="avatar">
            {{ recipient.initials }}
            <span v-if="recipient.accountLastFour" class="bank_mark">⌂</span>
          </span>
          <span class="recipient_name">{{ shortName(recipient.name) }}</span>
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.quick_transfers {
  background: var(--color-surface);
  border-radius: 20px;
  padding: 1.5rem;
}

h2 {
  color: var(--color-text);
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1.25rem;
}

.quick_scroller {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.15rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.quick_item {
  align-items: center;
  background: var(--color-transparent);
  border: none;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  flex: 0 0 86px;
  flex-direction: column;
  font-family: "Ubuntu", sans-serif;
  gap: 0.55rem;
  min-width: 86px;
  padding: 0;
  text-align: center;

  &:disabled {
    cursor: default;
    opacity: 0.52;
  }
}

.quick_item-new {
  text-decoration: none;
}

.new_icon,
.avatar {
  align-items: center;
  border-radius: 22px;
  display: flex;
  height: 68px;
  justify-content: center;
  position: relative;
  width: 68px;
}

.new_icon {
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 2rem;
  font-weight: 500;
}

.avatar {
  background: var(--color-app-bg);
  color: var(--color-text-muted);
  font-size: 1.35rem;
  font-weight: 700;
}

.bank_mark {
  align-items: center;
  background: var(--color-surface);
  border-radius: 50%;
  bottom: -2px;
  box-shadow: var(--shadow-floating);
  color: var(--color-text);
  display: flex;
  font-size: 0.65rem;
  height: 20px;
  justify-content: center;
  position: absolute;
  right: -2px;
  width: 20px;
}

.quick_item span:last-child,
.recipient_name {
  color: var(--color-text);
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.25;
  max-width: 86px;
  min-height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick_placeholder {
  align-items: center;
  background: var(--color-surface-soft);
  border-radius: 16px;
  color: var(--color-text-muted);
  display: flex;
  flex: 1 0 180px;
  font-size: 0.9rem;
  justify-content: center;
  min-height: 104px;
  padding: 1rem;
}

@media (max-width: 480px) {
  .quick_transfers {
    padding: 1.25rem 1rem;
  }

  .quick_scroller {
    gap: 0.75rem;
  }

  .quick_item {
    flex-basis: 76px;
    min-width: 76px;
  }

  .new_icon,
  .avatar {
    border-radius: 20px;
    height: 62px;
    width: 62px;
  }
}
</style>
