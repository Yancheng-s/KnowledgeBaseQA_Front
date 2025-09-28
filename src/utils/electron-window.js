// Electron窗口管理工具
class ElectronWindowManager {
  constructor() {
    this.windows = new Map(); // 存储窗口实例
    this.isElectron = this.checkElectronEnvironment();
  }

  // 检查是否在Electron环境中
  checkElectronEnvironment() {
    return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
  }

  // 创建新的Electron窗口
  async createFloatingWindow(agentId, agentName = 'AI助手') {
    if (!this.isElectron) {
      console.warn('当前不在Electron环境中，无法创建独立窗口');
      return null;
    }

    try {
      const { ipcRenderer } = window.require('electron');
      
      // 发送创建窗口的请求到主进程
      const windowId = await ipcRenderer.invoke('create-floating-window', {
        agentId,
        agentName,
        width: 400,
        height: 650,
        minWidth: 350,
        minHeight: 500,
        alwaysOnTop: false,
        resizable: true,
        frame: false,
        transparent: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
        }
      });

      if (windowId) {
        this.windows.set(agentId, windowId);
        return windowId;
      }
    } catch (error) {
      console.error('创建Electron窗口失败:', error);
      return null;
    }
  }

  // 关闭指定窗口
  async closeWindow(agentId) {
    if (!this.isElectron) return;

    try {
      const { ipcRenderer } = window.require('electron');
      const windowId = this.windows.get(agentId);
      
      if (windowId) {
        await ipcRenderer.invoke('close-floating-window', windowId);
        this.windows.delete(agentId);
      }
    } catch (error) {
      console.error('关闭Electron窗口失败:', error);
    }
  }

  // 关闭所有窗口
  async closeAllWindows() {
    if (!this.isElectron) return;

    try {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('close-all-floating-windows');
      this.windows.clear();
    } catch (error) {
      console.error('关闭所有Electron窗口失败:', error);
    }
  }

  // 检查窗口是否存在
  hasWindow(agentId) {
    return this.windows.has(agentId);
  }

  // 获取窗口ID
  getWindowId(agentId) {
    return this.windows.get(agentId);
  }
}

// 创建单例实例
const electronWindowManager = new ElectronWindowManager();

export default electronWindowManager;
