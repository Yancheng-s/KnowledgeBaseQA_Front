<!-- src/vue/components/KBS/KnowledgeBaseList.vue -->
<template>
  <div>
    <div class="flex items-center justify-between px-4 py-6">
      <div class="flex space-x-4">
        <button @click="$emit('create')" class="!rounded-button flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50">
          <i class="fas fa-folder-plus mr-2"></i>
          创建知识库
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索知识库名称" 
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

    <!-- 列表内容 -->
    <div class="w-full px-4 py-0">
      <div class="bg-white rounded-lg border border-gray-200">
        <!-- 加载动画 -->
        <div v-if="isLoading" class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="relative mb-4">
              <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <i class="fas fa-book text-blue-600 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
            </div>
            <p class="text-gray-600 text-sm">正在加载知识库...</p>
          </div>
        </div>
        <!-- 知识库列表 -->
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                知识库名称
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                知识数
              </th>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新时间
              </th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in knowledgeList" :key="index">
              <!-- 知识库名称 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-book text-blue-600"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                    <div class="text-sm text-gray-500">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <!-- 知识数 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.count }}</div>
              </td>
              <!-- 更新时间 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.updateTime }}</div>
              </td>
              <!-- 操作 -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="handleView(item)" class="text-blue-600 hover:text-blue-700 mr-4">
                  <i class="fas fa-eye mr-1"></i>查看
                </button>
                <button @click="handleEdit(item)" class="text-gray-600 hover:text-gray-700 mr-4">
                  <i class="fas fa-edit mr-1"></i>编辑
                </button>
                <button @click="handleDelete(item)" class="text-red-600 hover:text-red-700">
                  <i class="fas fa-trash mr-1"></i>删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectAllKBS, searchKBSByName, deleteKBSByName } from '@/api/KBS'
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'view', knowledgeBase: any): void
  (e: 'edit', knowledgeBase: any): void
}>()

const searchQuery = ref('')
const isLoading = ref(false)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，显示所有知识库
    loadAllKnowledgeBases()
    return
  }
  
  isLoading.value = true
  try {
    const res = await searchKBSByName(searchQuery.value.trim())
    console.log('搜索结果:', res)
    
    // 后端直接返回数组，不是包装在data字段中
    if (res && Array.isArray(res)) {
      const mappedData = res.map((item: any) => ({
        title: item.kon_name || '',
        description: item.kon_describe || '',
        certified: true,
        count: getFileCount(item.file_list),
        updateTime: item.update_time || ''
      }))
      
      knowledgeList.value = mappedData
    } else if (res && res.data && Array.isArray(res.data)) {
      // 兼容可能的data包装格式
      const mappedData = res.data.map((item: any) => ({
        title: item.kon_name || '',
        description: item.kon_describe || '',
        certified: true,
        count: getFileCount(item.file_list),
        updateTime: item.update_time || ''
      }))
      
      knowledgeList.value = mappedData
    } else {
      // 如果没有数据，显示空列表
      knowledgeList.value = []
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const loadAllKnowledgeBases = async () => {
  isLoading.value = true
  try {
    const res = await selectAllKBS()
    console.log('获取所有知识库:', res)
    
    // 后端直接返回数组，不是包装在data字段中
    if (res && Array.isArray(res)) {
      const mappedData = res.map((item: any) => ({
        title: item.kon_name || '',
        description: item.kon_describe || '',
        certified: true,
        count: getFileCount(item.file_list),
        updateTime: item.update_time || ''
      }))
      
      knowledgeList.value = mappedData
    } else if (res && res.data && Array.isArray(res.data)) {
      // 兼容可能的data包装格式
      const mappedData = res.data.map((item: any) => ({
        title: item.kon_name || '',
        description: item.kon_describe || '',
        certified: true,
        count: getFileCount(item.file_list),
        updateTime: item.update_time || ''
      }))
      
      knowledgeList.value = mappedData
    } else {
      // 如果没有数据，显示空列表
      knowledgeList.value = []
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    ElMessage.error('获取知识库列表失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  loadAllKnowledgeBases()
}

// 查看知识库
const handleView = (item: any) => {
  emit('view', item)
}

const handleEdit = (item: any) => {
  emit('edit', item)
}

// 删除知识库
const handleDelete = async (item: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除知识库"${item.title}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 显示删除中的加载状态
    isLoading.value = true
    
    try {
      await deleteKBSByName(item.title)
      ElMessage.success('知识库删除成功')
      
      // 删除成功后重新加载列表
      await loadAllKnowledgeBases()
    } catch (error) {
      console.error('删除知识库失败:', error)
      ElMessage.error('删除知识库失败，请重试')
    }
  } catch (error) {
    // 用户取消删除
    console.log('用户取消删除')
  }
}

const knowledgeList = ref([
  {
    title: '',
    description: '',
    certified: true,
    count: 1,
    updateTime: ''
  }
]);

// 获取文件数量
const getFileCount = (fileList: string): number => {
  if (!fileList || typeof fileList !== 'string') return 0; // 如果 file_list 不存在或不是字符串，返回 0

  try {
    // 解析 JSON 字符串为数组
    const parsedFileList = JSON.parse(fileList);
    if (Array.isArray(parsedFileList)) {
      return parsedFileList.length; // 返回数组长度
    }
    return 0; // 如果不是数组，返回 0
  } catch (error) {
    console.error('解析 file_list 失败:', error);
    return 0; // 解析失败时返回 0
  }
};

onMounted(() => {
  loadAllKnowledgeBases()
})
</script>