<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- 搜索区域 -->
    <div class="flex items-center justify-between px-4 py-6">
      <div class="flex space-x-4">
        <button class="!rounded-button flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50"
          @click="createAgent">
          <i class="fas fa-folder-plus mr-2"></i>
          创建智能体
        </button>
      </div>
      <div class="relative">
        <input 
          type="text" 
          placeholder="搜索智能体名称" 
          class="pl-10 pr-4 py-2 w-64 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        >
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div> 
    
    <!-- 应用列表 - 可滚动区域 -->
    <div class="flex-1 overflow-y-auto px-4 pb-1" :style="{ maxHeight: agentListMaxHeight + 'px' }">
      <div v-if="applications.length === 0" class="flex items-center justify-center h-64 text-gray-500">
        <div class="text-center">
          <i class="fas fa-robot text-4xl mb-2"></i>
          <p>暂无智能体</p>
          <p class="text-sm mt-1">点击"创建智能体"开始使用</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <template v-for="app in applications" :key="app.id">
            <div class="bg-white rounded-lg shadow-sm border py-4 pl-5 pr-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <div>
                <h3 class="text-lg font-medium mb-2 flex items-center">
                  <img :src="agentIcon" alt="icon" class="w-5 h-5 mr-2">
                  {{ app.name }}
                </h3>
                <div class="text-sm text-gray-500 mb-1">应用ID：{{ app.id }}</div>
                <div class="text-sm text-gray-500">适用模型：{{ app.model }}</div>
                </div>
                <div class="flex items-center space-x-1">
                <span :class="app.status.class">{{ app.status.text }}</span>
                <i class="fas fa-circle text-xs" :class="app.status.dotClass"></i>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ app.type }}</span>
                <div class="flex items-center space-x-2">
                <button class="text-blue-600 px-4 py-1.5 border border-blue-600 !rounded-button whitespace-nowrap">配置</button>
                <button class="bg-blue-600 text-white px-4 py-1.5 !rounded-button whitespace-nowrap" @click="openFloatingChat(app.id)">使用</button>

              <!-- 悬停菜单触发按钮 -->
              <div class="relative inline-block">
              <button 
                class="text-gray-400 px-2 py-1.5 !rounded-button whitespace-nowrap"
                @mouseenter="showMenuForApp(app.id)"
                @mouseleave="scheduleHideMenu(app.id)"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>

              <!-- 下拉菜单 -->
              <div 
                v-if="showMenu[app.id]" 
                class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                style="transform: translateX(55px);"
                @click.stop
                @mouseenter="cancelHideMenu(app.id)"
                @mouseleave="hideMenuForApp(app.id)"
              >
                <ul class="py-1">
                  <li>
                    <button 
                      class="w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleEdit(app.id)"
                    >
                      修改应用名
                    </button>
                  </li>
                  <li>
                    <button 
                      class="w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleCopy(app.id)"
                    >
                      复制应用
                    </button>
                  </li>
                  <li>
                    <button 
                      class="w-full text-center py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      @click="handleDelete(app.id)"
                    >
                      删除应用
                    </button>
                  </li>
                </ul>
              </div>
            </div>
              </div>
            </div>
            </div>
        </template>
      </div>
    </div>
  </div>

    <!-- 悬浮窗对话 -->
    <FloatingChat 
      :is-visible="showFloatingChat" 
      :agent-id="selectedAgentId"
      @close="closeFloatingChat"
      @toggle-fullscreen="handleToggleFullscreen"
    />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { addAgent, selectAllAgents } from '@/api/agent';
import { generateUniqueIntId } from '@/utils/generateId';
import FloatingChat from './FloatingChat.vue';
import electronWindowManager from '@/utils/electron-window';

// 图片导入
const agentIcon = '/src/img/agent/智能体.png';

// 定义事件发射
const emit = defineEmits(['create-agent']);

interface Application {
  id: string;
  name: string;
  model: string;
  type: string;
  status: {
    text: string;
    class: string;
    dotClass: string;
  };
}

const applications = ref<Application[]>([
  {
    id: '',
    name: '',
    model: '',
    type: '',
    status: {
      text: '',
      class: 'text-green-600 text-sm',
      dotClass: 'text-green-600'
    }
  }
]);

// 动态高度计算
const windowHeight = ref(window.innerHeight);
const agentListMaxHeight = computed(() => {
  // 计算可用高度：窗口高度 - 导航栏 - 搜索区域 - 内边距
  const navHeight = 64; // 导航栏高度 (h-16 = 4rem = 64px)
  const searchAreaHeight = 80; // 搜索区域高度 (按钮 + 搜索 + 间距) - 再减少10px
  const padding = 32; // 内边距 - 再减少8px
  const bottomSpacing = 0; // 底部间距 - 完全移除
  
  const availableHeight = windowHeight.value - navHeight - searchAreaHeight - padding - bottomSpacing;
  
  // 根据智能体数量动态调整高度
  const agentCount = applications.value.length;
  if (agentCount === 0) {
    return 160; // 空状态最小高度 - 再减少20px
  } else if (agentCount <= 6) {
    // 智能体较少时，使用内容高度，但不超过可用高度
    const contentHeight = Math.ceil(agentCount / 3) * 160 + 12; // 每行约160px + 边距 - 再减少高度
    return Math.min(contentHeight, availableHeight);
  } else {
    // 智能体较多时，使用可用高度
    return Math.max(160, availableHeight);
  }
});

// 监听窗口大小变化
const handleResize = () => {
  windowHeight.value = window.innerHeight;
};

const selectAllKBS = async () => {
  const res = await selectAllAgents();
  applications.value = res.data.map((item: any) => {
    return {
      id: item.agent_id,
      name: item.agent_name,
      model: item.llm_api,
      type: '智能体应用', 
      status: {
        text: item.agent_state === 'active' ? '已发布' : '草稿',
        class: item.agent_state === 'active' ? 'text-green-600 text-sm' : 'text-red-600 text-sm',
        dotClass: item.agent_state === 'active' ? 'text-green-600' : 'text-red-600',
      }
    };
  });
};

async function createAgent() {
  try {
    // 确保 agent_id 是数字类型
    const generatedId = generateUniqueIntId();
    const agentId = typeof generatedId === 'string' ? parseInt(generatedId, 10) : generatedId;
    
    const agentData = {
      agent_name: "智能体应用",
      agent_state: "1",
      agent_id: agentId, // 使用处理后的数字类型 ID
      llm_api: "",
      llm_prompt: "",
      llm_image: "n",
      llm_knowledge: "",
      llm_file: "n",
      llm_internet: "n",
      llm_memory: "n",
      llm_maximum_length_of_reply: "1024",
      llm_carry_number_of_rounds_of_context: "2",
      llm_temperature_coefficient: "0.1"
    };

    const response = await addAgent(agentData);
    
    if (response.data && response.data.success) {
      selectAllKBS();
      console.log('智能体创建成功:', response.data);
      emit('create-agent', agentId);
    } else {
      console.error('智能体创建失败:', response.data?.message || '未知错误');
      emit('create-agent', agentId);
    }
  } catch (error) {
    console.error('创建智能体时发生错误:', error);
    emit('create-agent', null);
  }
}

const showMenu = ref<Record<string, boolean>>({}); // 菜单是否显示
const isHoveringMenu = ref<Record<string, boolean>>({}); // 是否正在悬停菜单
const hideTimeouts = ref<Record<string, number>>({});

// 悬浮窗相关状态
const showFloatingChat = ref(false);
const selectedAgentId = ref<string | null>(null);

const showMenuForApp = (id: string) => {
  // 清除可能存在的隐藏定时器
  if (hideTimeouts.value[id]) {
    clearTimeout(hideTimeouts.value[id]);
    delete hideTimeouts.value[id];
  }
  showMenu.value[id] = true;
};

// 添加方法：打开/关闭某个 app 的菜单
const toggleMenu = (id: string) => {
  showMenu.value[id] = !showMenu.value[id];
};

const hideMenuForApp = (id: string) => {
  showMenu.value[id] = false;
};

const scheduleHideMenu = (id: string) => {
  hideTimeouts.value[id] = window.setTimeout(() => {
    showMenu.value[id] = false;
    delete hideTimeouts.value[id];
  }, 150); // 150ms 延迟
};

const cancelHideMenu = (id: string) => {
  if (hideTimeouts.value[id]) {
    clearTimeout(hideTimeouts.value[id]);
    delete hideTimeouts.value[id];
  }
};

const handleEdit = (id: string) => {
  console.log('修改应用名:', id);
  showMenu.value[id] = false;
};

const handleCopy = (id: string) => {
  console.log('复制应用:', id);
  showMenu.value[id] = false;
};

const handleDelete = (id: string) => {
  console.log('删除应用:', id);
  showMenu.value[id] = false;
};

const isMenuActive = (id: string): boolean => {
  return showMenu.value[id] === true;
};

const handleLeaveButton = (id: string) => {
  setTimeout(() => {
    if (!isHoveringMenu.value[id]) {
      toggleMenu(id);
    }
  }, 50);
};

// 悬浮窗相关方法
const openFloatingChat = async (agentId: string) => {
  console.log('🔍 环境检测结果:', {
    isElectron: electronWindowManager.isElectron,
    windowProcess: typeof window !== 'undefined' ? window.process : 'undefined',
    processType: typeof window !== 'undefined' && window.process ? window.process.type : 'undefined'
  });
  
  // 检查是否在Electron环境中
  if (electronWindowManager.isElectron) {
    // 在Electron环境中，创建独立窗口
    try {
      const agent = applications.value.find(app => app.id === agentId);
      const agentName = agent ? agent.name : 'AI助手';
      
      const windowId = await electronWindowManager.createFloatingWindow(agentId, agentName);
      if (windowId) {
        console.log(`成功创建Electron窗口，窗口ID: ${windowId}`);
      } else {
        console.warn('创建Electron窗口失败，回退到普通悬浮窗');
        // 回退到普通悬浮窗
        selectedAgentId.value = agentId;
        showFloatingChat.value = true;
      }
    } catch (error) {
      console.error('创建Electron窗口时出错:', error);
      // 回退到普通悬浮窗
      selectedAgentId.value = agentId;
      showFloatingChat.value = true;
    }
  } else {
    // 不在Electron环境中，使用普通悬浮窗
    selectedAgentId.value = agentId;
    showFloatingChat.value = true;
  }
};

const closeFloatingChat = () => {
  showFloatingChat.value = false;
  selectedAgentId.value = null;
};

const handleToggleFullscreen = (isFullscreen: boolean) => {
  console.log('全屏状态:', isFullscreen);
  // 这里可以添加全屏相关的逻辑
};

onMounted(() => {
  selectAllKBS();
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 移除窗口大小变化监听器
  window.removeEventListener('resize', handleResize);
});

</script>

<style>

</style>