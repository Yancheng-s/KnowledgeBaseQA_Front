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

    <!-- 图片预览区域（新增） -->
    <div v-if="imagePreview" class="image-preview-container mb-2">
      <div class="relative inline-block">
        <img :src="imagePreview" class="preview-img" alt="preview" />
        <button class="preview-close" @click="clearImage">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 文件信息显示区域 -->
    <div v-if="selectedFile && !imagePreview" class="file-info-container mb-2">
      <div class="file-card">
        <!-- 左侧 -->
        <div class="file-left">
          <i
            :class="getFileIcon(selectedFile.name)"
            :style="{ color: getFileIconColor(selectedFile.name) }"
            class="file-icon"
          />
          <span class="file-name">{{ selectedFile.name }}</span>
        </div>

        <!-- 右侧 -->
        <div class="file-right">
          <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          <button class="file-del" @click="clearSelectedFile">
            <i class="fas fa-times" />
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
  selectedFile.value = file
  uploading.value = true
  const reader = new FileReader()
  reader.onload = async (ev) => {
    imagePreview.value = ev.target.result          // 先展示
    const base64 = ev.target.result
    try {
      await uploadImage({ image_data: base64, imagename: file.name })
    } catch (err) {
      console.error('图片上传失败:', err)
    } finally {
      uploading.value = false
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
  selectedFile.value = file
  uploading.value = true
  const reader = new FileReader()
  reader.onload = async (ev) => {
    try {
      await uploadFile({ file_data: ev.target.result, filename: file.name })
    } catch (err) {
      console.error('文件上传失败:', err)
    } finally {
      uploading.value = false
    }
  }
  reader.readAsDataURL(file)
}
const clearSelectedFile = () => {
  selectedFile.value = null
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

/* 图片预览区样式 */
.image-preview-container {
  display: flex;
  justify-content: center;
  margin: 0 20px;
}
.preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.preview-close {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
}
.preview-close:hover {
  color: #111827;
}
</style>