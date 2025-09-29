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
      <div class="flex items-center space-x-2">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索智能体名称" 
            class="pl-10 pr-10 py-2 w-64 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div> 
    
    <!-- 应用列表 - 可滚动区域 -->
    <div class="flex-1 px-4 pb-1" :class="{ 'overflow-y-auto': agentListMaxHeight !== 'none' }" :style="agentListMaxHeight !== 'none' ? { maxHeight: agentListMaxHeight + 'px' } : {}">
      <!-- 加载动画 -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="relative mb-4">
            <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <i class="fas fa-robot text-blue-600 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
          </div>
          <p class="text-gray-600 text-sm">正在加载智能体...</p>
        </div>
      </div>
      <!-- 空状态 -->
      <div v-else-if="applications.length === 0" class="flex items-center justify-center h-64 text-gray-500">
        <div class="text-center">
          <i class="fas fa-robot text-4xl mb-2"></i>
          <p>暂无智能体</p>
          <p class="text-sm mt-1">点击"创建智能体"开始使用</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <template v-for="app in applications" :key="app.id">
            <div :data-agent-id="app.id" class="bg-white rounded-lg shadow-sm border py-4 pl-5 pr-4 hover:shadow-md transition-shadow">
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
                <button @click="handleConfig(app.id)" class="text-blue-600 px-4 py-1.5 border border-blue-600 !rounded-button whitespace-nowrap">配置</button>
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
                class="absolute w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                :class="getMenuPosition(app.id)"
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

    <!-- 智能体配置页面 -->
    <AgentConfig 
      v-if="showConfigDialog"
      :agent-id="configAgentId"
      :agent-data="configAgentData"
      @close="closeConfig"
      @saved="onConfigSaved"
    />

    <!-- 修改名称对话框 -->
    <div v-if="showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h3 class="text-lg font-medium mb-4">修改智能体名称</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            新的智能体名称
          </label>
          <input 
            type="text" 
            v-model="newAgentName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入新的智能体名称"
            @keyup.enter="confirmEdit"
            ref="nameInput"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
          <button 
            @click="confirmEdit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            确认修改
          </button>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { addAgent, selectAllAgents, deleteAgentById, updateAgentNameById } from '@/api/agent';
import { generateUniqueIntId } from '@/utils/generateId';
import FloatingChat from './FloatingChat.vue';
import AgentConfig from './AgentConfig.vue';
import electronWindowManager from '@/utils/electron-window';
import { ElMessage, ElMessageBox } from 'element-plus';

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
  originalData?: any; // 原始数据用于复制
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

// 搜索相关
const searchQuery = ref('');
const allApplications = ref<Application[]>([]);
const isLoading = ref(false);

// 动态高度计算
const windowHeight = ref(window.innerHeight);
const agentListMaxHeight = computed(() => {
  // 计算可用高度：窗口高度 - 导航栏 - 搜索区域 - 内边距
  const navHeight = 64; // 导航栏高度 (h-16 = 4rem = 64px)
  const searchAreaHeight = 80; // 搜索区域高度 (按钮 + 搜索 + 间距)
  const padding = 32; // 内边距
  const bottomSpacing = 0; // 底部间距
  
  const availableHeight = windowHeight.value - navHeight - searchAreaHeight - padding - bottomSpacing;
  
  // 根据智能体数量动态调整高度
  const agentCount = applications.value.length;
  if (agentCount === 0) {
    return 160; // 空状态最小高度
  } else if (agentCount <= 6) {
    // 智能体较少时，让内容自然撑开，不设置最大高度限制
    return 'none';
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
  isLoading.value = true;
  try {
    const res = await selectAllAgents();
    const mappedData = res.data.map((item: any) => {
      return {
        id: item.agent_id,
        name: item.agent_name,
        model: item.llm_api,
        type: '智能体应用', 
        status: {
          text: item.agent_state === 'active' ? '已发布' : '草稿',
          class: item.agent_state === 'active' ? 'text-green-600 text-sm' : 'text-red-600 text-sm',
          dotClass: item.agent_state === 'active' ? 'text-green-600' : 'text-red-600',
        },
        // 保存原始数据用于复制
        originalData: item
      };
    });
    
    // 保存所有应用数据
    allApplications.value = mappedData;
    applications.value = mappedData;
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，显示所有应用
    applications.value = allApplications.value;
    return;
  }
  
  // 根据名称搜索
  applications.value = allApplications.value.filter(app => 
    app.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const clearSearch = () => {
  searchQuery.value = '';
  applications.value = allApplications.value;
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
const menuPositions = ref<Record<string, { isBottom: boolean; isRight: boolean }>>({});

// 修改名称相关状态
const showEditDialog = ref(false);
const editingAgentId = ref<string | null>(null);
const newAgentName = ref('');

// 悬浮窗相关状态
const showFloatingChat = ref(false);
const selectedAgentId = ref<string | null>(null);

// 配置页面相关状态
const showConfigDialog = ref(false);
const configAgentId = ref<string | null>(null);
const configAgentData = ref<any>(null);

const showMenuForApp = (id: string) => {
  // 清除可能存在的隐藏定时器
  if (hideTimeouts.value[id]) {
    clearTimeout(hideTimeouts.value[id]);
    delete hideTimeouts.value[id];
  }
  
  // 计算菜单位置
  calculateMenuPosition(id);
  
  showMenu.value[id] = true;
};

// 计算菜单位置
const calculateMenuPosition = (id: string) => {
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    const cardElement = document.querySelector(`[data-agent-id="${id}"]`);
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // 检查是否在底部
    const isBottom = rect.bottom + 120 > viewportHeight; // 120px 是菜单的大概高度
    // 检查是否在右侧
    const isRight = rect.right + 130 > viewportWidth; // 130px 是菜单的大概宽度
    
    menuPositions.value[id] = { isBottom, isRight };
  });
};

// 获取菜单位置类名
const getMenuPosition = (id: string) => {
  const position = menuPositions.value[id];
  if (!position) return 'right-0 mt-2';
  
  let classes = '';
  
  // 垂直位置
  if (position.isBottom) {
    classes += 'bottom-full mb-2 ';
  } else {
    classes += 'top-full mt-2 ';
  }
  
  // 水平位置
  if (position.isRight) {
    classes += 'right-0 ';
  } else {
    classes += 'left-0 ';
  }
  
  return classes;
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
  // 找到要修改的智能体
  const agent = applications.value.find(app => app.id === id);
  if (!agent) {
    ElMessage.error('未找到要修改的智能体');
    return;
  }
  
  editingAgentId.value = id;
  newAgentName.value = agent.name;
  showEditDialog.value = true;
  showMenu.value[id] = false;
};

// 处理配置按钮点击
const handleConfig = (id: string) => {
  // 找到要配置的智能体
  const agent = applications.value.find(app => app.id === id);
  if (!agent) {
    ElMessage.error('未找到要配置的智能体');
    return;
  }
  
  configAgentId.value = id;
  configAgentData.value = agent.originalData;
  showConfigDialog.value = true;
};

// 关闭配置页面
const closeConfig = () => {
  showConfigDialog.value = false;
  configAgentId.value = null;
  configAgentData.value = null;
};

// 配置保存成功
const onConfigSaved = async () => {
  closeConfig();
  // 重新加载智能体列表
  await selectAllKBS();
};

const handleCopy = async (id: string) => {
  try {
    // 找到要复制的智能体
    const agent = applications.value.find(app => app.id === id);
    if (!agent) {
      ElMessage.error('未找到要复制的智能体');
      return;
    }
    
    // 显示确认对话框
    await ElMessageBox.confirm(
      `确定要复制智能体"${agent.name}"吗？`,
      '确认复制',
      {
        confirmButtonText: '确定复制',
        cancelButtonText: '取消',
        type: 'info'
      }
    );
    
    // 显示复制中的加载状态
    isLoading.value = true;
    showMenu.value[id] = false;
    
    try {
      // 生成新的agent_id
      const generatedId = generateUniqueIntId();
      const newAgentId = typeof generatedId === 'string' ? parseInt(generatedId, 10) : generatedId;
      
      // 获取原始数据
      const originalData = agent.originalData;
      
      // 创建复制数据，修改名称和ID
      const copyData = {
        ...originalData,
        agent_name: `${originalData.agent_name}副本`,
        agent_id: newAgentId,
        agent_state: "0" // 复制后设为草稿状态
      };
      
      // 发送复制请求
      await addAgent(copyData);
      
      // 复制成功，显示成功消息
      ElMessage.success('智能体复制成功');
      
      // 复制成功后重新加载列表
      await selectAllKBS();
    } catch (error) {
      // 如果复制失败，显示错误消息
      console.error('复制智能体失败:', error);
      ElMessage.error('复制智能体失败，请重试');
    }
  } catch (error) {
    // 用户取消复制
    console.log('用户取消复制');
  }
};

// 确认修改名称
const confirmEdit = async () => {
  if (!editingAgentId.value || !newAgentName.value.trim()) {
    ElMessage.warning('请输入新的智能体名称');
    return;
  }
  
  try {
    await updateAgentNameById(editingAgentId.value, newAgentName.value.trim());
    ElMessage.success('智能体名称修改成功');
    
    // 更新本地数据
    const agent = applications.value.find(app => app.id === editingAgentId.value);
    if (agent) {
      agent.name = newAgentName.value.trim();
    }
    
    // 关闭对话框
    showEditDialog.value = false;
    editingAgentId.value = null;
    newAgentName.value = '';
  } catch (error) {
    console.error('修改智能体名称失败:', error);
    ElMessage.error('修改智能体名称失败，请重试');
  }
};

// 取消修改
const cancelEdit = () => {
  showEditDialog.value = false;
  editingAgentId.value = null;
  newAgentName.value = '';
};

const handleDelete = async (id: string) => {
  try {
    // 找到要删除的智能体信息
    const agent = applications.value.find(app => app.id === id);
    if (!agent) {
      ElMessage.error('未找到要删除的智能体');
      return;
    }

    await ElMessageBox.confirm(
      `确定要删除智能体"${agent.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );
    
    // 显示删除中的加载状态
    isLoading.value = true;
    showMenu.value[id] = false;
    
    try {
      await deleteAgentById(id);
      ElMessage.success('智能体删除成功');
      
      // 删除成功后重新加载列表
      await selectAllKBS();
    } catch (error) {
      console.error('删除智能体失败:', error);
      ElMessage.error('删除智能体失败，请重试');
    }
  } catch (error) {
    // 用户取消删除
    console.log('用户取消删除');
  }
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