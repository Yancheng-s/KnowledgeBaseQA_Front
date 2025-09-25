<template>
  <div class="agent-config-wrapper">

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
    
    <!-- 文件信息显示区域 -->
    <div v-if="selectedFile" class="file-info-container mb-2">
      <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <!-- 左侧图标和文件名 -->
        <div class="flex items-center gap-3">
          <i :class="getFileIcon(selectedFile.name)" :style="{ color: getFileIconColor(selectedFile.name) }" class="text-xl"></i>
          <div class="text-sm font-semibold text-black truncate max-w-xs">
            {{ selectedFile.name }}
          </div>
        </div>

        <!-- 右侧文件大小和关闭按钮 -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">
            {{ formatFileSize(selectedFile.size) }}
          </span>
          <button
            class="text-gray-400 hover:text-gray-700 transition"
            @click="clearSelectedFile"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 输入框部分 -->
    <div class="input-container">
      <div class="relative rounded-lg p-3 min-h-[120px] border border-gray-200">
        <textarea
          v-model="inputText"
          class="w-full bg-transparent border-none outline-none text-gray-700 text-sm mb-8 resize-none"
          placeholder="请输入内容..."
          rows="3"
        ></textarea>
        <div class="absolute bottom-3 left-3 flex items-center gap-3">
          <button 
            class="!rounded-button text-gray-400 hover:text-gray-600"
            :disabled="props.agentData.llm_image !== 'y'"
            :class="{ 'opacity-50 cursor-not-allowed': props.agentData.llm_image !== 'y', 'hover:text-gray-600': props.agentData.llm_img === 'y' }"
            @click="openImageUpload"
          >
            <i class="fas fa-image text-sm"></i>
          </button>
          <button 
            class="!rounded-button text-gray-400 hover:text-gray-600"
            :disabled="props.agentData.llm_file !== 'y'"
            :class="{ 'opacity-50 cursor-not-allowed': props.agentData.llm_file !== 'y', 'hover:text-gray-600': props.agentData.llm_file === 'y' }"
            @click="openFileUpload"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { uploadImage,uploadFile } from '@/api/agent';

const props = defineProps({
  agentData: {
    type: Object,
    default: () => ({})
  }
})

// 定时器引用
const timer = ref(null);
// 用于存储上一次agentData的JSON字符串
const lastAgentData = ref('');

// 清除定时器，防止内存泄漏
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});

// 使用watch监听agentData变化
watch(
  () => props.agentData,
  (newVal) => {
    const newData = JSON.stringify(newVal);
    // 只有数据发生变化时才打印
    if (newData !== lastAgentData.value) {
      console.log('AgentConfigRightPanel - 当前agentData:', newVal);
      lastAgentData.value = newData;
    }
  },
  { deep: true } // 深度监听对象变化
);

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

// 文件上传相关状态
const selectedFile = ref(null);
const uploading = ref(false);

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

// 图片上传功能
const openImageUpload = async () => {
  try {
    // 创建隐藏的文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // 只接受图片文件
    input.addEventListener('change', handleImageSelect);
    input.click();
  } catch (error) {
    console.error('打开图片选择失败:', error);
  }
};

// 文件上传功能
const openFileUpload = async () => {
  try {
    // 创建隐藏的文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', handleFileSelect);
    input.click();
  } catch (error) {
    console.error('打开文件选择失败:', error);
  }
};

// 处理图片选择
const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploading.value = true;
    
    // 将图片转换为base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      
      // 构造请求数据
      const requestData = {
        image_data: base64Data,
        imagename: file.name
      };
      
      try {
        // 发送请求
        const response = await uploadImage(requestData);
        console.log('图片上传成功:', response);
        
        // 处理响应结果
        if (response.data) {
          // 添加响应消息到消息列表
          // messages.value.push({
          //   id: Date.now(),
          //   content: `图片 ${file.name} 上传成功`
          // });
        }
      } catch (error) {
        console.error('图片上传失败:', error);
        // messages.value.push({
        //   id: Date.now(),
        //   content: `图片 ${file.name} 上传失败: ${error.message}`
        // });
      } finally {
        uploading.value = false;
      }
    };
    reader.readAsDataURL(file);
  }
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploading.value = true;
    
    // 读取文件内容为base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      
      // 构造请求数据
      const requestData = {
        file_data: base64Data, // 使用image_data字段保持与图片上传一致
        filename: file.name
      };
      
      try {
        // 发送请求
        const response = await uploadFile(requestData);
        console.log('文件上传成功:', response);
        
        // 处理响应结果
        if (response.data) {
          // 添加响应消息到消息列表
          // messages.value.push({
          //   id: Date.now(),
          //   content: `文件 ${file.name} 上传成功`
          // });
        }
      } catch (error) {
        console.error('文件上传失败:', error);
        // messages.value.push({
        //   id: Date.now(),
        //   content: `文件 ${file.name} 上传失败: ${error.message}`
        // });
      } finally {
        uploading.value = false;
      }
    };
    reader.readAsDataURL(file);
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const clearSelectedFile = () => {
  selectedFile.value = null;
  uploading.value = false;
};

function getFileIconColor(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['doc', 'docx'].includes(ext)) return '#2B579A'; // Word 蓝
  if (['xls', 'xlsx'].includes(ext)) return '#217346'; // Excel 绿
  if (['ppt', 'pptx'].includes(ext)) return '#D04424'; // PowerPoint 橙
  if (['pdf'].includes(ext)) return '#E50914'; // PDF 红
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return '#10B981'; // 图片绿
  if (['mp4', 'avi', 'mov'].includes(ext)) return '#8B5CF6'; // 视频紫
  if (['mp3', 'wav'].includes(ext)) return '#F59E0B'; // 音频黄
  if (['zip', 'rar', '7z'].includes(ext)) return '#6B7280'; // 压缩包灰
  if (['txt', 'md'].includes(ext)) return '#374151'; // 文本灰
  if (['js', 'ts', 'vue', 'html', 'css', 'json'].includes(ext)) return '#3B82F6'; // 代码蓝
  return '#6B7280'; // 默认灰色
}
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