<template>
  <div class="min-h-screen">
    <div class="mx-auto max-w-7xl px-4">
      <!-- API配置卡片 -->
      <div class="flex items-center gap-2 mb-2 mt-6">
        <span class="text-lg font-bold text-gray-900">API配置</span>
      </div>
      <div
        ref="apiConfigCard"
        class="bg-white border border-gray-200 rounded-xl pr-4 py-3 flex items-center justify-between mb-6 cursor-pointer hover:shadow transition relative"
        @click.stop="showApiConfig = true"
      >
        <div class="flex items-center gap-2">
          <span class="ml-4 flex items-center gap-2 text-gray-500">
            <img
              v-if="selectedModel && selectedModel.model_image"
              :src="selectedModel.model_image"
              alt="模型图片"
              class="w-6 h-6 rounded object-cover"
              @error="e => (e.target as HTMLImageElement).src='/vendors/tongyong.png'"
            />
            <span>{{ selectedModel?.model_name || '暂未选择模型' }}</span>
          </span>
        </div>
        <button class="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition">
          <i class="fa-solid fa-gear"></i>
          <span class="text-sm">设置</span>
        </button>

        <!-- 浮窗 -->
        <transition name="fade">
          <div
            v-if="showApiConfig"
            class="absolute left-0 top-full z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-full"
            @click.stop
          >
            <div class="rounded-xl bg-white p-6">
              <!-- 模型选择 -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                  <span class="text-base font-medium text-blue-600 flex items-center gap-2">
                    <i class="fa-solid fa-robot text-blue-600"></i>
                    模型选择
                  </span>
                  <span class="ml-4 flex items-center gap-2 text-gray-500">
                    <img
                      v-if="selectedModel && selectedModel.model_image"
                      :src="selectedModel.model_image"
                      alt="模型图片"
                      class="w-6 h-6 rounded object-cover"
                      @error="e => (e.target as HTMLImageElement).src='/vendors/tongyong.png'"
                    />
                    <span>{{ selectedModel?.model_name || '暂未选择模型' }}</span>
                  </span>
                </div>
                <button
                  class="flex items-center gap-2 text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-50 transition"
                  @click.stop="showModelDialog = true"
                >
                  <i class="fa-solid fa-rotate-right"></i>
                  <span>选择模型</span>
                </button>
                <ModelSelectDialog
                  :visible="showModelDialog"
                  @close="showModelDialog = false"
                  @select="handleModelSelect"
                />
              </div>

              <!-- 参数配置 -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-blue-600"><i class="fa-solid fa-sliders"></i></span>
                  <span class="font-medium text-base">参数配置</span>
                </div>
                <!-- 温度系数 -->
                <div class="flex items-center mb-6">
                  <span class="text-sm text-gray-700 w-28 flex-shrink-0">温度系数</span>
                  <div class="flex-1 flex items-center">
                    <span class="text-xs text-gray-400 w-6 text-right">0.01</span>
                    <input
                      type="range"
                      min="0.01"
                      max="1"
                      step="0.01"
                      v-model.number="temperatureVal"
                      class="mx-2 flex-1 accent-blue-600"
                    />
                    <span class="text-xs text-gray-400 w-10 text-left">1.00</span>
                  </div>
                  <input
                    type="number"
                    min="0.01"
                    max="1"
                    step="0.01"
                    v-model.number="temperatureVal"
                    class="ml-4 w-16 h-8 border border-gray-200 rounded text-center text-sm focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <!-- 最大回复长度 -->
                <div class="flex items-center mb-6">
                  <span class="text-sm text-gray-700 w-28 flex-shrink-0">最大回复长度</span>
                  <div class="flex-1 flex items-center">
                    <span class="text-xs text-gray-400 w-6 text-right">1</span>
                    <input
                      type="range"
                      min="1"
                      max="2048"
                      v-model.number="maxTokensVal"
                      class="mx-2 flex-1 accent-blue-600"
                    />
                    <span class="text-xs text-gray-400 w-10 text-left">2048</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="2048"
                    v-model.number="maxTokensVal"
                    class="ml-4 w-16 h-8 border border-gray-200 rounded text-center text-sm focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <!-- 携带上下文轮数 -->
                <div class="flex items-center mb-2">
                  <span class="text-sm text-gray-700 w-28 flex-shrink-0">携带上下文轮数</span>
                  <div class="flex-1 flex items-center">
                    <span class="text-xs text-gray-400 w-6 text-right">1</span>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      v-model.number="contextRoundsVal"
                      class="mx-2 flex-1 accent-blue-600"
                    />
                    <span class="text-xs text-gray-400 w-10 text-left">30</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    v-model.number="contextRoundsVal"
                    class="ml-4 w-16 h-8 border border-gray-200 rounded text-center text-sm focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <main class="py-6">
        <section class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="fa-solid fa-arrow-right text-blue-600"></i>
            <h2 class="text-lg font-medium">指令</h2>
          </div>

          <div class="bg-white rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span>提示词</span>
                <tippy content="输入prompt后，才可使用prompt优化">
                  <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                </tippy>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="relative flex items-center justify-center w-8 h-8 hover:bg-blue-100 rounded-md transition-colors duration-200"
                  @click="handleOptimize"
                  :disabled="isOptimizing"
                >
                  <img
                    v-if="!isOptimizing"
                    src="@/img/agent/优化-copy.png"
                    alt="优化"
                    class="w-4 h-4"
                  />
                  <div
                    v-else
                    class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </button>
              </div>
            </div>
            <textarea
              ref="promptTextarea"
              v-model="promptText"
              class="w-full h-40 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="在这里编写系统提示词，包括角色设定、任务目标、具备的能力及回答的要求等，好的提示词可以帮助 AI 更好地理解和执行任务"
              :maxlength="maxPromptLength"
            ></textarea>
            <div class="flex justify-end mt-2">
              <span class="text-sm text-gray-400">{{ promptLength }}/{{ maxPromptLength }}</span>
            </div>

            <!-- 错误提示 -->
            <div v-if="optimizeError" class="mt-2 text-red-500 text-sm">
              {{ optimizeError }}
            </div>
          </div>
        </section>

        <!-- 视觉 -->
        <section class="mb-8">
          <div class="space-y-4">
            <div class="flex items-center justify-between bg-white pl-4 pb-4 pr-4 rounded-lg">
              <div class="flex items-center gap-2">
                <span>视觉</span>
                <tippy content="开启则允许用户上传图像，并基于视觉理解能力回答用户问题">
                  <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                </tippy>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="visionChecked" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- 知识库 -->
            <div class="flex items-center justify-between bg-white p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <span>知识库</span>
                <tippy content="开启后，智能体可访问外部知识库，检索相关信息以增强回答的准确性和专业性">
                  <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                </tippy>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="showKnowledgeBase" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- 知识库面板 -->
            <transition name="fade">
              <div v-if="showKnowledgeBase" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">知识库配置</h3>
                  <button @click="addKnowledgeBase" class="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fa-solid fa-plus"></i>
                    <span>添加知识库</span>
                  </button>
                </div>
                <div class="p-4">
                  <div v-for="(kb, index) in knowledgeBases" :key="kb.id" class="mb-4 last:mb-0">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-900">{{ kb.name }}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">权重: {{ kb.weight }}</span>
                        <button @click="editKnowledgeBase(index)" class="text-gray-400 hover:text-gray-600">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button @click="deleteKnowledgeBase(index)" class="text-red-400 hover:text-red-600">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div v-if="kb.isEditing" class="flex items-center gap-2 mb-2">
                      <select v-if="knowledgeList.length" v-model="kb.name" class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                        <option v-for="item in knowledgeList" :key="item.title" :value="item.title">
                          {{ item.title }}
                        </option>
                      </select>
                      <input v-else v-model="kb.name" type="text" class="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="请输入知识库名称" />
                      <input v-model.number="kb.weight" type="number" min="1" max="10" class="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                      <button @click="saveKnowledgeBase(index)" class="text-green-600 hover:text-green-800 text-sm">
                        <i class="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 动态文件解析 -->
            <div class="flex items-center justify-between bg-white p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <span>动态文件解析</span>
                <tippy content="开启后，智能体可解析用户上传的文档、表格等文件，提取关键信息并进行分析处理">
                  <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                </tippy>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="fileChecked" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- 联网搜索 -->
            <div class="flex items-center justify-between bg-white p-4 rounded-lg">
              <div class="flex items-center gap-2">
                <span>联网搜索</span>
                <tippy content="开启后，智能体可实时联网搜索最新信息，获取时效性强的数据以提供更全面的回答">
                  <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                </tippy>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="internetChecked" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        <!-- 技能 -->
        <section class="mb-8">
          <div class="flex items-center gap-2 mb-4">
            <i class="fa-solid fa-wrench text-blue-600"></i>
            <h2 class="text-lg font-medium">技能</h2>
          </div>
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span>MCP 服务</span>
                  <tippy content="智能体可以通过标准化协议（MCP）连接企业内部服务API并发起调用">
                    <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                  </tippy>
                </div>
                <button class="text-gray-600">
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span>插件</span>
                  <tippy content="智能体可以通过插件主动调用OpenAPI，例如信息查询、数据存储等">
                    <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
                  </tippy>
                </div>
                <button class="text-gray-600">
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 记忆 -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <i class="fa-solid fa-database text-blue-600"></i>
            <h2 class="text-lg font-medium">记忆</h2>
          </div>
          <div class="flex items-center justify-between bg-white p-4 rounded-lg">
            <div class="flex items-center gap-2">
              <span>长期记忆</span>
              <tippy content="长期记忆可以提取对话的关键信息并保存至对应的数据库中">
                <i class="fas fa-question-circle text-gray-400 cursor-help"></i>
              </tippy>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="memoryChecked" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </section>
      </main>
    </div>

    <!-- 遮罩层：点击浮窗外关闭浮窗 -->
    <div v-if="showApiConfig" class="fixed inset-0 z-40" @click="showApiConfig = false"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ModelSelectDialog from './ModelSelectDialog.vue'
import { optimizePromptWordsService } from '@/api/agent'
import { selectAllKBS } from '@/api/KBS'

/* -------------------- 1. 后端要求的唯一数据源 -------------------- */
const agentForm = reactive({
  agent_name: '',
  agent_state: '1',
  llm_api: '暂未选择模型',
  llm_prompt: '',
  llm_image: 'n',
  llm_knowledge: '',
  llm_file: 'n',
  llm_internet: 'n',
  llm_memory: 'n',
  llm_maximum_length_of_reply: 1024,
  llm_carry_number_of_rounds_of_context: 3,
  llm_temperature_coefficient: 0.8
})

/* -------------------- 2. 页面控件原始 ref -------------------- */
const showApiConfig = ref(false)
const showModelDialog = ref(false)
const apiConfigCard = ref<HTMLElement | null>(null)
const popupStyle = ref({ width: '700px' })
const selectedModel = ref<any>(null)
const promptText = ref('')
const maxPromptLength = 6000
const promptLength = computed(() => promptText.value.length)
const isOptimizing = ref(false)
const optimizeError = ref('')

const showKnowledgeBase = ref(false)
const knowledgeBases = ref<Array<{ id: number; name: string; weight: number; isEditing: boolean }>>([])

const knowledgeList = ref<Array<{ title: string; description: string; certified: boolean; count: number; updateTime: string }>>([])

/* -------------------- 3. 计算属性：滑块 & 开关 -------------------- */
const temperatureVal = computed<number>({ get: () => agentForm.llm_temperature_coefficient, set: v => agentForm.llm_temperature_coefficient = v })
const maxTokensVal = computed<number>({ get: () => agentForm.llm_maximum_length_of_reply, set: v => agentForm.llm_maximum_length_of_reply = v })
const contextRoundsVal = computed<number>({ get: () => agentForm.llm_carry_number_of_rounds_of_context, set: v => agentForm.llm_carry_number_of_rounds_of_context = v })

const visionChecked = computed<boolean>({ get: () => agentForm.llm_image === 'y', set: v => agentForm.llm_image = v ? 'y' : 'n' })
const fileChecked = computed<boolean>({ get: () => agentForm.llm_file === 'y', set: v => agentForm.llm_file = v ? 'y' : 'n' })
const internetChecked = computed<boolean>({ get: () => agentForm.llm_internet === 'y', set: v => agentForm.llm_internet = v ? 'y' : 'n' })
const memoryChecked = computed<boolean>({ get: () => agentForm.llm_memory === 'y', set: v => agentForm.llm_memory = v ? 'y' : 'n' })

/* -------------------- 4. watch：提示词 & 模型 & 知识库 -------------------- */
watch(promptText, v => agentForm.llm_prompt = v)
watch(selectedModel, m => agentForm.llm_api = m?.model_name || '')
watch(
  knowledgeBases,
  () => {
    agentForm.llm_knowledge = knowledgeBases.value
      .filter(kb => !kb.isEditing && kb.name?.trim())
      .map(kb => kb.name.trim())
      .join(',')
  },
  { deep: true, immediate: true }
)

/* -------------------- 5. 方法 -------------------- */
function handleModelSelect(item: any) {
  selectedModel.value = item
}
function updatePopupWidth() {
  nextTick(() => {
    if (apiConfigCard.value) {
      const rect = apiConfigCard.value.getBoundingClientRect()
    }
  })
}
async function handleOptimize() {
  if (!promptText.value.trim()) {
    console.warn('提示词为空，无法优化')
    return
  }
  isOptimizing.value = true
  optimizeError.value = ''
  const current = promptText.value
  promptText.value = '正在优化提示词，请稍候...'
  try {
    const res = await optimizePromptWordsService({ prompt: current })
    let txt = ''
    if (typeof res === 'string') txt = res
    else if (res?.data?.content) txt = res.data.content
    else if (res?.content) txt = res.content
    if (txt) promptText.value = txt
  } catch (e) {
    optimizeError.value = '优化失败，请稍后重试'
    promptText.value = current
  } finally {
    isOptimizing.value = false
  }
}

/* 知识库增删改 */
function addKnowledgeBase() {
  const newId = knowledgeBases.value.length ? Math.max(...knowledgeBases.value.map(k => k.id)) + 1 : 1
  const defaultName = knowledgeList.value.length ? knowledgeList.value[0].title : '知识库'
  knowledgeBases.value.push({ id: newId, name: defaultName, weight: 1, isEditing: true })
}
function editKnowledgeBase(index: number) {
  knowledgeBases.value[index].isEditing = true
}
function saveKnowledgeBase(index: number) {
  knowledgeBases.value[index].isEditing = false
}
function deleteKnowledgeBase(index: number) {
  knowledgeBases.value.splice(index, 1)
}

/* 获取知识库列表 */
const getFileCount = (fileList: string): number => {
  if (!fileList || typeof fileList !== 'string') return 0
  try {
    const arr = JSON.parse(fileList)
    return Array.isArray(arr) ? arr.length : 0
  } catch {
    return 0
  }
}
onMounted(async () => {
  window.addEventListener('resize', updatePopupWidth)
  const res = await selectAllKBS()
  knowledgeList.value = (res.data || []).map((item: any) => ({
    title: item.kon_name || '',
    description: item.kon_describe || '',
    certified: true,
    count: getFileCount(item.file_list),
    updateTime: item.update_time || ''
  }))
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePopupWidth)
})

const emit = defineEmits(['update:agentForm'])
watch(
  agentForm,
  () => emit('update:agentForm', { ...agentForm }),
  { deep: true }
)

/* -------------------- 6. 向父组件暴露 agentForm -------------------- */
defineExpose({ agentForm })
</script>

<style scoped>
.min-h-screen {
  min-height: 1024px;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}
.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>