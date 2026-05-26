<script setup lang="ts"></script>

<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <!-- Основной фон карты -->
      <rect x="2" y="20" width="60" height="8" fill="#2C3E50" />
      
      <g>
        <!-- Нижняя часть карты -->
        <path
          fill="#E74C3C"
          d="M2,52c0,1.104,0.896,2,2,2h56c1.104,0,2-0.896,2-2V30H2V52z"
        />
        <!-- Верхняя часть карты -->
        <path
          fill="#C0392B"
          d="M60,10H4c-1.104,0-2,0.895-2,2v6h60v-6C62,10.895,61.104,10,60,10z"
        />
      </g>

      <!-- Обводка карты -->
      <path
        fill="#2C3E50"
        d="M60,8H4c-2.211,0-4,1.789-4,4v40c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V12C64,9.789,62.211,8,60,8z 
           M62,52c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2V30h60V52z M62,28H2v-8h60V28z M62,18H2v-6c0-1.105,0.896-2,2-2h56
           c1.104,0,2,0.895,2,2V18z"
      />

      <!-- Чип кредитной карты (золотой) -->
      <rect x="11" y="32" width="18" height="12" rx="2" fill="#F1C40F" />
      <rect x="13" y="34" width="14" height="2" fill="#E67E22" />
      <rect x="13" y="38" width="14" height="2" fill="#E67E22" />

      <!-- Полоса с текстом "CREDIT" -->
      <rect x="36" y="34" width="22" height="8" rx="1" fill="#ECF0F1" />
      <text
        x="47"
        y="41"
        text-anchor="middle"
        fill="#2C3E50"
        font-size="5"
        font-weight="700"
        font-family="Arial, sans-serif"
      >
        CREDIT
      </text>
    </g>
  </svg>
</template>

<style scoped lang="scss"></style>
