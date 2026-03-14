<script setup lang="ts">
import { ref } from 'vue';
import AccountItem from "~/components/main/wallet/accounts/accountItem.vue";

const scrollContainer = ref<HTMLElement | null>(null);

const canScrollLeft = ref(false);
const canScrollRight = ref(false); 
const hasOverflow = ref(false);

const updateScrollState = () => {
  const el = scrollContainer.value;
  if (!el) return;

  hasOverflow.value = el.scrollWidth > el.clientWidth + 1;

  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value =
    el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const scroll = (dir: 1 | -1) => {
  const el = scrollContainer.value;
  if (!el) return;

  el.scrollTo({
    left: el.scrollLeft + dir * 300,
    behavior: "smooth",
  });
};

onMounted(() => {
  updateScrollState();
  scrollContainer.value?.addEventListener("scroll", updateScrollState);
  window.addEventListener("resize", updateScrollState);
});

onBeforeUnmount(() => {
  scrollContainer.value?.removeEventListener("scroll", updateScrollState);
  window.removeEventListener("resize", updateScrollState);
});

</script>

<template>
  <div class="accounts">
    <div
      class="shadow shadow-left"
      :class="{ visible: hasOverflow && canScrollLeft }"
    />
    <div
      class="shadow shadow-right"
      :class="{ visible: hasOverflow && canScrollRight }"
     />
    <div ref="scrollContainer" class="accounts-list" >
      <AccountItem last-four-number="1234" card-money="1234.56" account-data="5678"/>
      <AccountItem last-four-number="5678" card-money="7891.01" account-data="4367"/>
      <AccountItem last-four-number="4238" card-money="3437346.12" account-data="3765"/>
      <AccountItem last-four-number="2983" card-money="0.01" account-data="3654"/>
      <AccountItem last-four-number="2983" card-money="0.01" account-data="3654"/>
    </div>
    <button v-if="hasOverflow && canScrollLeft" class="scroll-btn btn_left" @click="scroll(-1)" >⬅</button>
    <button v-if="hasOverflow && canScrollRight" class="scroll-btn btn_right" @click="scroll(1)" >➡</button>
  </div>
</template>

<style scoped lang="scss">
.accounts {
  margin-top: 1rem;
  position: relative;
}

.shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.shadow-left {
  left: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.18),
    rgba(0, 0, 0, 0)
  );
}

.shadow-right {
  right: 0;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.18),
    rgba(0, 0, 0, 0)
  );
}

/* показываем */
.shadow.visible {
  opacity: 1;
}

.accounts-list {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

@media(max-width:480px){
  .scroll-btn {
    display: none;
    visibility: hidden;
    opacity: 0;
  }
}


.accounts:hover .scroll-btn{
  opacity: 1;
  transition: opacity 0.2s;
}

.btn_left{
  left: 0;
  
}

.btn_right{
  right: 0;
  
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 50%; 

  opacity: 0;
  transition: opacity 0.2s;
}
</style>