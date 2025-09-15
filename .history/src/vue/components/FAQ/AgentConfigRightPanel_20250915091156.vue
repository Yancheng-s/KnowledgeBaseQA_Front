<template>
  <div class="agent-config-wrapper">
    <div class="agent-config-item">
      <div class="item-content">
        <span class="text">PlayGrouand</span>
        <div class="icons">
          <i class="fas fa-copy"></i>
          <i class="fas fa-share"></i>
          <i class="fas fa-upload"></i>
        </div>
      </div>
    </div>
    
    <!-- 消息列表区域 -->
    <div class="messages-container">
      <!-- 空状态显示 -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-content">
          <img 
            src="@/img/agent/智能体.png" 
            alt="空状态图片" 
            class="empty-image"
          />
          <p class="empty-text">PlayGrouand</p>
        </div>
      </div>
      
      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <!-- 这里渲染消息列表 -->
        <div v-for="message in messages" :key="message.id" class="message-item">
          {{ message.content }}
        </div>
      </div>
    </div>
    
    <!-- 输入框部分 -->
    <div class="input-container">
      <div class="relative rounded-lg p-3 min-h-[120px] border border-gray-200">
        <input
          v-model="inputText"
          type="text"
          class="w-full bg-transparent border-none outline-none text-gray-700 text-sm mb-8"
          placeholder="请输入内容..."
        >
        <div class="absolute bottom-3 left-3 flex items-center gap-3">
          <button 
            class="!rounded-button text-gray-400 hover:text-gray-600"
            :disabled="props.agentData.llm_image !== 'y'"
            :class="{ 'opacity-50 cursor-not-allowed': props.agentData.llm_image !== 'y', 'hover:text-gray-600': props.agentData.llm_img === 'y' }"
            @click="openFolder"
          >
            <i class="fas fa-image text-sm"></i>
          </button>
          <button 
            class="!rounded-button text-gray-400 hover:text-gray-600"
            :disabled="props.agentData.llm_file !== 'y'"
            :class="{ 'opacity-50 cursor-not-allowed': props.agentData.llm_file !== 'y', 'hover:text-gray-600': props.agentData.llm_file === 'y' }"
            @click="openFolder"
          >
            <i class="fas fa-file"></i>
          </button>
        </div>
        <div class="absolute bottom-3 right-3 flex items-center gap-3">
          <span class="text-xs text-gray-400">{{ inputLength }}/129024</span>
          <button
            class="!rounded-button bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5"
            @click="handleSubmit"
          >
            <i class="fas fa-arrow-up text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  agentData: {
    type: Object,
    default: () => ({})
  }
})

// 定时器引用
const timer = ref(null);

// 开始定时打印
onMounted(() => {
  timer.value = setInterval(() => {
    console.log('AgentConfigRightPanel - 当前agentData:', props.agentData);
  }, 3000); // 每3秒打印一次，可根据需要调整时间间隔
});

// 清除定时器，防止内存泄漏
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});

// 计算属性用于判断按钮状态
const isImageEnabled = computed(() => {
  return props.agentData.llm_image === 'y';
});

const isFileEnabled = computed(() => {
  return props.agentData.llm_file === 'y';
});

const inputText = ref('');
const inputLength = computed(() => {
  return inputText.value.length;
});

// 模拟消息列表数据
const messages = ref([]);

const handleSubmit = () => {
  if (inputText.value.trim()) {
    // 添加新消息
    messages.value.push({
      id: Date.now(),
      content: inputText.value
    });
    console.log('提交内容:', inputText.value);
    inputText.value = '';
  }
};

const openFolder = async () => {
  try {
    // Electron 环境下的实现
    if (window.electron && window.electron.openFolderDialog) {
      const folderPath = await window.electron.openFolderDialog();
      if (folderPath) {
        console.log('选择的文件夹路径:', folderPath);
        // 处理选择的文件夹路径
      }
    } 
    // Web 环境下的实现
    else {
      // 创建隐藏的文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
          console.log('选择的文件夹:', files[0].webkitRelativePath);
          // 处理选择的文件夹
        }
      });
      input.click();
    }
  } catch (error) {
    console.error('打开文件夹失败:', error);
  }
};

</script>

<style scoped>
.agent-config-wrapper {
  position: relative;
  min-height: 780px;
  display: flex;
  flex-direction: column;
}

.agent-config-item {
  background-color: #f5f5f5;
  padding: 12px 16px;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.item-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.icons {
  display: flex;
  gap: 8px;
}

.icon-copy,
.icon-share,
.icon-upload {
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  margin: 0 20px;
  position: relative;
}

/* 空状态样式 */
.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 输入框容器 */
.input-container {
  position: relative;
  margin: 0 70px 20px 80px;
  flex-shrink: 0;
}

input::placeholder {
  color: #9CA3AF;
}

/* 消息列表样式 */
.messages-list {
  padding: 16px 0;
}

.message-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>