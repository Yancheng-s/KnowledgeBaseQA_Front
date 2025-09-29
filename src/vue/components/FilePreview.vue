<!-- 文件预览组件 -->
<template>
  <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-6">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
      <!-- 预览头部 -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex-shrink-0">
        <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div class="p-2 sm:p-3 bg-white rounded-lg shadow-md border border-gray-100 flex-shrink-0">
            <i :class="getFileIcon(fileInfo.file_name)" class="text-xl sm:text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-lg font-bold text-gray-900 truncate">{{ fileInfo.file_name }}</h3>
            <div class="flex items-center space-x-2 mt-1 flex-wrap">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <i class="fas fa-weight-hanging mr-1"></i>
                {{ fileInfo.file_size }} MB
              </span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <i class="fas fa-tag mr-1"></i>
                {{ previewType.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button 
            @click="downloadFile" 
            class="group p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
            title="下载文件"
          >
            <i class="fas fa-download text-sm group-hover:animate-bounce"></i>
          </button>
          <button 
            @click="closePreview" 
            class="group p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
            title="关闭预览"
          >
            <i class="fas fa-times text-sm group-hover:rotate-90"></i>
          </button>
        </div>
      </div>

      <!-- 预览内容区域 -->
      <div class="flex-1 overflow-hidden">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div class="text-center">
            <div class="relative mb-6">
              <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <i class="fas fa-file text-blue-600 text-xl animate-pulse"></i>
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">正在加载预览</h3>
            <p class="text-gray-600">请稍候，正在处理文件内容...</p>
            <div class="mt-3 flex justify-center space-x-1">
              <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="flex items-center justify-center h-full bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
          <div class="text-center max-w-md">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <i class="fas fa-exclamation-triangle text-3xl text-red-500 animate-pulse"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">预览加载失败</h3>
            <p class="text-red-600 mb-6 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{{ error }}</p>
            <button 
              @click="retryPreview" 
              class="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <i class="fas fa-redo mr-2 group-hover:rotate-180 transition-transform duration-300"></i>
              <span class="font-semibold">重试预览</span>
            </button>
          </div>
        </div>

        <!-- 图片预览 -->
        <div v-else-if="previewType === 'image'" class="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3">
          <div class="relative max-w-full max-h-full group">
            <img 
              :src="previewUrl || dataUrl" 
              :alt="fileInfo.file_name"
              class="max-w-full max-h-full object-contain rounded-lg shadow-xl transition-all duration-300 group-hover:scale-105"
              @error="handleImageError"
            />
            <div class="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <i class="fas fa-image mr-1"></i>
              图片预览
            </div>
            <div class="absolute bottom-3 left-3 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <i class="fas fa-expand-arrows-alt mr-1"></i>
              点击放大查看
            </div>
          </div>
        </div>

        <!-- PDF预览 -->
        <div v-else-if="previewType === 'pdf'" class="h-full bg-gradient-to-br from-gray-50 to-blue-50">
          <div class="h-full flex flex-col">
            <div class="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shadow-sm flex-shrink-0">
              <div class="flex items-center space-x-2">
                <div class="p-1.5 bg-red-100 rounded-lg">
                  <i class="fas fa-file-pdf text-red-600 text-sm"></i>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-800">PDF 预览</span>
                  <p class="text-xs text-gray-500">支持缩放、翻页等操作</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="downloadFile" 
                  class="group px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <i class="fas fa-download mr-1 group-hover:animate-bounce"></i>
                  下载PDF
                </button>
              </div>
            </div>
            <div class="flex-1 relative min-h-0">
              <iframe 
                :src="previewUrl || dataUrl" 
                class="w-full h-full border-0"
                @error="handlePreviewError"
              ></iframe>
              <div class="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-600 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <i class="fas fa-file-pdf mr-1"></i>
                PDF文档
              </div>
            </div>
          </div>
        </div>

        <!-- 文本预览 -->
        <div v-else-if="previewType === 'text'" class="h-full bg-white">
          <div class="h-full flex flex-col">
            <div class="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fas fa-file-alt text-blue-500"></i>
                <span class="text-sm font-medium text-gray-700">文本预览</span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="downloadFile" 
                  class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <i class="fas fa-download mr-1"></i>
                  下载
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-auto p-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ textContent }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 视频预览 -->
        <div v-else-if="previewType === 'video'" class="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
          <div class="relative max-w-full max-h-full">
            <video 
              :src="previewUrl || dataUrl" 
              controls 
              class="max-w-full max-h-full rounded-lg shadow-2xl"
              @error="handlePreviewError"
            >
              您的浏览器不支持视频播放
            </video>
            <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              <i class="fas fa-video mr-1"></i>
              视频预览
            </div>
          </div>
        </div>

        <!-- 音频预览 -->
        <div v-else-if="previewType === 'audio'" class="h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
          <div class="text-center max-w-md">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i class="fas fa-music text-3xl text-purple-600"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">音频预览</h3>
            <p class="text-gray-600 mb-6 truncate">{{ fileInfo.file_name }}</p>
            <div class="bg-white rounded-xl p-4 shadow-lg">
              <audio 
                :src="previewUrl || dataUrl" 
                controls 
                class="w-full"
                @error="handlePreviewError"
              >
                您的浏览器不支持音频播放
              </audio>
            </div>
          </div>
        </div>

        <!-- Office文档预览 -->
        <div v-else-if="previewType === 'office'" class="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 overflow-auto">
          <div class="text-center w-full max-w-4xl">
            <div class="relative mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <i class="fas fa-file-word text-4xl text-blue-600 animate-pulse"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
              <div class="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-500 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Office文档预览</h3>
            <p class="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">该文档类型需要下载后查看，或使用在线预览服务</p>
            
            <!-- 预览和下载选项 -->
            <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <!-- 在线预览选项 -->
              <div v-if="officePreviewUrls" class="space-y-4">
                <h4 class="text-sm font-bold text-gray-700 text-center">在线预览</h4>
                <button 
                  @click="openOfficePreview('microsoft_office')" 
                  class="group w-full px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <i class="fab fa-microsoft text-lg mr-2 group-hover:animate-bounce"></i>
                  <div class="text-left">
                    <div class="font-bold text-xs">Microsoft Office</div>
                    <div class="text-xs opacity-90">官方预览</div>
                  </div>
                </button>
                <button 
                  @click="openOfficePreview('google_docs')" 
                  class="group w-full px-4 py-3 bg-gradient-to-r from-red-600 via-red-700 to-pink-700 text-white rounded-lg hover:from-red-700 hover:via-red-800 hover:to-pink-800 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <i class="fab fa-google text-lg mr-2 group-hover:animate-bounce"></i>
                  <div class="text-left">
                    <div class="font-bold text-xs">Google Docs</div>
                    <div class="text-xs opacity-90">在线预览</div>
                  </div>
                </button>
              </div>
              
              <!-- 下载选项 -->
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-gray-700 text-center">下载文件</h4>
                <button 
                  @click="downloadFile" 
                  class="group w-full px-4 py-3 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:via-green-800 hover:to-emerald-800 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <i class="fas fa-download text-lg mr-2 group-hover:animate-bounce"></i>
                  <div class="text-left">
                    <div class="font-bold text-xs">服务器下载</div>
                    <div class="text-xs opacity-90">通过服务器</div>
                  </div>
                </button>
                <button 
                  @click="downloadFromDataUrl" 
                  class="group w-full px-4 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:via-purple-800 hover:to-violet-800 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <i class="fas fa-download text-lg mr-2 group-hover:animate-bounce"></i>
                  <div class="text-left">
                    <div class="font-bold text-xs">直接下载</div>
                    <div class="text-xs opacity-90">从浏览器</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 不支持预览 -->
        <div v-else class="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div class="text-center max-w-md">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i class="fas fa-file text-3xl text-gray-500"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">不支持预览</h3>
            <p class="text-gray-600 mb-6">该文件类型暂不支持在线预览</p>
            <button 
              @click="downloadFile" 
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg flex items-center mx-auto"
            >
              <i class="fas fa-download text-lg mr-3"></i>
              <div class="text-left">
                <div class="font-semibold">下载文件</div>
                <div class="text-sm opacity-90">下载后查看</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getFilePreviewUrlServer, getFileContentServer } from '@/api/folder'

// Props
const props = defineProps<{
  show: boolean
  fileInfo: {
    file_name: string
    file_path: string
    file_size: string
    file_time: string
  }
}>()

// Emits
const emit = defineEmits<{
  close: []
  download: [fileInfo: any]
}>()

// 响应式数据
const showPreview = ref(false)
const loading = ref(false)
const error = ref('')
const previewType = ref('')
const dataUrl = ref('')
const previewUrl = ref('')
const textContent = ref('')
const fileContent = ref('')
const officePreviewUrls = ref(null)

// 监听显示状态
watch(() => props.show, (newVal) => {
  showPreview.value = newVal
  if (newVal) {
    loadPreview()
  }
})

// 获取文件图标
const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return 'fas fa-file-pdf text-red-500'
    case 'doc':
    case 'docx':
      return 'fas fa-file-word text-blue-500'
    case 'xls':
    case 'xlsx':
      return 'fas fa-file-excel text-green-500'
    case 'ppt':
    case 'pptx':
      return 'fas fa-file-powerpoint text-orange-500'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'fas fa-file-image text-purple-500'
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'fas fa-file-video text-pink-500'
    case 'mp3':
    case 'wav':
      return 'fas fa-file-audio text-indigo-500'
    default:
      return 'fas fa-file text-gray-500'
  }
}

// 加载预览
const loadPreview = async () => {
  if (!props.fileInfo) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 获取文件预览内容（后端下载文件并返回内容）
    const response = await getFilePreviewUrlServer({
      file_name: props.fileInfo.file_name,
      file_path: props.fileInfo.file_path
    })
    
    previewType.value = response.data.preview_type
    fileContent.value = response.data.file_content
    
    // 根据文件类型处理内容
    if (previewType.value === 'text') {
      // 文本文件：直接使用返回的文本内容
      textContent.value = response.data.file_content
    } else if (previewType.value === 'image' || previewType.value === 'pdf' || 
               previewType.value === 'video' || previewType.value === 'audio' || 
               previewType.value === 'office') {
      // 二进制文件：优先使用data URL，如果没有则使用preview URL
      if (response.data.data_url) {
        dataUrl.value = response.data.data_url
      } else if (response.data.preview_url) {
        previewUrl.value = response.data.preview_url
      }
      
      // 如果是Office文档，保存在线预览URL
      if (previewType.value === 'office' && response.data.office_preview_urls) {
        officePreviewUrls.value = response.data.office_preview_urls
      }
    }
    
  } catch (err) {
    console.error('加载预览失败:', err)
    error.value = '加载预览失败，请重试'
  } finally {
    loading.value = false
  }
}

// 重试预览
const retryPreview = () => {
  loadPreview()
}

// 下载文件
const downloadFile = () => {
  emit('download', props.fileInfo)
  ElMessage.success('开始下载文件')
}

// 关闭预览
const closePreview = () => {
  showPreview.value = false
  emit('close')
}

// 处理图片加载错误
const handleImageError = () => {
  error.value = '图片加载失败'
}

// 处理预览错误
const handlePreviewError = () => {
  error.value = '预览加载失败'
}

// 从data URL下载文件
const downloadFromDataUrl = () => {
  if (!dataUrl.value) return
  
  try {
    const link = document.createElement('a')
    link.href = dataUrl.value
    link.download = props.fileInfo.file_name
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
    
    ElMessage.success(`开始下载文件: ${props.fileInfo.file_name}`)
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error('下载文件失败')
  }
}

// 打开Office文档在线预览
const openOfficePreview = (service: string) => {
  if (!officePreviewUrls.value) return
  
  const previewUrl = officePreviewUrls.value[service]
  if (previewUrl) {
    // 在新窗口中打开预览
    window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    ElMessage.success(`正在打开${service === 'microsoft_office' ? 'Microsoft Office' : 'Google Docs'}预览...`)
  } else {
    ElMessage.error('预览服务不可用')
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #94a3b8, #64748b);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-in {
  animation: fadeInUp 0.3s ease-out;
}

.fade-in-0 {
  animation: fadeInUp 0.3s ease-out;
}

.zoom-in-95 {
  animation: fadeInUp 0.3s ease-out;
}

/* 悬停效果 */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* 渐变背景 */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* 阴影效果 */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

/* 文件图标颜色 */
.fa-file-pdf {
  color: #dc2626;
}

.fa-file-word {
  color: #2563eb;
}

.fa-file-excel {
  color: #16a34a;
}

.fa-file-powerpoint {
  color: #ea580c;
}

.fa-file-image {
  color: #9333ea;
}

.fa-file-video {
  color: #dc2626;
}

.fa-file-audio {
  color: #7c3aed;
}

.fa-file-alt {
  color: #0891b2;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .max-w-5xl {
    max-width: 100vw;
    margin: 0;
    border-radius: 0;
  }
  
  .max-h-\[90vh\] {
    max-height: 100vh;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  /* 小屏幕下的按钮调整 */
  .sm\:px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .sm\:py-6 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  /* 确保内容不会溢出 */
  .overflow-auto {
    overflow: auto;
  }
  
  /* 小屏幕下的文字大小调整 */
  .text-xl {
    font-size: 0.875rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕的进一步优化 */
  .px-4 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .py-4 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .text-sm {
    font-size: 0.75rem;
  }
  
  .text-lg {
    font-size: 0.875rem;
  }
  
  .text-xl {
    font-size: 0.875rem;
  }
  
  /* 按钮在小屏幕下的优化 */
  button {
    min-height: 2.5rem;
  }
  
  /* 图标大小调整 */
  .text-2xl {
    font-size: 1rem;
  }
  
  .text-4xl {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  /* 大屏幕下的优化 */
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .lg\:flex-row {
    flex-direction: row;
  }
}

/* 超宽屏幕优化 */
@media (min-width: 1536px) {
  .max-w-5xl {
    max-width: 64rem;
  }
}

/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 文本选择 */
::selection {
  background-color: #3b82f6;
  color: white;
}

/* 焦点样式 */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 平滑过渡 */
* {
  transition: all 0.2s ease-in-out;
}

/* 容器自适应优化 */
.fixed.inset-0 {
  padding: 0.5rem;
}

@media (min-width: 640px) {
  .fixed.inset-0 {
    padding: 1rem;
  }
}

/* 确保模态框在不同尺寸下都能正确显示 */
.bg-white.rounded-2xl {
  min-height: 0;
  max-height: calc(100vh - 2rem);
}

@media (max-width: 640px) {
  .bg-white.rounded-2xl {
    max-height: 100vh;
    border-radius: 0;
  }
}

/* 内容区域的自适应 */
.flex-1.overflow-hidden {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 确保按钮组在小屏幕下正确换行 */
.flex.flex-col.sm\:flex-row {
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .flex.flex-col.sm\:flex-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flex.flex-col.sm\:flex-row > * {
    width: 100%;
  }
}

/* 网格布局的响应式优化 */
.grid.grid-cols-1.sm\:grid-cols-2 {
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .grid.grid-cols-1.sm\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

/* Office文档预览的2x2网格布局优化 */
.grid.grid-cols-2 {
  gap: 1rem;
}

@media (max-width: 640px) {
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .grid.grid-cols-2 .space-y-4 {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .grid.grid-cols-2 .space-y-4 > * {
    flex: 1;
  }
  
  .grid.grid-cols-2 .space-y-4 button {
    margin: 0;
  }
}

/* 文本截断优化 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 确保图标和文字在小屏幕下不会重叠 */
.flex.items-center.space-x-2 {
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .flex.items-center.space-x-2 {
    gap: 0.25rem;
  }
}

/* 新增动画效果 */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 悬停时的特殊效果 */
.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s infinite;
}

.group:hover .group-hover\:rotate-90 {
  transform: rotate(90deg);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

/* 毛玻璃效果增强 */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 按钮发光效果 */
.shadow-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 加载动画增强 */
.loading-dots {
  display: inline-block;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}
</style>
