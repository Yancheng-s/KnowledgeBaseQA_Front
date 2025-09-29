<!-- src/vue/components/FAQ/AgentConfig.vue -->
<template>
  <div class="px-4 py-6" style="min-height: 100vh;">
    <div class="bg-white rounded-lg shadow p-6 flex flex-col" style="min-height: calc(100vh - 48px);">
      <!-- 页面标题 -->
      <div class="mb-6 flex-shrink-0">
        <h2 class="text-2xl font-bold text-gray-900">智能体配置</h2>
        <p class="text-gray-600 mt-1">配置智能体的基本信息和参数设置</p>
      </div>
      
      <!-- 配置内容 -->
      <div class="step-content px-4 overflow-y-auto flex-1" style="max-height: calc(100vh - 300px);">
        <!-- 基本信息 -->
        <div class="title__H3TDy py-2 px-4">
          <span>智能体基本信息</span>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="max-w-4xl mx-auto">
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">智能体名称</label>
              <el-input v-model="formData.agent_name" placeholder="请输入智能体名称" class="w-full" />
            </div>
            <div class="mb-0">
              <label class="block text-sm font-medium text-gray-700 mb-1">智能体状态</label>
              <el-select v-model="formData.agent_state" placeholder="请选择智能体状态" class="w-full">
                <el-option label="草稿" value="0" />
                <el-option label="已发布" value="1" />
              </el-select>
            </div>
          </div>
        </div>

        <!-- LLM配置 -->
        <div class="title__H3TDy py-2 px-4 mt-6">
          <span>LLM配置</span>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="mx-auto max-w-4xl">
            <!-- API配置 -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">API接口</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="选择或输入LLM API接口"></i>
                </div>
                <div class="flex items-center gap-2">
                  <el-button @click="openModelSelect" type="primary" size="small" class="px-3">
                    <i class="fas fa-list mr-1"></i>选择模型
                  </el-button>
                </div>
              </div>
              <div class="mt-2">
                <el-input v-model="formData.llm_api" placeholder="请输入LLM API接口" class="w-full" />
              </div>
            </div>

            <!-- 提示词配置 -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">系统提示词</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="输入系统提示词，用于指导AI的行为"></i>
                </div>
                <div class="flex items-center gap-2">
                  <el-button @click="optimizePrompt" type="success" size="small" class="px-3">
                    <i class="fas fa-magic mr-1"></i>优化提示词
                  </el-button>
                </div>
              </div>
              <div class="mt-2">
                <el-input
                  v-model="formData.llm_prompt"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入系统提示词"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 功能开关 -->
            <div class="mb-8 space-y-4">
              <div class="flex items-center justify-between rounded-lg p-4 bg-white border">
                <div class="flex items-center gap-2">
                  <span class="font-medium">图像处理</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="启用图像处理功能"></i>
                </div>
                <button 
                  class="relative h-6 w-12 rounded-full transition-colors duration-300"
                  :class="formData.llm_image === 'y' ? 'bg-blue-500' : 'bg-gray-200'"
                  @click="toggleImage"
                >
                  <span 
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                    :class="{ 'translate-x-6': formData.llm_image === 'y' }"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between rounded-lg p-4 bg-white border">
                <div class="flex items-center gap-2">
                  <span class="font-medium">知识库检索</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="启用知识库检索功能"></i>
                </div>
                <button 
                  class="relative h-6 w-12 rounded-full transition-colors duration-300"
                  :class="formData.llm_knowledge ? 'bg-blue-500' : 'bg-gray-200'"
                  @click="toggleKnowledge"
                >
                  <span 
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                    :class="{ 'translate-x-6': formData.llm_knowledge }"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between rounded-lg p-4 bg-white border">
                <div class="flex items-center gap-2">
                  <span class="font-medium">文件处理</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="启用文件处理功能"></i>
                </div>
                <button 
                  class="relative h-6 w-12 rounded-full transition-colors duration-300"
                  :class="formData.llm_file === 'y' ? 'bg-blue-500' : 'bg-gray-200'"
                  @click="toggleFile"
                >
                  <span 
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                    :class="{ 'translate-x-6': formData.llm_file === 'y' }"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between rounded-lg p-4 bg-white border">
                <div class="flex items-center gap-2">
                  <span class="font-medium">网络搜索</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="启用网络搜索功能"></i>
                </div>
                <button 
                  class="relative h-6 w-12 rounded-full transition-colors duration-300"
                  :class="formData.llm_internet === 'y' ? 'bg-blue-500' : 'bg-gray-200'"
                  @click="toggleInternet"
                >
                  <span 
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                    :class="{ 'translate-x-6': formData.llm_internet === 'y' }"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between rounded-lg p-4 bg-white border">
                <div class="flex items-center gap-2">
                  <span class="font-medium">记忆功能</span>
                  <i class="fas fa-question-circle text-gray-400 cursor-help" title="启用记忆功能"></i>
                </div>
                <button 
                  class="relative h-6 w-12 rounded-full transition-colors duration-300"
                  :class="formData.llm_memory === 'y' ? 'bg-blue-500' : 'bg-gray-200'"
                  @click="toggleMemory"
                >
                  <span 
                    class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                    :class="{ 'translate-x-6': formData.llm_memory === 'y' }"
                  ></span>
                </button>
              </div>
            </div>

            <!-- 参数配置 -->
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">最大回复长度</label>
                  <el-input 
                    v-model="formData.llm_maximum_length_of_reply" 
                    type="number" 
                    placeholder="1024"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">上下文轮数</label>
                  <el-input 
                    v-model="formData.llm_carry_number_of_rounds_of_context" 
                    type="number" 
                    placeholder="2"
                    class="w-full"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">温度系数</label>
                <el-input 
                  v-model="formData.llm_temperature_coefficient" 
                  type="number" 
                  step="0.1"
                  placeholder="0.1"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between mt-5 pb-4 px-4 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div>
          <el-button @click="cancel">取消</el-button>
        </div>
        <div>
          <el-button type="primary" @click="save" :loading="isLoading">保存配置</el-button>
        </div>
      </div>
    </div>

    <!-- 模型选择对话框 -->
    <ModelSelectDialog 
      v-if="showModelDialog"
      :visible="showModelDialog"
      @close="closeModelSelect"
      @select="handleModelSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { updateAgentById, optimizePromptWordsService } from '@/api/agent';
import ModelSelectDialog from './ModelSelectDialog.vue';

// 定义props
const props = defineProps<{
  agentId: string;
  agentData?: any;
}>();

// 定义emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

// 表单数据
const formData = ref({
  agent_name: '',
  agent_state: '0',
  agent_id: '',
  llm_api: '',
  llm_prompt: '',
  llm_image: 'n',
  llm_knowledge: '',
  llm_file: 'n',
  llm_internet: 'n',
  llm_memory: 'n',
  llm_maximum_length_of_reply: '1024',
  llm_carry_number_of_rounds_of_context: '2',
  llm_temperature_coefficient: '0.1'
});

const isLoading = ref(false);

// 模型选择相关状态
const showModelDialog = ref(false);

// 功能开关切换
const toggleImage = () => {
  formData.value.llm_image = formData.value.llm_image === 'y' ? 'n' : 'y';
};

const toggleKnowledge = () => {
  formData.value.llm_knowledge = formData.value.llm_knowledge ? '' : 'enabled';
};

const toggleFile = () => {
  formData.value.llm_file = formData.value.llm_file === 'y' ? 'n' : 'y';
};

const toggleInternet = () => {
  formData.value.llm_internet = formData.value.llm_internet === 'y' ? 'n' : 'y';
};

const toggleMemory = () => {
  formData.value.llm_memory = formData.value.llm_memory === 'y' ? 'n' : 'y';
};

// 保存配置
const save = async () => {
  if (!formData.value.agent_name.trim()) {
    ElMessage.warning('请输入智能体名称');
    return;
  }

  isLoading.value = true;
  try {
    await updateAgentById(props.agentId, formData.value);
    ElMessage.success('智能体配置保存成功');
    emit('saved');
  } catch (error) {
    console.error('保存智能体配置失败:', error);
    ElMessage.error('保存智能体配置失败，请重试');
  } finally {
    isLoading.value = false;
  }
};

// 取消配置
const cancel = () => {
  emit('close');
};

// 打开模型选择对话框
const openModelSelect = () => {
  showModelDialog.value = true;
};

// 关闭模型选择对话框
const closeModelSelect = () => {
  showModelDialog.value = false;
};

// 处理模型选择
const handleModelSelect = (model: any) => {
  formData.value.llm_api = model.model_name;
  showModelDialog.value = false;
  ElMessage.success(`已选择模型: ${model.model_name}`);
};

// 优化提示词
const optimizePrompt = async () => {
  if (!formData.value.llm_prompt.trim()) {
    ElMessage.warning('请先输入提示词内容');
    return;
  }

  try {
    isLoading.value = true;
    console.log('发送优化请求:', { prompt: formData.value.llm_prompt });
    
    const response = await optimizePromptWordsService({
      prompt: formData.value.llm_prompt
    });
    
    console.log('优化响应:', response);
    
    if (response && response.data && response.data.optimized_prompt) {
      formData.value.llm_prompt = response.data.optimized_prompt;
      ElMessage.success('提示词优化完成');
    } else if (response && response.data && response.data.optimized_prompt === '') {
      ElMessage.warning('优化后的提示词为空，请检查输入内容');
    } else {
      console.log('响应数据格式异常:', response);
      ElMessage.warning('提示词优化失败，请重试');
    }
  } catch (error) {
    console.error('提示词优化失败:', error);
    
    // 根据错误类型给出不同的提示
    if (error.response) {
      // 服务器响应了错误状态码
      console.error('服务器错误:', error.response.status, error.response.data);
      ElMessage.error(`服务器错误: ${error.response.status}`);
    } else if (error.request) {
      // 请求发送了但没有收到响应
      console.error('网络错误:', error.request);
      ElMessage.error('网络连接失败，请检查网络连接');
    } else {
      // 其他错误
      console.error('其他错误:', error.message);
      ElMessage.error('提示词优化失败，请重试');
    }
  } finally {
    isLoading.value = false;
  }
};

// 初始化数据
onMounted(() => {
  if (props.agentData) {
    formData.value = { ...props.agentData };
  }
});
</script>

<style scoped>
.title__H3TDy {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

/* 开关按钮样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 确保输入框宽度适配 */
.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
}

/* 操作按钮区域 */
.flex.justify-between.mt-8.flex-shrink-0 {
  flex-shrink: 0;
  padding-top: 16px;
  padding-bottom: 16px;
}

/* 确保页面布局正确 */
.step-content {
  padding-bottom: 20px;
}

/* 减少表单项间距 */
.el-form-item {
  margin-bottom: 8px;
}

/* 进一步减少Element Plus表单项的默认间距 */
.el-form-item__content {
  margin-bottom: 0;
}

.el-form-item__label {
  margin-bottom: 4px;
}

/* 优化标题间距 */
.title__H3TDy {
  margin-bottom: 8px;
}

/* 确保按钮区域固定在底部 */
.bg-white.border-t {
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-top: auto;
}

/* 确保整个页面布局正确 */
.flex.flex-col {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-1 {
  flex: 1;
  min-height: 0;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
