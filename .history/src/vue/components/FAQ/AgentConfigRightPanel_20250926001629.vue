<template>
  <div class="agent-config-wrapper">
    <!-- 消息列表区域 -->
    <div class="messages-container">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-content">
          <img src="@/img/agent/智能体.png" alt="空状态图片" class="empty-image" />
          <p class="empty-text">PlayGround</p>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-item" :class="{ 'user-message': !message.isAI, 'ai-message': message.isAI }">
          <!-- 用户消息 -->
          <div v-if="!message.isAI" class="user-message-content">
            <div class="message-bubble user-bubble">
              <div class="message-text">{{ message.content }}</div>
            </div>
          </div>
          
          <!-- AI消息 -->
          <div v-else class="ai-message-content">
            <div class="message-bubble ai-bubble">
              <div class="message-text">{{ message.content }}</div>
              
              <!-- AI消息统计信息和操作按钮 -->
              <div class="message-footer">
                <!-- 统计信息 -->
                <div v-if="message.stats" class="stats-info">
                  <span class="stat-item">字数: {{ message.stats.char_count }}</span>
                  <span class="stat-separator">|</span>
                  <span class="stat-item">输入token: {{ message.stats.input_tokens }}</span>
                  <span class="stat-separator">|</span>
                  <span class="stat-item">输出token: {{ message.stats.output_tokens }}</span>
                </div>
                
                <!-- 操作按钮 -->
                <div class="action-buttons">
                  <button class="action-btn" title="复制">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="action-btn" title="重新生成">
                    <i class="fas fa-redo"></i>
                  </button>
                  <button class="action-btn" title="获取智能体ID">
                    <i class="fas fa-id-card"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 已上传文件展示区域 -->
    <div v-if="uploadedFiles.length > 0" class="uploaded-files-container mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
          <!-- 图片文件直接展示 -->
          <div v-if="isImageFile(file.name)" class="relative group">
            <!-- 上传中状态 -->
            <div v-if="file.status === 'uploading'" class="w-16 h-16 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
              <div class="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <!-- 上传成功状态 -->
            <img 
              v-else-if="file.status === 'success'"
              :src="file.preview" 
              alt="preview" 
              class="w-16 h-16 object-cover rounded-lg border border-gray-200" 
            />
            
            <!-- 上传失败状态 -->
            <div v-else class="w-16 h-16 bg-red-100 rounded-lg border border-red-300 flex items-center justify-center">
              <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            
            <!-- 删除按钮 -->
            <button 
              v-if="file.status === 'success'"
              @click="removeFile(index)" 
              class="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>

          <!-- 非图片文件显示卡片 -->
          <div v-else class="relative group">
            <!-- 上传中状态 -->
            <div v-if="file.status === 'uploading'" class="flex items-center gap-2 px-3 py-3 bg-gray-200 rounded-lg border border-gray-300 min-w-0 w-48">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-700 truncate max-w-[140px]">{{ file.name }}</div>
                <div class="text-xs text-gray-500">上传中...</div>
              </div>
            </div>
            
            <!-- 上传成功状态 -->
            <div v-else-if="file.status === 'success'" class="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg border border-gray-200 min-w-0">
              <!-- 文件图标 -->
              <div class="flex-shrink-0">
                <i :class="[getFileIcon(file.name), 'text-lg']" :style="{ color: getFileIconColor(file.name) }"></i>
              </div>
              
              <!-- 文件信息 -->
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-900 truncate max-w-[140px]">{{ file.name }}</div>
                <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
              </div>

              <!-- 删除按钮 -->
              <button 
                @click="removeFile(index)" 
                class="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
            
            <!-- 上传失败状态 -->
            <div v-else class="flex items-center gap-2 px-3 py-3 bg-red-100 rounded-lg border border-red-300 min-w-0">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-500 text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-red-800 truncate max-w-[140px]">{{ file.name }}</div>
                <div class="text-xs text-red-600">上传失败</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框部分 -->
    <div class="input-container">
      <div class="bg-white rounded-lg border border-gray-200 p-2">
        <div class="relative">
          <textarea
            v-model="inputText"
            :disabled="isModelNotSelected"
            class="w-full bg-transparent border-none outline-none text-gray-700 text-sm resize-none"
            :class="{ 'opacity-50 cursor-not-allowed': isModelNotSelected }"
            :placeholder="isModelNotSelected ? '请先选择模型' : '请输入内容...'"
            rows="3"
          ></textarea>
          
          <!-- 底部操作栏 -->
          <div class="flex items-center justify-between pt-1">
            <!-- 左侧按钮 -->
            <div class="flex items-center gap-2">
              <button
                class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                :disabled="props.agentData.llm_image !== 'y'"
                :class="{
                  'opacity-50 cursor-not-allowed': props.agentData.llm_image !== 'y',
                  'hover:text-blue-600 hover:bg-blue-50': props.agentData.llm_image === 'y'
                }"
                @click="openImageUpload"
                title="上传图片"
              >
                <i class="fas fa-image text-sm"></i>
              </button>
              <button
                class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                :disabled="props.agentData.llm_file !== 'y'"
                :class="{
                  'opacity-50 cursor-not-allowed': props.agentData.llm_file !== 'y',
                  'hover:text-blue-600 hover:bg-blue-50': props.agentData.llm_file === 'y'
                }"
                @click="openFileUpload"
                title="上传文件"
              >
                <i class="fas fa-file text-sm"></i>
              </button>
            </div>
            
            <!-- 右侧信息 -->
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-400">{{ inputLength }}/129024</span>
              <button
                class="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                :disabled="isModelNotSelected"
                :class="{ 'opacity-50 cursor-not-allowed': isModelNotSelected }"
                @click="handleSubmit"
                title="发送消息"
              >
                <i class="fas fa-arrow-up text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { uploadImage, uploadFile, deleteToolCache, processAgent } from '@/api/agent'

const uploadedFiles = ref([]) // 存储已上传文件对象 { name, size, type, preview }

// 添加上传状态相关变量
const uploadStatus = ref({})

// 创建一个响应式的本地副本用于跟踪变化
const localAgentData = ref({})

const props = defineProps({
  agentData: { type: Object, default: () => ({}) },
  agentId: { type: [Number, String], default: null }
})

console.log('agentId:', props.agentId)

// 计算属性：判断 llm_api 是否为空
const isModelNotSelected = computed(() => {
  const api = props.agentData.llm_api
  return !api || api === '' || api === null || api === undefined
})

// 深度监听 props.agentData 的变化
watch(
  () => props.agentData,
  (newVal) => {
    // 使用深拷贝确保对象内部变化也能被检测到
    localAgentData.value = JSON.parse(JSON.stringify(newVal || {}))
    // console.log('=== agentData 更新 ===')
    // console.log('时间:', new Date().toLocaleTimeString())
    // console.log('新值:', localAgentData.value)
    // console.log('====================')
  },
  { deep: true, immediate: true }
)

// 监听 llm_api 变化
watch(
  () => props.agentData.llm_api,
  (newVal) => {
    console.log('llm_api 变化:', newVal)
  }
)

/* ---------- 数据 ---------- */
const inputText = ref('')
const inputLength = computed(() => inputText.value.length)
const messages = ref([])
const selectedFile = ref(null)   // 普通文件
const imagePreview = ref('')     // 图片预览地址（base64）
const uploading = ref(false)

/* ---------- 方法 ---------- */
const handleSubmit = async () => {
  if (!props.agentId) {
    console.error('agentId 不存在')
    return
  }

  const messageContent = inputText.value.trim()
  if (!messageContent) return

  // 构造请求体
  const payload = {
    ...localAgentData.value,
    message: messageContent,
  }

  try {
    // 调用 API 发送请求并获取响应
    const response = await processAgent(props.agentId, payload)

    console.log('�� 发送的消息:', payload)
    console.log('✅ 返回的消息:', response.data) // 👈 打印返回结果

    // 成功后更新本地消息列表
    messages.value.push({ id: Date.now(), content: messageContent })

    // ✅ 添加 AI 回复消息
    if (response.data && response.data.result) {
      messages.value.push({
        id: Date.now() + 1,
        content: response.data.result,
        isAI: true, // 可选：标记为 AI 消息
        stats: response.data.stats
      })
    } else {
      console.warn('返回数据中缺少 result 字段')
    }

    inputText.value = ''
  } catch (error) {
    console.error('❌ 请求失败:', error.response?.data || error.message)
  }
}

/* ---- 图片上传 ---- */
const openImageUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleImageSelect
  input.click()
}
const handleImageSelect = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  // 添加到列表，设置上传状态
  const fileIndex = uploadedFiles.value.length
  uploadedFiles.value.push({
    name: file.name,
    size: file.size,
    type: 'image',
    preview: '',
    status: 'uploading' // 添加上传状态
  })
  
  const reader = new FileReader()
  reader.onload = async (ev) => {
    const base64 = ev.target.result
    try {
      await uploadImage({ image_data: base64, imagename: file.name })
      // 成功后更新预览和状态
      uploadedFiles.value[fileIndex].preview = base64
      uploadedFiles.value[fileIndex].status = 'success'
    } catch (err) {
      console.error('图片上传失败:', err)
      uploadedFiles.value[fileIndex].status = 'error'
    }
  }
  reader.readAsDataURL(file)
}
const clearImage = () => {
  imagePreview.value = ''
  selectedFile.value = null
}

/* ---- 文件上传 ---- */
const openFileUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = handleFileSelect
  input.click()
}
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  // 添加到列表，设置上传状态
  const fileIndex = uploadedFiles.value.length
  uploadedFiles.value.push({
    name: file.name,
    size: file.size,
    type: 'file',
    status: 'uploading' // 添加上传状态
  })
  
  const reader = new FileReader()
  reader.onload = async (ev) => {
    try {
      await uploadFile({ file_data: ev.target.result, filename: file.name })
      // 成功后更新状态
      uploadedFiles.value[fileIndex].status = 'success'
    } catch (err) {
      console.error('文件上传失败:', err)
      uploadedFiles.value[fileIndex].status = 'error'
    }
  }
  reader.readAsDataURL(file)
}
const clearSelectedFile = () => {
  selectedFile.value = null
}

// 判断是否为图片文件
function isImageFile(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)
}

// 删除文件
const removeFile = async (index) => {
  const file = uploadedFiles.value[index]
  
  try {
    // 调用后端删除接口
    await deleteToolCache({ filename: file.name })
    
    // 从本地列表移除文件
    uploadedFiles.value.splice(index, 1)
  } catch (error) {
    console.error('删除文件失败:', error)
    // 可以在这里添加错误处理逻辑，比如显示错误提示
  }
}

/* ---- 工具函数 ---- */
function formatFileSize(size) {
  if (!size) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'doc': case 'docx': return 'fas fa-file-word'
    case 'xls': case 'xlsx': return 'fas fa-file-excel'
    case 'ppt': case 'pptx': return 'fas fa-file-powerpoint'
    case 'pdf': return 'fas fa-file-pdf'
    case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': return 'fas fa-file-image'
    case 'mp4': case 'avi': case 'mov': case 'wmv': return 'fas fa-file-video'
    case 'mp3': case 'wav': case 'ogg': return 'fas fa-file-audio'
    case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return 'fas fa-file-archive'
    case 'txt': case 'md': return 'fas fa-file-alt'
    case 'js': case 'ts': case 'json': case 'vue': case 'html': case 'css': return 'fas fa-file-code'
    default: return 'fas fa-file'
  }
}
function getFileIconColor(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) return '#10b981'
  if (['pdf'].includes(ext)) return '#ef4444'
  if (['doc', 'docx'].includes(ext)) return '#3b82f6'
  if (['xls', 'xlsx'].includes(ext)) return '#22c55e'
  if (['ppt', 'pptx'].includes(ext)) return '#f97316'
  return '#6b7280'
}
</script>

<style scoped>
.agent-config-wrapper {
  position: relative;
  min-height: 780px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  margin: 0 20px;
  position: relative;
  padding: 0 0px 120px 20px; /* 为输入框留出空间 */
  scroll-behavior: smooth;
  max-height: calc(100vh - 200px);
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.messages-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.empty-state {
  position: absolute;
  inset: 0;
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

.input-container {
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px 4px 0px 20px;
  margin-bottom: 205px;
  flex-shrink: 0;
}

.messages-list {
  padding: 0px 0px 0px 0px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.user-message-content,
.ai-message-content {
  max-width: 100%;
}

.message-bubble {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-bubble {
  background: #f5f5f5;
}

.ai-bubble {
  background: white;
  border-color: #e5e7eb;
}

.message-text {
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.stats-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  flex: 1;
  min-width: 0;
}

.stat-item {
  white-space: nowrap;
}

.stat-separator {
  color: #d1d5db;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #9ca3af;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.uploaded-files-container {
  margin: 0 20px 0 20px;
  flex-shrink: 0;
}

/* 隐藏 textarea 的滚动条 */
textarea {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

textarea::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>