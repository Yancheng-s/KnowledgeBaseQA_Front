<template>
  <div v-if="isVisible" class="floating-chat-container" :class="{ 'fullscreen': isFullscreen, 'pinned': isPinned }" :style="{ left: position.x + 'px', top: position.y + 'px' }">
    <div class="floating-chat-window">
      <!-- 头部 -->
      <div class="floating-chat-header" @mousedown="startDrag">
        <button class="pin-btn" :class="{ 'pinned': isPinned }" @click="bringToFront" :title="isPinned ? '取消置顶' : '置顶窗口'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- 未选中时：斜着的图钉 -->
            <g v-if="!isPinned" class="pin-diagonal">
              <path d="M12 2l-1.5 1.5L12 5l1.5-1.5L12 2z"/>
              <path d="M12 5v13"/>
              <circle cx="12" cy="20" r="2"/>
            </g>
            <!-- 选中时：竖着的图钉 -->
            <g v-else class="pin-vertical">
              <path d="M12 2l-1.5 1.5L12 5l1.5-1.5L12 2z"/>
              <path d="M12 5v13"/>
              <circle cx="12" cy="20" r="2"/>
            </g>
          </svg>
        </button>
        <div class="floating-chat-actions">
          <button class="action-btn" @click="toggleFullscreen" title="全屏">
            <i class="fas fa-expand"></i>
          </button>
          <button class="action-btn" @click="closeFloatingChat" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="floating-chat-content">
        <!-- 空状态 -->
        <div v-if="!hasMessages" class="floating-chat-empty">
          <div class="empty-illustration">
            <div class="hexagon-shape">
              <i class="fas fa-comments illustration-icon"></i>
            </div>
          </div>
          <p class="empty-message">即刻开启AI对话</p>
          
          <!-- 热门问题 -->
          <div class="hot-searches">
            <h4 class="hot-searches-title">热门问题</h4>
            <div class="hot-searches-tags">
              <span 
                v-for="tag in hotSearches" 
                :key="tag" 
                class="hot-tag"
                @click="selectHotTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- 对话列表 -->
        <div v-else class="floating-chat-messages">
          <div 
            v-for="message in messages" 
            :key="message.id" 
            class="floating-message-item"
            :class="{ 'user-message': !message.isAI, 'ai-message': message.isAI }"
          >
            <!-- 用户消息 -->
            <div v-if="!message.isAI" class="floating-user-message">
              <div class="floating-message-bubble user-bubble">
                <div class="floating-message-text" v-html="renderMarkdown(message.content)"></div>
              </div>
            </div>
            
            <!-- AI消息 -->
            <div v-else class="floating-ai-message">
              <div class="floating-message-bubble ai-bubble">
                <!-- 加载动画 -->
                <div v-if="message.isLoading" class="floating-loading-container">
                  <div class="floating-loading-dots">
                    <div class="floating-dot"></div>
                    <div class="floating-dot"></div>
                    <div class="floating-dot"></div>
                  </div>
                  <span class="floating-loading-text">AI 正在思考中...</span>
                </div>
                
                <!-- 正常消息内容 -->
                <div v-else class="floating-message-text" v-html="renderMarkdown(message.content)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="floating-chat-input">
        <div class="input-container">
          <textarea
            v-model="inputText"
            class="floating-textarea"
            placeholder="输入您的问题..."
            rows="2"
            @keydown.enter.exact.prevent="handleSubmit"
            @keydown.shift.enter="handleNewLine"
          ></textarea>
          <button 
            class="floating-send-btn"
            @click="handleSubmit"
            :disabled="!inputText.trim()"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { marked } from 'marked'
import { processAgent } from '@/api/agent'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  agentId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'toggle-fullscreen'])

// 响应式数据
const inputText = ref('')
const messages = ref([])
const searchQuery = ref('')
const isFullscreen = ref(false)
const isPinned = ref(false)

// 置顶功能相关
let forceTopInterval = null

// 拖拽相关状态
const position = ref({ x: 100, y: 100 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 热门问题
const hotSearches = ref([
  '如何使用AI助手？',
  '模型调用方法',
  'API接口说明',
  '智能体配置',
  '工作流设计',
  '知识库管理',
  '应用部署',
  '错误排查'
])

// 计算属性
const hasMessages = computed(() => messages.value.length > 0)

// 方法
const closeFloatingChat = () => {
  emit('close')
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('toggle-fullscreen', isFullscreen.value)
}

const bringToFront = () => {
  isPinned.value = !isPinned.value
  
  if (isPinned.value) {
    enableForceTop()
  } else {
    disableForceTop()
  }
  
  // 短暂闪烁效果提示用户
  const container = document.querySelector('.floating-chat-container')
  if (container) {
    container.style.transform = 'scale(1.02)'
    container.style.transition = 'transform 0.15s ease'
    setTimeout(() => {
      container.style.transform = 'scale(1)'
      setTimeout(() => {
        container.style.transition = ''
      }, 150)
    }, 150)
  }
}

// 置顶功能实现
const enableForceTop = () => {
  // 清除之前的定时器
  if (forceTopInterval) {
    clearInterval(forceTopInterval)
  }
  
  // 立即设置置顶
  setForceTop()
  
  // 每100ms检查一次，确保置顶
  forceTopInterval = setInterval(() => {
    setForceTop()
  }, 100)
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleWindowFocus)
}

const disableForceTop = () => {
  // 清除定时器
  if (forceTopInterval) {
    clearInterval(forceTopInterval)
    forceTopInterval = null
  }
  
  // 移除事件监听
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowFocus)
  
  // 恢复默认z-index
  const container = document.querySelector('.floating-chat-container')
  if (container) {
    container.style.zIndex = '9999'
  }
}

const setForceTop = () => {
  const container = document.querySelector('.floating-chat-container')
  if (container && isPinned.value) {
    // 使用最大z-index值
    container.style.zIndex = '2147483647'
    container.style.position = 'fixed'
    
    // 确保窗口可见
    if (container.style.display === 'none') {
      container.style.display = 'block'
    }
  }
}

const handleVisibilityChange = () => {
  if (!document.hidden && isPinned.value) {
    setForceTop()
  }
}

const handleWindowFocus = () => {
  if (isPinned.value) {
    setForceTop()
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    inputText.value = searchQuery.value
    searchQuery.value = ''
    handleSubmit()
  }
}

const selectHotTag = (tag) => {
  inputText.value = tag
  handleSubmit()
}

const handleSubmit = async () => {
  if (!inputText.value.trim()) return

  const messageContent = inputText.value.trim()
  
  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    content: messageContent,
    isAI: false
  })

  // 清空输入框
  inputText.value = ''

  // 添加加载状态
  const loadingMessageId = Date.now() + 1
  messages.value.push({
    id: loadingMessageId,
    content: '',
    isAI: true,
    isLoading: true
  })

  // 检查是否有agentId
  if (!props.agentId) {
    // 如果没有agentId，使用模拟回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent)
      
      // 找到加载消息并替换为实际回复
      const loadingIndex = messages.value.findIndex(m => m.id === loadingMessageId)
      if (loadingIndex !== -1) {
        messages.value[loadingIndex] = {
          id: loadingMessageId,
          content: aiResponse,
          isAI: true
        }
      }
    }, 1500)
    return
  }

  // 使用真实的API调用
  try {
    const payload = {
      message: messageContent,
    }

    const response = await processAgent(props.agentId, payload)
    
    // 找到加载消息并替换为实际回复
    const loadingIndex = messages.value.findIndex(m => m.id === loadingMessageId)
    if (loadingIndex !== -1) {
      if (response.data && response.data.result) {
        messages.value[loadingIndex] = {
          id: loadingMessageId,
          content: response.data.result,
          isAI: true,
          stats: response.data.stats
        }
      } else {
        messages.value[loadingIndex] = {
          id: loadingMessageId,
          content: '抱歉，AI 回复出现错误',
          isAI: true
        }
      }
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.response?.data || error.message)
    
    // 找到加载消息并替换为错误信息
    const loadingIndex = messages.value.findIndex(m => m.id === loadingMessageId)
    if (loadingIndex !== -1) {
      messages.value[loadingIndex] = {
        id: loadingMessageId,
        content: '抱歉，请求失败，请稍后重试',
        isAI: true
      }
    }
  }
}

const handleNewLine = () => {
  inputText.value += '\n'
}

// 模拟AI回复生成
const generateAIResponse = (query) => {
  const responses = {
    '如何使用AI助手？': 'AI助手可以帮助您解答各种问题。您可以：\n\n1. 直接输入问题\n2. 使用热门问题快速开始\n3. 查看相关文档和API说明\n\n有什么具体问题需要帮助吗？',
    '模型调用方法': '模型调用方法包括：\n\n- **API调用**：使用HTTP请求调用模型\n- **SDK集成**：使用官方SDK进行集成\n- **参数配置**：设置温度、最大长度等参数\n\n需要了解具体的调用示例吗？',
    'API接口说明': 'API接口提供以下功能：\n\n- 文本生成\n- 图像处理\n- 语音识别\n- 数据分析\n\n每个接口都有详细的文档说明和示例代码。',
    '智能体配置': '智能体配置包括：\n\n1. **基础设置**：名称、描述、模型选择\n2. **能力配置**：工具集成、知识库连接\n3. **行为设置**：回复风格、安全策略\n4. **测试部署**：本地测试、生产部署\n\n需要配置哪个方面的智能体？'
  }
  
  return responses[query] || `关于"${query}"的问题，我为您提供以下信息：\n\n这是一个很好的问题！让我为您详细解答...\n\n如果您需要更具体的信息，请告诉我更多细节。`
}

// Markdown 渲染
const renderMarkdown = (content) => {
  if (!content) return ''
  return marked(content)
}

// 拖拽相关方法
const startDrag = (e) => {
  // 只允许通过头部拖拽，排除按钮区域
  if (e.target.closest('.floating-chat-actions') || e.target.closest('.action-btn')) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 监听全屏状态
watch(isFullscreen, (newVal) => {
  const window = document.querySelector('.floating-chat-window')
  if (window) {
    if (newVal) {
      window.classList.add('fullscreen')
    } else {
      window.classList.remove('fullscreen')
    }
  }
})

// 组件销毁时清理
onUnmounted(() => {
  // 清理置顶功能
  disableForceTop()
})
</script>

<style scoped>
.floating-chat-container {
  position: fixed;
  z-index: 9999;
  user-select: none;
}

.floating-chat-container.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 10001 !important;
}

.floating-chat-container.pinned {
  z-index: 99999 !important;
  position: fixed !important;
}

.floating-chat-window {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 370px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.floating-chat-window.fullscreen {
  width: 95vw !important;
  height: 95vh !important;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 10001 !important;
  border-radius: 8px;
  margin: 0 !important;
}

.floating-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: move;
  user-select: none;
}

.pin-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pin-btn:hover {
  background: #f3f4f6;
  color: #374151;
  transform: scale(1.1);
}

.pin-btn:active {
  transform: scale(0.95);
}

.pin-btn.pinned {
  color: #3b82f6;
  background: #eff6ff;
}

.pin-btn.pinned:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.pin-diagonal {
  transform: rotate(-20deg);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.pin-vertical {
  transform: rotate(0deg);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.pin-btn svg {
  transition: all 0.3s ease;
}

.pin-btn:hover svg {
  transform: scale(1.1);
}

.floating-chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.floating-chat-search {
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.floating-chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.floating-chat-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.floating-chat-empty {
  text-align: center;
  padding: 40px 20px;
}

.empty-illustration {
  margin-bottom: 24px;
}

.hexagon-shape {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hexagon-shape::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

.illustration-icon {
  font-size: 48px;
  color: white;
  z-index: 1;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.empty-message {
  font-size: 16px;
  color: #374151;
  margin: 0 0 24px;
  font-weight: 500;
}

.hot-searches {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  text-align: left;
}

.hot-searches-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px;
}

.hot-searches-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-tag:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.floating-chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.floating-message-item {
  display: flex;
  width: 100%;
}

.floating-user-message {
  justify-content: flex-end;
}

.floating-ai-message {
  justify-content: flex-start;
}

.floating-message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-bubble {
  background: #f3f4f6;
  color: #374151;
}

.ai-bubble {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.floating-message-text {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.floating-loading-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.floating-loading-dots {
  display: flex;
  gap: 4px;
}

.floating-dot {
  width: 6px;
  height: 6px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: floating-bounce 1.4s infinite ease-in-out both;
}

.floating-dot:nth-child(1) { animation-delay: -0.32s; }
.floating-dot:nth-child(2) { animation-delay: -0.16s; }
.floating-dot:nth-child(3) { animation-delay: 0s; }

@keyframes floating-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.floating-loading-text {
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
}

.floating-chat-input {
  padding: 16px 24px;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.floating-textarea {
  flex: 1;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  background: white;
  color: #374151;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.floating-textarea::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.floating-textarea:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

.floating-textarea::placeholder {
  color: #9ca3af;
}

.floating-send-btn {
  width: 40px;
  height: 40px;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.floating-send-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.floating-send-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Markdown 样式 */
.floating-message-text :deep(h1),
.floating-message-text :deep(h2),
.floating-message-text :deep(h3),
.floating-message-text :deep(h4),
.floating-message-text :deep(h5),
.floating-message-text :deep(h6) {
  margin: 0.5em 0;
  font-weight: bold;
  line-height: 1.2;
}

.floating-message-text :deep(h1) { font-size: 1.3em; }
.floating-message-text :deep(h2) { font-size: 1.2em; }
.floating-message-text :deep(h3) { font-size: 1.1em; }

.floating-message-text :deep(p) {
  margin: 0.5em 0;
  line-height: 1.5;
}

.floating-message-text :deep(ul),
.floating-message-text :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.floating-message-text :deep(li) {
  margin: 0.25em 0;
}

.floating-message-text :deep(blockquote) {
  margin: 0.5em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #e5e7eb;
  background-color: #f9fafb;
  font-style: italic;
}

.floating-message-text :deep(code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.floating-message-text :deep(pre) {
  background-color: #f3f4f6;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.floating-message-text :deep(pre)::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.floating-message-text :deep(pre code) {
  background: none;
  padding: 0;
}

.floating-message-text :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.floating-message-text :deep(a:hover) {
  color: #1d4ed8;
}

.floating-message-text :deep(strong) {
  font-weight: bold;
}

.floating-message-text :deep(em) {
  font-style: italic;
}
</style>
