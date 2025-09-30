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
          <span class="text-blue-600">{{ 
            showCreateForm ? '创建知识库' : 
            showViewForm ? '查看知识库' : 
            showEditForm ? '编辑知识库' : 
            currentFolder || '知识库列表' 
          }}</span>
        </div>
      </div>
    </nav>

    <!-- 条件渲染组件 -->
    <CreateKnowledgeBase v-if="showCreateForm" @close="showCreateForm = false" />
    <KnowledgeBaseDetail 
      v-else-if="showViewForm" 
      :knowledge-base-id="currentKnowledgeBase?.title"
      @back="showViewForm = false"
      @edit="handleEdit"
    />
    <KnowledgeBaseView 
      v-else-if="showEditForm" 
      :knowledge-base-id="currentKnowledgeBase?.title"
      @back="showEditForm = false"
      @save="handleSave"
    />
    <KnowledgeBaseList 
      v-else 
      :knowledge-list="knowledgeList" 
      @create="showCreateForm = true"
      @view="handleView"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

// 使用动态导入来避免TypeScript错误
const CreateKnowledgeBase = defineAsyncComponent(() => import('./KBS/CreateKnowledgeBase.vue'))
const KnowledgeBaseList = defineAsyncComponent(() => import('./KBS/KnowledgeBaseList.vue'))
const KnowledgeBaseDetail = defineAsyncComponent(() => import('./KBS/KnowledgeBaseDetail.vue'))
const KnowledgeBaseView = defineAsyncComponent(() => import('./KBS/KnowledgeBaseView.vue'))

const currentFolder = ref('');
const showCreateForm = ref(false);
const showViewForm = ref(false);
const showEditForm = ref(false);
const currentKnowledgeBase = ref(null);

// 处理查看知识库
const handleView = (knowledgeBase: any) => {
  currentKnowledgeBase.value = knowledgeBase;
  showViewForm.value = true;
  currentFolder.value = knowledgeBase.title;
};

// 处理编辑知识库
const handleEdit = (knowledgeBase: any) => {
  currentKnowledgeBase.value = knowledgeBase;
  showViewForm.value = false;
  showEditForm.value = true;
  currentFolder.value = knowledgeBase.title;
};

// 处理保存知识库
const handleSave = (knowledgeBase: any) => {
  console.log('保存知识库:', knowledgeBase);
  showEditForm.value = false;
  // 这里可以调用API保存知识库
};
</script>