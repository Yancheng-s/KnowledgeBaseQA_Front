<template>
  <h1>111111111111</h1>
  <h2>{{ res }}</h2>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { testService } from '@/api/text'

const res = ref('')

onMounted(async () => {
  res.value = await (await testService()).data
})
</script>

<style scoped>
</style>