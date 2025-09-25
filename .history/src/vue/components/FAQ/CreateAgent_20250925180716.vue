<template>
  <div class="px-4 py-4">
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between mb-4">
        
        <!--  -->
        <div class="flex items-center gap-6">
          <div class="flex items-center text-sm text-gray-600">
            <button @click="$emit('back-to-list')" class="p-2 text-gray-500 hover:bg-gray-50 rounded-button mr-2">
              <img :src="agentIcon" alt="返回" class="w-5 h-5" />
            </button>
            <span class="text-gray-900 font-medium text-xl" v-if="!isEditing">
              {{ agentName }}
            </span>
            <input 
              v-else 
              v-model="tempName"
              type="text"
              class="border border-gray-300 rounded px-2 py-0.5 text-gray-900 font-medium text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              @blur="saveName"
              @keyup.enter="saveName"
              @keyup.escape="cancelEdit"
            />
            <button 
              @click="startEdit"
              class="ml-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="修改名称"
            >
              <i class="fas fa-edit"></i>
            </button>
            <span class="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">草稿</span>
          </div>
          <div class="text-xs text-gray-400">
            已于{{ lastSavedTime }}自动保存
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2 text-gray-500 hover:bg-gray-50 rounded-button">
            <i class="fas fa-expand"></i>
          </button>
          <button class="flex items-center px-3 py-1 border border-gray-200 rounded-button hover:bg-gray-50 whitespace-nowrap">
            <i class="fas fa-code-branch mr-1.5"></i>
            <span>版本管理</span>
          </button>
          <button 
            class="flex items-center px-4 py-1 bg-blue-600 text-white rounded-button hover:bg-blue-700 whitespace-nowrap"
            @click="publishAgent"
          >
            <i class="fas fa-paper-plane mr-1.5"></i>
            <span>发布</span>
          </button>
        </div>
      </div>
      <div class="border-t border-gray-200 my-4"></div>

      <!--  -->
      <div 
        class="middle flex" 
        :style="{ height: 'calc(100vh - 200px)' }"
      >
        <!-- 左侧面板 -->
        <div
          ref="leftPanel"
          class="left-panel min-w-[500px] h-full overflow-y-auto scroll-hide"
        >
          <!-- 左侧内容放这里 -->
          <AgentConfigLeftPanel
            :agent-id="props.agentId"
            @update:agentForm="onFormChange"
          />
        </div>

        <!-- 可拖动分割线 -->
        <div
          ref="splitter"
          class="
            w-px                 /* 仅 1px 宽 */
            bg-gray-200          /* 默认灰色 */
            hover:bg-blue-500    /* 悬停变蓝 */
            cursor-col-resize    /* 左右拖拽光标 */
            select-none
          "
          @mousedown="startDrag"
        />

        <!-- 右侧面板 -->
        <div
          ref="rightPanel"
          class="right-panel flex-1 bg-white min-w-[600px]"
        >
          <!-- 右侧内容放这里 -->
          <AgentConfigRightPanel 
            :agent-data="agentData" 
            :agent-id="props.agentId" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import agentIcon from '@/img/agent/返回.png'
import AgentConfigLeftPanel from '@/vue/components/FAQ/AgentConfigLeftPanel.vue'
import AgentConfigRightPanel from '@/vue/components/FAQ/AgentConfigRightPanel.vue'

const agentData = reactive({}) // 用于存储从服务器获取的agent数据

// 添加保存时间变量
const lastSavedTime = ref('12:10:7')

// 格式化当前时间的函数
function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function onFormChange(data) {
  saveAgent(data)
  // 将数据传递给子组件
  Object.assign(agentData, data)
}

async function saveAgent(form) {
  const url = `http://localhost:5000/updateAgentById/${props.agentId}`
  const payload = { ...form, agent_name: agentName.value }
  try {
    const response = await axios.put(url, payload)

    // 保存成功后更新时间显示
    lastSavedTime.value = getCurrentTime()
  } catch (e) {
    console.error('保存失败', e)
    if (e.response) {
      console.error('服务器响应错误:', e.response.status, e.response.data)
    } else if (e.request) {
      console.error('网络请求失败:', e.request)
    } else {
      console.error('请求配置错误:', e.message)
    }
  }
}

// 添加发布函数
async function publishAgent() {
  try {
    const url = `http://localhost:5000/updateAgentById/${props.agentId}`
    const payload = {
      agent_state: 'active'
    }
    
    const response = await axios.put(url, payload)
    
    // 发布成功后返回列表界面
    emit('back-to-list')
  } catch (e) {
    console.error('发布失败', e)
    if (e.response) {
      console.error('服务器响应错误:', e.response.status, e.response.data)
    } else if (e.request) {
      console.error('网络请求失败:', e.request)
    } else {
      console.error('请求配置错误:', e.message)
    }
  }
}

const props = defineProps({
  agentId: { type: [Number, String], default: null }
})
const emit = defineEmits(['back-to-list'])

const agentName = ref('智能体应用')
const tempName  = ref('')
const isEditing = ref(false)

const startEdit = () => {
  tempName.value = agentName.value
  isEditing.value = true
}
const saveName = () => {
  if (tempName.value.trim()) {
    agentName.value = tempName.value
    // 名称变化时调用 onFormChange
    onFormChange({ agent_name: agentName.value })
  }
  isEditing.value = false
}
const cancelEdit = () => { isEditing.value = false }

const leftPanel  = ref()
const rightPanel = ref()
const splitter   = ref()

let dragging = false, startX = 0, leftW = 0

function startDrag (e) {
  dragging = true
  startX   = e.clientX
  leftW    = leftPanel.value.offsetWidth
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup',  endDrag)
}
function onDrag (e) {
  if (!dragging) return
  const delta    = e.clientX - startX
  const newLeftW = Math.max(200, leftW + delta)
  leftPanel.value.style.width  = `${newLeftW}px`
  rightPanel.value.style.width = `calc(100% - ${newLeftW + 4}px)`
}
function endDrag () {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup',  endDrag)
}
</script>

<style>
.splitter:hover {
  width: 2px;
  transition: width 0.1s, background-color 0.1s;
}
.scroll-hide::-webkit-scrollbar {
  display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>