<template>
  <div class="main-bg">
    <div class="container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <nav class="nav">
          <div class="nav-header">
            <div class="nav-brand">
              <div class="brand-icon">
                <i class="fas fa-brain"></i>
              </div>
              <div class="brand-content">
                <div class="nav-title">智库</div>
                <div class="nav-subtitle">智能知识问答管理</div>
              </div>
            </div>
          </div>
          <div class="nav-list">
            <button 
              v-for="item in navItems" 
              :key="item.id"
              :class="['nav-btn', activeNavItem === item.id ? 'nav-btn-active' : '']"
              @click="goNav(item)"
            >
              <i :class="['fas', item.icon, activeNavItem === item.id ? 'icon-active' : 'icon']"></i>
              <span>{{ item.name }}</span>
            </button>
          </div>
          <div class="nav-footer">
            <div class="nav-version">
              <div class="version-info">
                <i class="fas fa-info-circle"></i>
                <span>v 1.0.1</span>
              </div>
              <div class="status-indicator">
                <div :class="['status-dot', isOnline ? 'online' : 'offline']"></div>
                <span class="status-text">{{ isOnline ? '在线' : '离线' }}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <!-- 右侧内容区 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navItems = [
  { id: 'chat', name: '智能问答', icon: 'fa-comments', path: '/chat' },
  { id: 'knowledge', name: '知识库构建', icon: 'fa-database', path: '/knowledge' },
  { id: 'upload', name: '文档管理', icon: 'fa-cloud-upload-alt', path: '/upload' },
  { id: 'models', name: '模型广场', icon: 'fa-robot', path: '/models' },
  // { id: 'tools', name: '工具选择', icon: 'fa-tools', path: '/tools' }
];

const activeNavItem = ref(navItems.find(item => route.path.includes(item.path))?.id || 'chat');
const isOnline = ref(true);

const goNav = (item: any) => {
  activeNavItem.value = item.id;
  router.push(item.path);
};

// 网络状态检测
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

.sidebar {
  width: 220px;
  min-width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
}

.content-area {
  flex: 1;
  background: #ffffff;
  height: 100vh;
  overflow: hidden;
}

.nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-header {
  padding: 24px 16px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-brand:hover .brand-icon {
  animation: logoHover 0.6s ease-in-out;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.nav-brand:hover .nav-title {
  transform: translateX(2px);
}

@keyframes logoHover {
  0% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% { 
    transform: translateY(-5px) rotate(-5deg) scale(1.1);
  }
  50% { 
    transform: translateY(-8px) rotate(5deg) scale(1.15);
  }
  75% { 
    transform: translateY(-5px) rotate(-2deg) scale(1.1);
  }
  100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  animation: logoFloat 3s ease-in-out infinite;
}

.brand-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: logoShine 2s linear infinite;
}

.brand-icon i {
  position: relative;
  z-index: 1;
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  50% { 
    transform: translateY(-3px) rotate(2deg);
  }
}

@keyframes logoShine {
  0% { 
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% { 
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes logoPulse {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.1);
  }
}

.brand-content {
  flex: 1;
}

.nav-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-subtitle {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-dot.offline {
  background: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.status-dot.online::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

.nav-list {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
}

.nav-btn:hover {
  background: #f8fafc;
  color: #334155;
  transform: translateX(2px);
}

.nav-btn-active {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.nav-btn-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #1d4ed8;
  border-radius: 0 2px 2px 0;
}

.icon {
  color: #94a3b8;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.icon-active {
  color: #1d4ed8;
  font-size: 16px;
}

.nav-footer {
  border-top: 1px solid #f1f5f9;
  padding: 16px;
  background: #fafbfc;
}

.nav-version {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
</style>