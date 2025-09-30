<template>
	<div id="app-container">
		<router-view></router-view>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('🎯 App.vue 组件已挂载');
})
</script>

<style scoped>
#app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
