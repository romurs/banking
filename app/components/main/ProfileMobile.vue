<script setup lang="ts">
import { storeToRefs } from "pinia";
import LogoutIcon from "./profile btn/logoutIcon.vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const logoutUser = async () => {
  await authStore.logout();
  await navigateTo("/");
};
</script>

<template>
  <div class="user_block">
    <div class="scaffold profile_link" title="РџСЂРѕС„РёР»СЊ">
      <NuxtLink to="/app/profile" class="profile_link_inner">
        <span class="profile_icon">
          <img src="~/assets/defaultProfileIcon.svg" alt="" />
        </span>
        <p class="fullname">{{ user?.lastName + " " + user?.firstName || "" }}</p>
      </NuxtLink>
    </div>
    <button class="scaffold logout_btn" title="" @click="logoutUser">
      <LogoutIcon />
    </button>
  </div>
</template>

<style scoped lang="scss">
@media (min-width: 1200px) {
  .user_block {
    display: none;
    visibility: hidden;
  }
}

@media (max-width: 1200px) {
  .user_block {
    display: flex;
    margin-top: 0.6rem;
    width: 100%;
    justify-content: space-between;
  }
}

// @media (max-width: 1400px) {
//   .fullname {
//     display: none;
//     visibility: hidden;
//   }
// }

.fullname {
  white-space: nowrap;
}

.scaffold {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 3rem;
  border-radius: 12px;
  margin: 0.6rem;
}

.profile_icon {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.profile_link_inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 8px;

  img {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 12px;
  }
}

.logout_btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 16px;
  rotate: 90deg;
  
}
</style>
