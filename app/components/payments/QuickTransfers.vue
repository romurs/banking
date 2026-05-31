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
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
}

h2 {
  color: #262626;
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
  background: transparent;
  border: none;
  color: #262626;
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
  background: #0b8523;
  color: #fff;
  font-size: 2rem;
  font-weight: 500;
}

.avatar {
  background: #f1f1f1;
  color: rgba(38, 38, 38, 0.58);
  font-size: 1.35rem;
  font-weight: 700;
}

.bank_mark {
  align-items: center;
  background: #fff;
  border-radius: 50%;
  bottom: -2px;
  box-shadow: 0 2px 6px rgba(38, 38, 38, 0.14);
  color: #262626;
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
  color: #262626;
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
  background: #f7f7f7;
  border-radius: 16px;
  color: rgba(38, 38, 38, 0.58);
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
