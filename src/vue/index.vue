<template>
  <div class="main-bg">
    <div class="container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <nav class="nav">
          <div class="nav-header">
            <div class="nav-title">AI 助手</div>
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
              <i class="fas fa-info-circle"></i>
              <span>当前版本: v 1.0.1</span>
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
import { ref } from 'vue';
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

const goNav = (item: any) => {
  activeNavItem.value = item.id;
  router.push(item.path);
};
</script>

<style scoped>
/* ...原有样式... */
.main-bg {
  min-height: 100vh;
  background: #f5f6fa;
  overflow: hidden;
}
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
}
.sidebar {
  width: 250px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}
.content-area {
  width: 100%;
  background: #fff;
  height: 100vh;
  overflow: hidden;
}
.nav { display: flex; flex-direction: column; height: 100%; }
.nav-header { padding: 24px 16px 0 16px; }
.nav-title { font-size: 22px; font-weight: bold; color: #222; margin-bottom: 16px; }
.nav-list { flex: 1; padding: 8px; display: flex; flex-direction: column; gap: 8px; }
.nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; border: none; background: none; font-size: 15px; border-radius: 8px; cursor: pointer; color: #444; transition: background 0.2s, color 0.2s; }
.nav-btn:hover { background: #f3f4f6; }
.nav-btn-active { background: #e6f0ff; color: #2563eb; }
.icon { color: #bbb; font-size: 18px; }
.icon-active { color: #2563eb; font-size: 18px; }
.nav-footer { border-top: 1px solid #e5e7eb; padding: 16px; }
.nav-version { display: flex; align-items: center; gap: 8px; color: #888; font-size: 14px; }
</style>