<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl px-4 h-16 flex items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>模型广场</span>
          <i class="fas fa-chevron-right text-xs"></i>
          <!-- 修改面包屑显示逻辑 -->
          <span class="text-blue-600">{{ showCreateForm ? '创建智能体' : currentFolder }}</span>
        </div>
      </div>
    </nav>

    <!-- 条件渲染组件 -->
    <ModelList />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ModelList from './ModelSelect/ModelList.vue'

</script>