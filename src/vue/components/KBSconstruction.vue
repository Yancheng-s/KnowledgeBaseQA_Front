<!-- src/vue/components/KBSconstruction.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl px-4 h-16 flex items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>知识库</span>
          <i class="fas fa-chevron-right text-xs"></i>
          <!-- 修改面包屑显示逻辑 -->
          <span class="text-blue-600">{{ showCreateForm ? '创建知识库' : currentFolder }}</span>
        </div>
      </div>
    </nav>

    <!-- 条件渲染组件 -->
    <CreateKnowledgeBase v-if="showCreateForm" @close="showCreateForm = false" />
    <KnowledgeBaseList 
      v-else 
      :knowledge-list="knowledgeList" 
      @create="showCreateForm = true" 
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CreateKnowledgeBase from './KBS/CreateKnowledgeBase.vue'
import KnowledgeBaseList from './KBS/KnowledgeBaseList.vue'



const currentFolder = ref('');
const showCreateForm = ref(false);
</script>