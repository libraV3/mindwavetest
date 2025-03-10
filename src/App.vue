<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useProductStore } from './stores/mainstore';
import { onMounted } from 'vue';
const store = useProductStore();

onMounted(() => {
  store.getProducts().catch((err) => console.log(err));
});
</script>

<template>
  <header></header>

  <RouterView />
</template>
