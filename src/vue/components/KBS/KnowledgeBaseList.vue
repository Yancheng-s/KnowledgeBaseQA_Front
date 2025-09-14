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
      <div class="relative">
        <input 
          type="text" 
          placeholder="搜索知识库名称" 
          class="pl-10 pr-4 py-2 w-64 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        >
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <!-- 列表内容 -->
    <div class="w-full px-4 py-0">
      <div class="bg-white rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
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
                <button class="text-blue-600 hover:text-blue-700 mr-4">
                  <i></i>查看
                </button>
                <button class="text-gray-600 hover:text-gray-700 mr-4">
                  <i></i>编辑
                </button>
                <button class="text-red-600 hover:text-red-700">
                  <i></i>删除
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
import { selectAllKBS } from '@/api/KBS'
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  (e: 'create'): void
}>()

const searchQuery = ref('')

const handleSearch = () => {
  // 搜索逻辑
  console.log('搜索:', searchQuery.value)
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

// 调用 API 获取知识库列表
selectAllKBS().then(res => {
  console.log(res);
  
  const mappedData = res.data.map((item: any) => ({
    title: item.kon_name || '',
    description: item.kon_describe || '',
    certified: true,
    count: getFileCount(item.file_list),
    updateTime: item.update_time || ''
  }));

  // 更新 knowledgeList
  knowledgeList.value = mappedData;
});

onMounted(() => {
  selectAllKBS();
  
})
</script>