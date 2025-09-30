<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl px-4 h-16 flex items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>智能体</span>
          <i class="fas fa-chevron-right text-xs"></i>
          <!-- 修改面包屑显示逻辑 -->
          <span class="text-blue-600">{{ showCreateForm ? '创建智能体' : currentFolder }}</span>
        </div>
      </div>
    </nav>

    <!-- 条件渲染组件 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <AgentList v-if="!showCreateForm" @create-agent="handleCreateAgent" />
      <CreateAgent v-else @back-to-list="showCreateForm = false" :agent-id="currentAgentId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import CreateAgent from './FAQ/CreateAgent.vue'
import AgentList from './FAQ/AgentList.vue'

const currentFolder = ref('');
const showCreateForm = ref(false);
const currentAgentId = ref<number | null>(null);

const handleCreateAgent = (agentId: number | null) => {
  showCreateForm.value = true;
  currentAgentId.value = agentId;
};

onMounted(() => {
  console.log('🎯 FAQ组件已挂载');
});
</script>