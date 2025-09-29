<!-- src/vue/components/KBS/CreateKnowledgeBase.vue -->
<template>
    <div class="px-4 py-6">
        <div class="bg-white rounded-lg shadow p-6">
            <!-- 步骤条 -->
            <el-steps style="margin: 1% 2% 0% 2% " :active="active" align-center>
                <el-step title="知识库信息" :icon="Edit" />
                <el-step title="选择数据" :icon="Document" />
                <el-step title="数据处理" :icon="Coin" />
            </el-steps>
            
            <!-- 步骤内容 -->
            <div class="step-content px-4 overflow-y-auto h-screen">
                <!-- 步骤1: 知识库信息 -->
                <div v-if="active === 0" class="h-full">
                    <div class="title__H3TDy py-4 px-4">
                      <span>知识库基础信息</span>
                    </div>
                    <el-form :model="formData" class="flex flex-col items-center py-4 bg-gray-50">
                      <el-form-item label="知识库名称" class="w-full max-w-4xl py-3">
                        <el-input v-model="formData.kon_name" placeholder="请输入知识库名称" class="w-full" />
                      </el-form-item>
                      <el-form-item label="知识库描述" class="w-full max-w-4xl">
                        <el-input
                          v-model="formData.kon_describe"
                          type="textarea"
                          placeholder="请输入知识库描述"
                          class="w-full"
                        />
                      </el-form-item>
                    </el-form>

                    <div class="title__H3TDy py-2 px-4">
                      <span>知识库配置</span>
                    </div>
                    <div class="bg-gray-50 p-8">
                      <div class="mx-auto max-w-4xl">
                        <!-- 配置模式选择 -->
                        <div class="mb-8 grid grid-cols-2 gap-4">
                          <div 
                            class="cursor-pointer rounded-lg border-2 bg-blue-50 p-6"
                            :class="{ 'border-blue-500 bg-blue-50': isRecommended, 'border-gray-200 bg-white': !isRecommended }"
                            @click="setMode('recommended')"
                          >
                            <div class="flex items-center gap-2">
                              <i class="fas fa-thumbs-up text-blue-500 text-xl"></i>
                              <span class="text-lg font-medium">推荐配置</span>
                            </div>
                            <p class="mt-2 text-gray-600">
                              自体推荐配置，在效果、推理成本、检索时延等方面的最佳实践
                            </p>
                          </div>

                          <div 
                            class="cursor-pointer rounded-lg border-2 p-6"
                            :class="{ 'border-blue-500 bg-blue-50': !isRecommended, 'border-gray-200 bg-white': isRecommended }"
                            @click="setMode('custom')"
                          >
                            <div class="flex items-center gap-2">
                              <i class="fas fa-sliders-h text-gray-500 text-xl"></i>
                              <span class="text-lg font-medium">自定义</span>
                            </div>
                            <p class="mt-2 text-gray-600">
                              完全开放的灵活知识库配置，按照检索需求自由配置，获得推理效果
                            </p>
                          </div>
                        </div>

                        <!-- 功能开关 -->
                        <div class="mb-8 flex items-center justify-between rounded-lg">
                          <div class="flex items-center gap-2 rounded-md">
                            <span>多轮对话改写</span>
                            <tippy content="通过细化和调整用户的原始输入query来提升检索结果的精确度和相关性">
                              <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                            </tippy>
                          </div>
                          <button 
                            class="relative h-6 w-12 rounded-full transition-colors duration-300"
                            :class="[
                              isDialogEnabled ? 'bg-blue-500' : 'bg-gray-200',
                              isRecommended && 'opacity-50 cursor-not-allowed'
                            ]"
                            @click="toggleDialog"
                            :disabled="isRecommended"
                          >
                            <span 
                              class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                              :class="{ 'translate-x-6': isDialogEnabled }"
                            ></span>
                          </button>
                        </div>

                        <!-- 模型配置 -->
                        <div class="space-y-6">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">Embedding模型</span>
                            </div>
                            <div class="relative">
                              <!-- 使用 el-select 替代原生下拉框 -->
                              <el-select
                                v-model="selectedModel"
                                placeholder="请选择模型"
                                size="large"
                                style="width: 240px"
                                :disabled="isRecommended"
                              >
                                <el-option
                                  v-for="(value, key) in supported_models"
                                  :key="key"
                                  :label="value"
                                  :value="key"
                                >
                                  <div class="flex flex-col">
                                    <span style="font-size: large;">
                                      {{ value }}</span>
                                    <span style="color: var(--el-text-color-secondary); font-size: 13px">
                                      {{ key }}
                                    </span>
                                  </div>
                                </el-option>
                              </el-select>
                            </div>
                          </div>

                          <!-- 排序配置 -->
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">排序配置</span>
                              <tippy content="对检索结果进行排序，提升检索效率、保持信息精确性、增强内容多样性，确保最终检索结果的满意度">
                                <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                              </tippy>
                            </div>
                            <div class="flex items-center gap-4">
                              <!-- 使用 el-select 替代原生下拉框 -->
                              <el-select
                                v-model="selectedSorting"
                                placeholder="请选择排序策略"
                                size="large"
                                style="width: 240px"
                                :disabled="isRecommended"
                              >
                                <el-option
                                  v-for="(label, key) in sortingOptions"
                                  :key="key"
                                  :label="label"
                                  :value="key"
                                ></el-option>
                              </el-select>
                            </div>
                          </div>

                          <!-- 相似度阈值 -->
                          <div class="space-y-4">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">相似度阈值</span>
                              <tippy content="设定最低分数标准，只有超过这个阈值的检索结果才会被考虑用于后续的生成过程">
                                <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                              </tippy>
                            </div>
                            <div class="flex items-center gap-4">
                              <input 
                                type="range" 
                                min="0.01" 
                                max="1" 
                                step="0.01" 
                                v-model.number="threshold"
                                class="flex-1"
                                :disabled="isRecommended"
                              />
                              <input 
                                type="number" 
                                v-model.number="threshold"
                                class="w-20 rounded-lg border px-3 py-1 text-center" 
                                min="0.01" 
                                max="1" 
                                step="0.01"
                                :disabled="isRecommended"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                
                <!-- 步骤2: 选择数据 -->
                <div v-else-if="active === 1">
                  <div class="title__H3TDy py-2">
                    <span>选择数据</span>
                  </div>
                  <div class="px-4 py-4">
                    <p class="text-gray-500">
                      从数据中心选择导入的数据，并构建知识库索引。新增文档请前往 
                      <span class="items-center text-blue-500 hover:underline">
                        <a href="/upload" class="mr-1 text-inherit">数据中心</a>
                        <el-icon :size="20" class="text-inherit"><Link /></el-icon>
                      </span>
                    </p>
                  </div>

                  <div class="bg-gray-50 py-3 min-h-[calc(75vh-5rem)]">
                    <div class="mx-auto flex">
                      <!-- 左侧导航 -->
                      <div class="w-100 border-r border-gray-200 p-2 min-h-[calc(75vh-5rem)]">
                        <h2 class="text-lg font-medium mb-4 px-4">文件夹</h2>
                        <ul class="space-y-2 px-10">
                          <li 
                            v-for="(category, index) in categories" 
                            :key="index"
                            class="flex items-center p-2 rounded-lg cursor-pointer"
                            :class="[
                              category.isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                            ]"
                            @click="selectFilesByFolder(category.name)"
                          >
                            <i :class="category.icon" class="mr-2"></i>
                            <span>{{ category.name }}</span>
                          </li>
                        </ul>
                      </div>

                      <!-- 中间文件列表 -->
                      <div class="flex-1 p-6">
                        <div class="text-lg font-medium mb-4">请选择文档</div>
                        <div class="bg-white rounded-lg shadow">
                          <table class="w-full">
                            <thead class="bg-gray-50">
                              <tr>
                                <th class="w-12 py-4 px-6">
                                  <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="rounded text-blue-600">
                                </th>
                                <th class="text-left py-4">文件名称</th>
                                <th class="text-left py-4 px-6">文件格式</th>
                                <th class="text-left py-4 px-6">状态</th>
                                <th class="text-left py-4 px-6">数据来源</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="file in files" :key="file.id" class="border-t border-gray-200">
                                <td class="py-4 px-6">
                                  <input type="checkbox" v-model="file.selected" @change="updateGlobalFileSelection(file)" class="rounded text-blue-600">
                                </td>
                                <td class="py-4">{{ file.name }}</td>
                                <td class="py-4 px-6">
                                  <span class="inline-flex items-center">
                                    <i :class="getFileIcon(file.type)" class="mr-2"></i>
                                    {{ file.type }}
                                  </span>
                                </td>
                                <td class="py-4 px-6">
                                  <span class="inline-flex items-center text-green-600">
                                    <i class="fa-solid fa-circle-check mr-2"></i>
                                    导入完成
                                  </span>
                                </td>
                                <td class="py-4 px-6">本地导入</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <!-- 右侧已选文件 -->
                      <div class="w-64 border-l border-gray-200 p-6">
                        <div class="flex items-center justify-between mb-4">
                          <h2 class="text-lg font-medium">已选文件</h2>
                          <span class="text-gray-500">({{ selectedCount }}/10)</span>
                        </div>
                        <div class="space-y-3">
                          <div v-for="file in selectedFiles" :key="file.id" 
                              class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span class="truncate flex-1">{{ file.name }}</span>
                            <button @click="removeFile(file)" class="text-gray-400 hover:text-gray-600">
                              <i class="fa-solid fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 步骤3: 数据处理 -->
                <div v-else-if="active === 2">
                  <div class="title__H3TDy py-2">
                    <span>数据处理</span>
                  </div>
                  <div class="bg-gray-50 p-8">
                    <div class="mx-auto max-w-4xl">
                      <!-- 拼接数据头 -->
                      <div class="mb-8 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-gray-700">Excel 文件表头是否拼接</span>
                          <tippy content="是否将Excel的首行数据，作为表头和每行数据进行拼装。例：首行两列分别为「姓名」「年龄」，第二行两列分别为「张三」「18」，那么开启此功能后，此Excel的切分为：“姓名：张三；年龄：18”。如果无表头，请勿开启此功能">
                            <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                          </tippy>
                        </div>
                        <button 
                          class="relative h-6 w-12 rounded-full transition-colors duration-300"
                          :class="[
                            excelHeaderMerge ? 'bg-blue-500' : 'bg-gray-200',
                          ]"
                          @click="toggleExcelHeaderMerge"
                        >
                          <span 
                            class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                            :class="{ 'translate-x-6': excelHeaderMerge }"
                          ></span>
                        </button>
                      </div>
                      <!-- 文档切分设置 -->
                      <div class="space-y-4">
                        <div class="text-sm text-gray-700">
                          文档切分 chunk <span class="text-red-500">*</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div 
                            :class="[
                              'cursor-pointer rounded-lg border p-4 transition-colors',
                              selecteChunkdMode === 'default' 
                                ? 'border-blue-200 bg-blue-50' 
                                : 'border-gray-200 bg-white hover:border-blue-200'
                            ]"
                            @click="selecteChunkdMode = 'default'"
                          >
                            <div class="mb-2 flex items-center gap-2">
                              <i class="fas fa-brain text-blue-600"></i>
                              <span class="font-medium text-gray-900">智能切分</span>
                              <div class="ml-auto">
                                <i class="fas fa-check-circle" :class="selecteChunkdMode === 'default' ? 'text-blue-600' : 'text-gray-200'"></i>
                              </div>
                            </div>
                            <p class="text-sm text-gray-600">在通用文档的语义chunk切分方式，结合语言模型智能判断文档结构进行切分</p>
                          </div>

                          <div 
                            :class="[
                              'cursor-pointer rounded-lg border p-4 transition-colors',
                              selecteChunkdMode === 'custom' 
                                ? 'border-blue-200 bg-blue-50' 
                                : 'border-gray-200 bg-white hover:border-blue-200'
                            ]"
                            @click="selecteChunkdMode = 'custom'"
                          >
                            <div class="mb-2 flex items-center gap-2">
                              <i class="fas fa-sliders-h text-blue-600"></i>
                              <span class="font-medium text-gray-900">自定义切分</span>
                              <div class="ml-auto">
                                <i class="fas fa-check-circle" :class="selecteChunkdMode === 'custom' ? 'text-blue-600' : 'text-gray-200'"></i>
                              </div>
                            </div>
                            <p class="text-sm text-gray-600">完全开放的chunk切分配置，按照实际文档结构自由设置，通过调整参数实现最佳效果</p>
                          </div>
                        </div>
                        <!-- 分句标识符（仅在自定义切分时显示） -->
                        <div v-if="selecteChunkdMode === 'custom'" class="flex items-center justify-between">
                          <label>分句标识符</label>
                          <div class="relative">
                            <!-- 使用 el-select 替代原生下拉框 -->
                            <el-select
                              v-model="selectedSentenceIdentifier"
                              placeholder="请选择切分方式"
                              size="large"
                              style="width: 240px"
                            >
                              <el-option
                                v-for="(label, key) in sentenceIdentifierOptions"
                                :key="key"
                                :label="value"
                                :value="key"
                              >
                                <div class="flex flex-col">
                                  <span style="color: var(--el-text-color-secondary); font-size: 13px">
                                    {{ key }}
                                  </span>
                                </div>
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        
                        <!-- 分段预估长度（始终显示） -->
                        <div class="mb-4">
                          <label>分段预估长度</label>
                          <tippy content="每个切片的文本长度">
                            <i class="px-2 fas fa-question-circle text-gray-400 cursor-help"></i>
                          </tippy>
                          <div class="flex items-center gap-4">
                            <input 
                              type="range" 
                              min="60" 
                              max="6000" 
                              step="1" 
                              v-model.number="threshold1"
                              class="flex-1"
                            />
                            <input 
                              type="number" 
                              v-model.number="threshold1"
                              class="w-20 rounded-lg border px-3 py-1 text-center" 
                              min="60" 
                              max="6000" 
                              step="1"
                            />
                          </div>
                        </div>

                        <!-- 分段重叠长度（始终显示） -->
                        <div class="mb-4">
                          <label>分段重叠长度</label>
                          <tippy content="当前分片与上一个分片重叠的文本长度">
                            <i class="px-2 fas fa-question-circle text-gray-400 cursor-help"></i>
                          </tippy>
                          <div class="flex items-center gap-4">
                            <input 
                              type="range" 
                              min="0" 
                              max="1024" 
                              step="1" 
                              v-model.number="threshold2"
                              class="flex-1"
                            />
                            <input 
                              type="number" 
                              v-model.number="threshold2"
                              class="w-20 rounded-lg border px-3 py-1 text-center" 
                              min="0" 
                              max="1024" 
                              step="1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-between mt-5 pb-4 px-4 py-2">
              <div>
                <el-button @click="canser">取消</el-button>
                <el-button v-if="active > 0" @click="prev">上一步</el-button>
                <div v-else></div>
              </div>

              <el-button v-if="active < 2" type="primary" @click="next">下一步</el-button>
              <el-button v-else type="primary" @click="finish">导入完成</el-button>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { Edit, Document, Coin, Link } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Tippy } from 'vue-tippy';
import { selectAllFileServer, selectAllFolderServer } from '@/api/folder';
import { addKBS } from '@/api/KBS';

const active = ref(0)

// 定义事件
const emit = defineEmits<{
  (e: 'close', value: string): void
}>()

const next = () => {
  if (active.value < 2) {
    // 更新 file_list 为仅包含文件路径的数组
    formData.file_list = selectedFiles.value
      .map(file => file.path) // 提取 path 属性
      .filter(path => !!path); // 过滤掉可能为空的路径

    active.value++;
    selectFilesByFirstFolder();
  }
};

const prev = () => {
  if (active.value > 0) {
    active.value--
  }
}

const supported_models = reactive({
  "DashScopeEmbedding-v1，通用文本向量表示模型，适用于大多数文本嵌入场景，支持中英文，适合一般文本相似度计算、聚类等任务": "text-embedding-v1",
  "DashScopeEmbedding-v2，升级版文本向量表示模型，在v1基础上优化，提供更好的语义表示能力": "text-embedding-v2",
  "DashScopeEmbedding-v2，异步批量文本嵌入模型，适合大批量文本处理场景，支持异步调用": "text-embedding-v3"
});

const selectedModel = ref("text-embedding-v3"); // 默认选中 v4 版本

// 监听 selectedModel 的变化，同步更新表单数据
watch(selectedModel, (newModelKey) => {
  formData.emb_moddle = supported_models[newModelKey]; // 同步更新表单数据
});

const sortingOptions = reactive({
  "official": "智能排序",
  "gte_rerank": "GTE-ReRank"
});

const selectedSorting = ref("official"); // 默认选中官方排序

watch(selectedSorting, (newSortingKey) => {
  formData.sorting_config = sortingOptions[newSortingKey]; // 同步更新表单数据
});

// 定义表单数据模型
const formData = reactive({
  kon_name: '',
  kon_describe: '',
  emb_moddle: '',
  chunk: 'default',
  sentence_identifier: '按长度切分',
  estimated_length_per_senction: 600,
  segmental_overlap_length: 100,
  excel_header_processing: 'no',
  similarity: null,
  MROD: '',
  sorting_config: '',
  file_list: []
})

const isRecommended = ref(true);
const isDialogEnabled = ref(true);
const threshold = ref(0.2);

// 监听 threshold 的变化，并同步到 formData.similarity
watch(threshold, (newThreshold) => {
  if (newThreshold !== null && newThreshold !== undefined) {
    formData.similarity = newThreshold.toFixed(2); // 确保保留两位小数
  }
});

const setMode = (mode: 'recommended' | 'custom') => {
  isRecommended.value = mode === 'recommended';

  // 如果切换到推荐模式，重置相关状态
  if (isRecommended.value) {
    isDialogEnabled.value = true; // 默认启用多轮对话改写
    threshold.value = 0.2; // 默认相似度阈值

    formData.MROD = '1';
    formData.emb_moddle = 'embedding-v3'; // 默认模型
    formData.sorting_config = '智能排序';
    formData.similarity = '0.20';

    selectedModel.value = "text-embedding-v3"; // 默认选中 v4 版本
  }
};

const toggleDialog = () => {
  isDialogEnabled.value = !isDialogEnabled.value;
};

interface File {
  id: string;
  name: string;
  type: string;
  path: string;
  selected: boolean;
  folder?: string;
  size?: string;
  time?: string;
  icon?: string;
}

const files = ref<File[]>([]);
const allFiles = ref<File[]>([]); // 存储所有文件夹的文件
const currentFolder = ref<string>(''); // 当前选中的文件夹

const currentPage = ref(1);
const selectAll = ref(false);

const selectedFiles = computed(() => allFiles.value.filter(file => file.selected));
const selectedCount = computed(() => selectedFiles.value.length);

const toggleSelectAll = () => {
  // 只影响当前文件夹的文件
  files.value.forEach(file => {
    file.selected = selectAll.value;
    // 同时更新全局文件列表中的对应文件
    const globalFile = allFiles.value.find(f => f.id === file.id);
    if (globalFile) {
      globalFile.selected = selectAll.value;
    }
  });
};

const removeFile = (file: File) => {
  file.selected = false;
  // 同时更新全局文件列表中的对应文件
  const globalFile = allFiles.value.find(f => f.id === file.id);
  if (globalFile) {
    globalFile.selected = false;
  }
};

const updateGlobalFileSelection = (file: File) => {
  // 同步更新全局文件列表中的对应文件
  const globalFile = allFiles.value.find(f => f.id === file.id);
  if (globalFile) {
    globalFile.selected = file.selected;
  }
};

// 文件夹/类目数据模型
const categories = reactive([
  {
    name: '',
    icon: 'fa-regular fa-folder',
    isSelected: false, // 默认未选中
  }
]);

const selectAllFolder = async () => {
  try {
    const res = await selectAllFolderServer(); // 调用接口获取数据

    // 检查接口返回的数据是否有效
    if (res && Array.isArray(res.data)) {
      // 更新 categories 数据
      categories.splice(0, categories.length, ...res.data.map((item: any) => ({
        name: item.folder_name, // 使用 folder_name 作为名称
        id: item.id,           // 保留 id 字段
        icon: "fa-regular fa-folder", // 默认图标
        isSelected: false,
      })));
    } else {
      console.error("接口返回的数据格式不正确:", res);
    }
  } catch (error) {
    console.error("获取文件夹列表失败:", error);
  }
};

const selectFilesByFolder = async (folderName: string = "") => {
  try {
    selectAll.value = false;
    currentFolder.value = folderName;
    
    // 更新文件夹选择状态
    categories.forEach(category => {
      category.isSelected = category.name === folderName;
    });
    
    // 调用接口获取文件列表
    const res = await selectAllFileServer({ folder_name: folderName });

    // 检查接口返回的状态码和数据格式
    if (res.status === 200 && Array.isArray(res.data)) {
      // 检查是否已经存在该文件夹的文件
      const existingFiles = allFiles.value.filter(file => file.folder === folderName);
      
      // 为每个文件生成唯一ID（使用文件夹名+文件名+路径的组合）
      const newFiles = res.data.map((item, index) => {
        const fileId = `${folderName}_${item.file_name}_${index}`;
        
        // 检查是否已经存在该文件，如果存在则保持选择状态
        const existingFile = existingFiles.find(f => f.id === fileId);
        const isSelected = existingFile ? existingFile.selected : false;
        
        return {
          id: fileId, // 使用文件夹名+文件名+索引作为唯一标识
          name: item.file_name, // 文件名称
          type: getFileExtension(item.file_name), // 解析文件类型
          selected: isSelected, // 保持之前的选择状态
          icon: getFileIcon(getFileIcon(item.file_name)), // 动态设置图标
          path: item.file_path, // 文件路径
          size: item.file_size, // 文件大小
          time: item.file_time, // 文件时间
          folder: folderName, // 添加文件夹信息
        };
      });

      // 移除该文件夹的旧文件
      allFiles.value = allFiles.value.filter(file => file.folder !== folderName);
      
      // 添加新文件到全局文件列表
      allFiles.value.push(...newFiles);
      
      // 更新当前显示的文件列表（仅显示当前文件夹的文件）
      files.value = newFiles;
      
      // 更新 selectAll 状态：如果当前文件夹的所有文件都被选中，则 selectAll 为 true
      selectAll.value = newFiles.length > 0 && newFiles.every(file => file.selected);
    } else {
      console.error("接口返回的数据格式不正确:", res);
    }
  } catch (error) {
    console.error("获取文件列表失败:", error);
  }
};

const selectFilesByFirstFolder = async () => { 
  if (categories.length > 0) {
    const firstFolderName = categories[0].name; // 获取第一个文件夹名称
    await selectFilesByFolder(firstFolderName); // 使用统一的文件夹选择逻辑
  }
};

// 辅助函数：解析文件扩展名
const getFileExtension = (fileName: string): string => {
  const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : "unknown"; // 如果没有扩展名，返回 "unknown"
};

// 文件类型与图标映射
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'doc':
    case 'docx':
      return 'fas fa-file-word';
    case 'xls':
    case 'xlsx':
      return 'fas fa-file-excel';
    case 'ppt':
    case 'pptx':
      return 'fas fa-file-powerpoint';
    case 'pdf':
      return 'fas fa-file-pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return 'fas fa-file-image';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return 'fas fa-file-video';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'fas fa-file-audio';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'fas fa-file-archive';
    case 'txt':
    case 'md':
      return 'fas fa-file-alt';
    case 'js':
    case 'ts':
    case 'json':
    case 'vue':
    case 'html':
    case 'css':
      return 'fas fa-file-code';
    default:
      return 'fas fa-file';
  }
}
// 定义 excelHeaderMerge 状态
const excelHeaderMerge = ref(false);

// 切换逻辑
const toggleExcelHeaderMerge = () => {
  excelHeaderMerge.value = !excelHeaderMerge.value;
  // 根据开关状态赋值 "yes" 或 "no"
  formData.excel_header_processing = excelHeaderMerge.value ? "yes" : "no";
};

const selecteChunkdMode = ref('default');

watch(selecteChunkdMode, (newMode) => {
  formData.chunk = newMode; // 同步更新 formData.chunk
});

const sentenceIdentifierOptions = reactive({
  '按长度切分': '按长度切分',
  '按页切分': '按页切分',
  '按照一级标题切分': '按照一级标题切分',
  '按照二级标题切分': '按照二级标题切分'
});

const selectedSentenceIdentifier = ref('按长度切分'); // 默认选中 "按长度切分"

watch(selectedSentenceIdentifier, (newIdentifier) => {
  formData.sentence_identifier = newIdentifier; // 同步更新 formData
});

const threshold1 = ref(600);

// 监听 threshold1 的变化，并同步到 formData.similarity
watch(threshold1, (newThreshold) => {
  if (newThreshold !== null && newThreshold !== undefined) {
    formData.estimated_length_per_senction = newThreshold;
  }
});

const threshold2 = ref(100);

// 监听 threshold1 的变化，并同步到 formData.similarity
watch(threshold2, (newThreshold) => {
  if (newThreshold !== null && newThreshold !== undefined) {
    formData.segmental_overlap_length = newThreshold;
  }
});

const canser = () => {
  // 逻辑处理
  ElMessage.warning('取消创建知识库')
  emit('close', 'knowledge_base_created') // 通知父组件关闭
}

const finish = async () => {
  // 构造请求数据
  const requestData = { ...formData }
  
  try {
    console.log(requestData);
    await addKBS(requestData)
    if (1) {
      ElMessage.success('知识库创建成功')
      emit('close', 'knowledge_base_created') // 通知父组件关闭
    } else {
      ElMessage.error('知识库创建失败')
      emit('close', 'knowledge_base_created') // 通知父组件关闭
    }
  } catch (error) {
    ElMessage.error('请求失败:', error)
    emit('close', 'knowledge_base_created') // 通知父组件关闭
  }
}

onMounted(() => {
  setMode('recommended'); // 默认设置为推荐模式
  selectAllFolder();
  
});
</script>
<style scoped>
.step-content::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.step-content::-webkit-scrollbar-thumb {
  background-color: #3B82F6; /* 滑块颜色 */
  border-radius: 4px; /* 滑块圆角 */
}

.step-content::-webkit-scrollbar-track {
  background-color: #e2e8f0; /* 轨道颜色 */
}

/* 操作按钮区域 */
.flex.justify-between.mt-8.flex-shrink-0 {
  flex-shrink: 0; /* 防止按钮区域被压缩 */
  padding-top: 16px; /* 上边距 */
  padding-bottom: 16px; /* 下边距 */
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #3B82F6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.flex.flex-col.items-center.py-4.bg-gray-50,
.bg-gray-50.p-8 {
  margin-top: 24px; /* 上外边距 */
  margin-bottom: 24px; /* 下外边距 */
  margin-left: auto; /* 左外边距自动 */
  margin-right: auto; /* 右外边距自动 */
  max-width: 1400px; /* 限制最大宽度以保持居中 */
}

.step-content {
  height: calc(100vh - 300px); /* 动态计算高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.step-content::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.step-content::-webkit-scrollbar-thumb {
  background-color: #3B82F6; /* 滑块颜色 */
  border-radius: 4px; /* 滑块圆角 */
}

.step-content::-webkit-scrollbar-track {
  background-color: #e2e8f0; /* 轨道颜色 */
}

.title__H3TDy {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.text-gray-500 {
  color: #777;
}

.text-blue-500 {
  color: #3e9b9e;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.text-inherit {
  color: inherit;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.file-list {
  border-collapse: separate;
  border-spacing: 0;
}

input[type="checkbox"] {
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 禁用状态样式 */
button:disabled,
input:disabled {
  opacity: 0.5; /* 降低透明度 */
  cursor: not-allowed; /* 鼠标悬停时显示禁用图标 */
}

/* 确保下拉框宽度适配 */
.el-select {
  width: 240px;
}

.el-select-dropdown__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px; /* 根据实际需求调整 */
  padding: 12px 16px; /* 根据实际需求调整 */
  margin-top: 10px;
  margin-bottom: 10px; /* 调整间距 */
  
}
</style>