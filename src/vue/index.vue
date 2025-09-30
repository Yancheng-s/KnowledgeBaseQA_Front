<template>
  <div class="main-bg">
    <div class="container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <nav class="nav">
          <div class="nav-header">
            <div class="nav-brand">
              <div class="brand-icon">
                <div class="logo-container">
                  <div class="logo-core">
                    <div class="logo-inner">
                      <i class="fas fa-brain"></i>
                    </div>
                    <div class="logo-ring"></div>
                    <div class="logo-particles">
                      <div class="particle"></div>
                      <div class="particle"></div>
                      <div class="particle"></div>
                      <div class="particle"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="brand-content">
                <div class="nav-title">
                  <span class="title-text">智库</span>
                  <div class="title-glow"></div>
                </div>
                <div class="nav-subtitle">
                  <span class="subtitle-text">智能知识问答管理</span>
                </div>
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
  console.log('🎯 主页面组件已挂载');
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  background-size: 400% 400%;
  animation: backgroundShift 20s ease-in-out infinite;
  overflow: hidden;
  position: relative;
}

.main-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(29, 78, 216, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.2) 0%, transparent 50%);
  animation: backgroundParticles 15s ease-in-out infinite;
  pointer-events: none;
}

.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

.sidebar {
  width: 240px;
  min-width: 240px;
  background: #F8F8F8;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
}

.content-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 5;
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

.nav-brand:hover .logo-inner {
  animation: logoHover 0.8s ease-in-out;
  box-shadow: 
    0 12px 40px rgba(59, 130, 246, 0.6),
    0 0 0 2px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.nav-brand:hover .logo-ring {
  animation: logoRotate 2s linear infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.nav-brand:hover .particle {
  animation: particleFloat 2s ease-in-out infinite;
  transform: scale(1.5);
}

.nav-brand:hover .title-text {
  animation: gradientShift 1s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.8));
}


@keyframes logoHover {
  0% { 
    transform: translateY(0px) rotate(0deg) scale(1.1);
  }
  25% { 
    transform: translateY(-8px) rotate(-8deg) scale(1.2);
  }
  50% { 
    transform: translateY(-12px) rotate(8deg) scale(1.25);
  }
  75% { 
    transform: translateY(-8px) rotate(-4deg) scale(1.2);
  }
  100% { 
    transform: translateY(0px) rotate(0deg) scale(1.1);
  }
}

.brand-icon {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-core {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 25%, #2563eb 50%, #1e40af 75%, #1e3a8a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  position: relative;
  z-index: 3;
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: logoFloat 4s ease-in-out infinite;
  overflow: hidden;
}

.logo-inner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: logoShine 3s linear infinite;
}

.logo-inner i {
  position: relative;
  z-index: 2;
  animation: logoPulse 2.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

.logo-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid transparent;
  border-radius: 18px;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8, #2563eb, #1e40af, #1e3a8a) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: exclude;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: logoRotate 8s linear infinite;
  z-index: 1;
}

.logo-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #3b82f6, transparent);
  border-radius: 50%;
  animation: particleFloat 6s ease-in-out infinite;
}

.particle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
  animation-duration: 4s;
}

.particle:nth-child(2) {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
  animation-duration: 5s;
}

.particle:nth-child(3) {
  bottom: 15%;
  left: 15%;
  animation-delay: 2s;
  animation-duration: 4.5s;
}

.particle:nth-child(4) {
  bottom: 20%;
  right: 20%;
  animation-delay: 3s;
  animation-duration: 5.5s;
}

@keyframes logoFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% { 
    transform: translateY(-4px) rotate(-2deg) scale(1.05);
  }
  50% { 
    transform: translateY(-6px) rotate(2deg) scale(1.1);
  }
  75% { 
    transform: translateY(-4px) rotate(-1deg) scale(1.05);
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
    transform: scale(1.15);
  }
}

@keyframes logoRotate {
  0% { 
    transform: rotate(0deg);
  }
  100% { 
    transform: rotate(360deg);
  }
}

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.8;
  }
  25% { 
    transform: translateY(-8px) translateX(4px) scale(1.2);
    opacity: 1;
  }
  50% { 
    transform: translateY(-12px) translateX(-2px) scale(0.8);
    opacity: 0.6;
  }
  75% { 
    transform: translateY(-6px) translateX(6px) scale(1.1);
    opacity: 0.9;
  }
}

@keyframes gradientShift {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}


@keyframes backgroundShift {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}

@keyframes backgroundParticles {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-40px) rotate(180deg);
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-20px) rotate(270deg);
    opacity: 0.7;
  }
}

.brand-content {
  flex: 1;
}

.nav-title {
  position: relative;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -0.8px;
  text-transform: uppercase;
}

.title-text {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 25%, #2563eb 50%, #1e40af 75%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradientShift 4s ease-in-out infinite;
  position: relative;
  z-index: 2;
  display: inline-block;
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
}

.title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 25%, #2563eb 50%, #1e40af 75%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradientShift 4s ease-in-out infinite;
  filter: blur(8px);
  opacity: 0.6;
  z-index: 1;
}

.nav-subtitle {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.subtitle-text {
  color: #64748b;
  font-weight: 500;
  position: relative;
  display: inline-block;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.status-dot.online {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 
    0 0 0 2px rgba(16, 185, 129, 0.3),
    0 0 10px rgba(16, 185, 129, 0.4);
  animation: statusPulse 2s ease-in-out infinite;
}

.status-dot.offline {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 
    0 0 0 2px rgba(239, 68, 68, 0.3),
    0 0 10px rgba(239, 68, 68, 0.4);
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
  animation: innerPulse 1.5s infinite;
}

@keyframes statusPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 0 2px rgba(16, 185, 129, 0.3),
      0 0 10px rgba(16, 185, 129, 0.4);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 
      0 0 0 4px rgba(16, 185, 129, 0.2),
      0 0 20px rgba(16, 185, 129, 0.6);
  }
}

@keyframes innerPulse {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
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
  padding: 14px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  color: #334155;
  transform: translateX(4px) scale(1.02);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.nav-btn:hover::before {
  left: 100%;
}

.nav-btn-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%);
  color: #3b82f6;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.nav-btn-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
}

.icon {
  color: #94a3b8;
  font-size: 16px;
  width: 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.icon-active {
  color: #3b82f6;
  font-size: 16px;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.1);
  }
}

.nav-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 16px;
  background: #F8F8F8;
  backdrop-filter: blur(10px);
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
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.status-indicator:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>