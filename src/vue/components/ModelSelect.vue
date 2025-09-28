<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 - 固定不滚动 -->
    <nav class="bg-white shadow-sm flex-shrink-0">
      <div class="max-w-7xl px-4 h-16 flex items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>模型广场</span>
          <i class="fas fa-chevron-right text-xs"></i>
          <!-- 修改面包屑显示逻辑 -->
          <span class="text-blue-600">{{ showCreateForm ? '创建智能体' : currentFolder }}</span>
        </div>
      </div>
    </nav>

    <!-- 内容区域 - 可滚动 -->
    <div class="flex-1 overflow-y-auto">
      <ModelList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ModelList from './ModelSelect/ModelList.vue'

</script>