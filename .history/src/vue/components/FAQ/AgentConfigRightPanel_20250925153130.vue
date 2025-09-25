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

      <div v-else class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-item">
          {{ message.content }}
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
            :class="{
              'opacity-50 cursor-not-allowed': props.agentData.llm_image !== 'y',
              'hover:text-gray-600': props.agentData.llm_image === 'y'
            }"
            @click="openImageUpload"
          >
            <i class="fas fa-image text-sm"></i>
          </button>
          <button
            class="!rounded-button text-gray-400 hover:text-gray-600"
            :disabled="props.agentData.llm_file !== 'y'"
            :class="{
              'opacity-50 cursor-not-allowed': props.agentData.llm_file !== 'y',
              'hover:text-gray-600': props.agentData.llm_file === 'y'
            }"
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
import { ref, computed } from 'vue'
import { uploadImage, uploadFile } from '@/api/agent'

const uploadedFiles = ref([]) // 存储已上传文件对象 { name, size, type, preview }

// 添加上传状态相关变量
const uploadStatus = ref({})

const props = defineProps({
  agentData: { type: Object, default: () => ({}) }
})

/* ---------- 数据 ---------- */
const inputText = ref('')
const inputLength = computed(() => inputText.value.length)
const messages = ref([])
const selectedFile = ref(null)   // 普通文件
const imagePreview = ref('')     // 图片预览地址（base64）
const uploading = ref(false)

/* ---------- 方法 ---------- */
const handleSubmit = () => {
  if (inputText.value.trim()) {
    messages.value.push({ id: Date.now(), content: inputText.value })
    inputText.value = ''
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
const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
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
}
.messages-container {
  flex: 1;
  overflow-y: auto;
  margin: 0 20px;
  position: relative;
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
  position: relative;
  margin: 0 70px 20px 80px;
  flex-shrink: 0;
}
input::placeholder {
  color: #9ca3af;
}
.messages-list {
  padding: 16px 0;
}
.message-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.uploaded-files-container {
  margin: 0 70px 0 80px;
  flex-shrink: 0;
}
</style>