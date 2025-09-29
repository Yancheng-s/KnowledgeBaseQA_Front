<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      @click.self="close"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[800px] max-h-[80vh] overflow-y-auto p-0 pb-4">
        <!-- 标题和搜索 -->
        <div class="flex items-center justify-between px-4 py-6 rounded-t-2xl ">
          <div class="flex space-x-4">
            <span class="font-semibold text-lg">模型列表</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="搜索模型名称" 
                class="pl-10 pr-10 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <button 
              @click="handleSearch"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              搜索
            </button>
          </div>
        </div>
        <!-- 模型卡片列表 -->
        <div class="grid grid-cols-3 md:grid-cols-2 gap-4 px-4" style="aspect-ratio: 3/2;">
          <div
            v-for="item in filteredModelList"
            :key="item.id"
            class="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            @click="selectModel(item)"
            style="aspect-ratio: 3/2;"
          >
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
                    <span class="bg-[#f5f6fa] text-[#8a919f] text-xs px-2 py-[2px] rounded">文本对话</span>
                  </div>
                </div>
              </div>
              <div class="text-[#5c6273] text-[13px] leading-relaxed flex-1">
                {{ item.model_presentation }}
              </div>
              <div class="flex items-center justify-between flex-wrap">
                <span class="text-xs text-[#b1b5be]">{{ item.model_date.split(' ')[0] }}更新</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { getVendorPng } from '@/utils/getVendorPng.js';
import { selectAllModelServer } from '@/api/model.js';

const props = defineProps<{
  visible: boolean,
}>();
const emit = defineEmits(['close', 'select']);

const searchQuery = ref('');
const modelList = ref<any[]>([]);
const allModels = ref<any[]>([]);

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

async function fetchModelList() {
  try {
    const res = await selectAllModelServer();
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

watch(() => props.visible, (val) => {
  if (val) fetchModelList();
});

const filteredModelList = computed(() => {
  return modelList.value;
});

function selectModel(item: any) {
  emit('select', {
    ...item,
    model_image: getVendorPng(item.model_name)
  });
  emit('close');
}

function close() {
  emit('close');
}
</script>

<style scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>