<!-- src/vue/components/KBS/KnowledgeBaseDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-2 text-gray-600">
          <button @click="$emit('back')" class="text-blue-600 hover:text-blue-700 mr-2">
            <i class="fas fa-arrow-left"></i>
          </button>
          <span class="text-blue-600">{{ knowledgeBase?.title || '知识库详情' }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="handleEdit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i class="fas fa-edit mr-2"></i>
            编辑
          </button>
        </div>
      </div>
    </nav>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="relative mb-4">
          <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <i class="fas fa-book text-blue-600 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
        </div>
        <p class="text-gray-600 text-sm">正在加载知识库详情...</p>
      </div>
    </div>

    <!-- 知识库详情 -->
    <div v-else-if="knowledgeBase" class="max-w-7xl mx-auto px-4 py-6">
      <!-- 知识库基本信息 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">知识库名称</label>
              <p class="text-gray-900">{{ knowledgeBase.kon_name || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">知识库描述</label>
              <p class="text-gray-900">{{ knowledgeBase.kon_describe || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 配置参数 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">配置参数</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">嵌入模型</label>
              <p class="text-gray-900">{{ knowledgeBase.emb_moddle || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">分块方式</label>
              <p class="text-gray-900">{{ knowledgeBase.chunk || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">句子标识符</label>
              <p class="text-gray-900">{{ knowledgeBase.sentence_identifier || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">估计长度</label>
              <p class="text-gray-900">{{ knowledgeBase.estimated_length_per_senction || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">分段重叠长度</label>
              <p class="text-gray-900">{{ knowledgeBase.segmental_overlap_length || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">相似度</label>
              <p class="text-gray-900">{{ knowledgeBase.similarity || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件管理 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">文件管理</h2>
        </div>
        <div class="p-6">
          <div v-if="fileList.length === 0" class="text-center py-8">
            <i class="fas fa-folder-open text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-500">暂无文件</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="(file, index) in fileList" 
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-file text-blue-600"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ file.name }}</p>
                  <div class="text-sm text-gray-500">
                    <span>{{ file.size }}</span>
                    <span v-if="file.time" class="ml-2">{{ file.time }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="handlePreview(file)"
                  class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                >
                  <i class="fas fa-eye mr-1"></i>
                  预览
                </button>
                <button 
                  @click="handleDownload(file)"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                >
                  <i class="fas fa-download mr-1"></i>
                  下载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <p class="text-gray-600">加载知识库详情失败</p>
        <button @click="loadKnowledgeBase" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          重试
        </button>
      </div>
    </div>

    <!-- 文件预览组件 -->
    <FilePreview 
      :show="showFilePreview" 
      :file-info="currentFileInfo"
      @close="closeFilePreview"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { getKnowledgeBaseDetail } from '@/api/KBS'

// 使用动态导入来避免TypeScript错误
const FilePreview = defineAsyncComponent(() => import('../FilePreview.vue'))

const props = defineProps<{
  knowledgeBaseId: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'edit', knowledgeBase: any): void
}>()

const isLoading = ref(false)
const knowledgeBase = ref<any>(null)
const fileList = ref<any[]>([])

// 文件预览相关状态
const showFilePreview = ref(false)
const currentFileInfo = ref<any>(null)

// 加载知识库详情
const loadKnowledgeBase = async () => {
  isLoading.value = true
  try {
    console.log('开始加载知识库详情，ID:', props.knowledgeBaseId)
    const res = await getKnowledgeBaseDetail(props.knowledgeBaseId)
    console.log('API返回的原始数据:', res)
    
    // 检查是否是Axios响应对象（有data字段）
    if (res && res.data && typeof res.data === 'object') {
      const data = res.data as any
      console.log('知识库详情数据:', data)
      
      knowledgeBase.value = {
        kon_name: data.kon_name || '',
        kon_describe: data.kon_describe || '',
        emb_moddle: data.emb_moddle || '',
        chunk: data.chunk || '',
        sentence_identifier: data.sentence_identifier || '',
        estimated_length_per_senction: data.estimated_length_per_senction || '',
        segmental_overlap_length: data.segmental_overlap_length || '',
        similarity: data.similarity || '',
        update_time: data.update_time || ''
      }
      
      // 解析文件列表
      fileList.value = parseFileList(data.file_list)
      console.log('最终文件列表:', fileList.value)
    } else {
      console.error('知识库详情数据格式错误:', res)
      ElMessage.error('知识库详情数据格式错误')
    }
  } catch (error) {
    console.error('加载知识库详情失败:', error)
    ElMessage.error('加载知识库详情失败')
  } finally {
    isLoading.value = false
  }
}

// 解析文件列表
const parseFileList = (fileList: string): any[] => {
  console.log('原始文件列表数据:', fileList)
  
  if (!fileList || typeof fileList !== 'string') {
    console.log('文件列表为空或不是字符串')
    return []
  }
  
  try {
    const parsedFileList = JSON.parse(fileList)
    console.log('解析后的文件列表:', parsedFileList)
    
    if (Array.isArray(parsedFileList)) {
      const mappedFiles = parsedFileList.map((url: string) => {
        const fileName = url.split('/').pop() || '未知文件'
        return {
          name: decodeURIComponent(fileName),
          size: '未知大小',
          path: url,
          time: ''
        }
      })
      
      console.log('映射后的文件列表:', mappedFiles)
      return mappedFiles
    }
    console.log('文件列表不是数组')
    return []
  } catch (error) {
    console.error('解析文件列表失败:', error)
    return []
  }
}

// 编辑知识库
const handleEdit = () => {
  emit('edit', knowledgeBase.value)
}

// 预览文件
const handlePreview = (file: any) => {
  console.log('预览文件信息:', file)
  
  if (!file.path) {
    ElMessage.warning('文件路径不存在，无法预览')
    return
  }
  
  currentFileInfo.value = {
    file_name: file.name,
    file_path: file.path,
    file_size: file.size,
    file_time: file.time
  }
  
  showFilePreview.value = true
}

// 下载文件
const handleDownload = (file: any) => {
  if (!file.path) {
    ElMessage.warning('文件路径不存在，无法下载')
    return
  }
  
  const link = document.createElement('a')
  link.href = file.path
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  ElMessage.success(`开始下载: ${file.name}`)
}

// 关闭文件预览
const closeFilePreview = () => {
  showFilePreview.value = false
  currentFileInfo.value = null
}

onMounted(() => {
  loadKnowledgeBase()
})
</script>
