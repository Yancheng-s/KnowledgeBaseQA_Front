<template>
  <div class="h-full flex flex-col">
    <!-- 搜索区域 - 固定不滚动 -->
    <div class="flex items-center justify-between px-4 py-6 flex-shrink-0 bg-gray-50">
      <div class="flex space-x-4">
        <button class="!rounded-button flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50"
          @click="showAddModel = true">
          <i class="fas fa-folder-plus mr-2"></i>
          创建模型
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索模型名称" 
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

    <!-- 新增模型弹窗 -->
    <AddModel
        :visible="showAddModel"
        @close="showAddModel = false"
        @submit="handleAddModel"
    />
    
    <!-- 可滚动的内容区域 -->
    <div class="flex-1 overflow-y-auto scrollbar-hide">
      <!-- 模型卡片列表 -->
      <div class="grid grid-cols-3 gap-4 px-4 pb-6">
        <div
            v-for="item in modelList"
            :key="item.id"
            class="bg-white rounded-xl shadow-sm border border-[#f0f0f0] p-6 hover:shadow-md transition-shadow flex flex-col h-full">
            <div class="flex flex-col gap-3 flex-1">
                <div class="flex items-center gap-4">
                    <img
                    :src="getVendorPng(item.model_name)"
                    alt="模型图片"
                    class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    @error="e => e.target.src='/vendors/tongyong.png'"
                    />
                    <div class="flex flex-col flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-semibold text-base text-[#222] truncate">{{ item.model_name }}</span>
                            <span class="bg-[#f5f6fa] text-[#8a919f] text-xs px-2 py-[2px] rounded">文本生成</span>
                        </div>
                    </div>
                </div>
                <div class="text-[#5c6273] text-[13px] leading-relaxed mt-2 flex-1">
                    {{ item.model_presentation }}
                </div>
                <div class="flex items-center justify-between flex-wrap mt-4">
                    <span class="text-xs text-[#b1b5be]">{{ getVendorName(item.model_name) }}</span>
                    <span class="text-xs text-[#b1b5be]">{{ item.model_date.split(' ')[0] }}更新</span>
                </div>
            </div>
            <div class="flex items-center justify-between mt-6 border-t border-[#f0f0f0] pt-3 mt-auto">
              <button class="flex-1 text-[#222] text-sm flex items-center justify-center gap-1 hover:underline bg-transparent border-0">
                <svg width="16" height="16" fill="none" class="mr-1" viewBox="0 0 16 16"><path d="M8 2.667a5.333 5.333 0 1 1 0 10.666A5.333 5.333 0 0 1 8 2.667Zm0-1.334a6.667 6.667 0 1 0 0 13.334A6.667 6.667 0 0 0 8 1.333Zm0 3.334a.667.667 0 0 1 .667.666v2.334a.667.667 0 0 1-.667.666H6.667a.667.667 0 1 1 0-1.333h.666V5.333A.667.667 0 0 1 8 4.667Zm0 6a.667.667 0 1 1 0 1.333.667.667 0 0 1 0-1.333Z" fill="#8a919f"/></svg>
                查看详情
              </button>
              <span class="w-px h-5 bg-[#f0f0f0]"></span>
              <button class="flex-1 text-[#222] text-sm flex items-center justify-center gap-1 hover:underline bg-transparent border-0">
                <svg width="16" height="16" fill="none" class="mr-1" viewBox="0 0 16 16"><path d="M8 1.333a6.667 6.667 0 1 1 0 13.334A6.667 6.667 0 0 1 8 1.333Zm0 1.334a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8 2.667Zm-.667 2.666c0-.368.299-.666.667-.666.368 0 .667.298.667.666v2.001l1.333 1.333a.667.667 0 1 1-.943.943l-1.39-1.39A.667.667 0 0 1 7.333 7V5.333Z" fill="#8a919f"/></svg>
                API-KEY
              </button>
              <span class="w-px h-5 bg-[#f0f0f0]"></span>
              <button class="flex-1 text-[#222] text-sm flex items-center justify-center gap-1 hover:underline bg-transparent border-0">
                <svg width="16" height="16" fill="none" class="mr-1" viewBox="0 0 16 16"><path d="M8 1.333a6.667 6.667 0 1 1 0 13.334A6.667 6.667 0 0 1 8 1.333Zm0 1.334a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8 2.667Zm-.667 2.666c0-.368.299-.666.667-.666.368 0 .667.298.667.666v2.001l1.333 1.333a.667.667 0 1 1-.943.943l-1.39-1.39A.667.667 0 0 1 7.333 7V5.333Z" fill="#8a919f"/></svg>
                立即体验
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import AddModel from './AddModel.vue';
import { getVendorPng, getVendorName } from '@/utils/getVendorPng.js';
import { selectAllModelServer } from '@/api/model.js';

const searchQuery = ref('');
const modelList = ref<any[]>([]);
const allModels = ref<any[]>([]);
const showAddModel = ref(false);

function handleSearch() {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，显示所有模型
    modelList.value = allModels.value;
    return;
  }
  
  // 根据模型名称搜索
  modelList.value = allModels.value.filter(model => 
    model.model_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}

const clearSearch = () => {
  searchQuery.value = '';
  modelList.value = allModels.value;
};

function handleAddModel(modelName: string) {
  // 这里可以添加模型的逻辑
  showAddModel.value = false;
  // 例如刷新列表
  fetchModelList();
}

// 获取模型列表
async function fetchModelList() {
  try {
    const res = await selectAllModelServer();
    // 适配 axios 返回结构
    if (res && res.data && Array.isArray(res.data.data)) {
      allModels.value = res.data.data;
      modelList.value = res.data.data;
    } else {
      allModels.value = [];
      modelList.value = [];
    }
  } catch (e) {
    console.error('获取模型列表失败', e);
    allModels.value = [];
    modelList.value = [];
  }
}

onMounted(() => {
  fetchModelList();
});
</script>

<style scoped>
.bg-white {
  background: #fff;
}
.shadow-sm {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}

/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 圆角按钮样式 */
.rounded-button {
  border-radius: 6px;
}
</style>