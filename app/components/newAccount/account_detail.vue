<script setup lang="ts">
const props = defineProps<{
  detail_title: string
  detail_desc: string
}>()
</script>

<template>
  <div class="account_detail">
    <div class="detail_title">
      <span>{{ props.detail_title}}</span>
    </div>
    <div class="detail_desc">
      <span>{{ props.detail_desc}}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account_detail{
  max-width: 7rem;
}
.detail_title{
  font-weight: 600;
  font-size: larger;
}

.detail_desc{
  margin-top: 0.6rem;
  font-weight: 600;
  font-size: small;
  opacity: 0.4;
}
</style>