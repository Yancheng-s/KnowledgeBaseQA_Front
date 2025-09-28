const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 开发环境URL
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const devUrl = 'http://localhost:5174';

// 存储浮动窗口的Map
const floatingWindows = new Map();

// 创建主窗口
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    show: false,
    autoHideMenuBar: true  // 隐藏菜单栏
  });

  // 加载应用
  if (isDev) {
    mainWindow.loadURL(devUrl);
    // 不自动打开开发者工具
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ 主窗口已显示');
  });

  return mainWindow;
}

// 创建浮动窗口
function createFloatingWindow(options) {
  const { agentId, agentName, width = 500, height = 900, minWidth = 400, minHeight = 600 } = options;
  
  console.log(`🪟 创建浮动窗口: ${agentName} (${agentId})`);
  
  // 检查是否已存在该agent的窗口
  if (floatingWindows.has(agentId)) {
    const existingWindow = floatingWindows.get(agentId);
    if (!existingWindow.isDestroyed()) {
      existingWindow.focus();
      return existingWindow.id;
    } else {
      floatingWindows.delete(agentId);
    }
  }

  // 创建新窗口
  const floatingWindow = new BrowserWindow({
    width: width + 20,  // 增加边框宽度
    height: height + 250, // 增加边框高度
    minWidth: minWidth + 20,
    minHeight: minHeight + 250,
    alwaysOnTop: true,
    resizable: true,
    frame: false,
    transparent: true,
    show: false,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    title: agentName || 'AI助手',
    skipTaskbar: false,
    minimizable: true,
    maximizable: false,
    closable: true
  });

  // 设置拖拽区域
  floatingWindow.setMovable(true);

  // 加载浮动聊天页面
  const floatingChatPath = path.join(__dirname, 'src', 'electron-floating-chat.html');
  floatingWindow.loadFile(floatingChatPath, {
    query: {
      agentId: agentId,
      agentName: agentName || 'AI助手'
    }
  });

  // 窗口准备好后显示
  floatingWindow.once('ready-to-show', () => {
    floatingWindow.show();
    floatingWindow.focus();
    console.log(`✅ 浮动窗口已显示: ${agentName}`);
  });

  // 窗口关闭时清理
  floatingWindow.on('closed', () => {
    floatingWindows.delete(agentId);
    console.log(`🗑️ 浮动窗口已关闭: ${agentName}`);
  });

  // 存储窗口引用
  floatingWindows.set(agentId, floatingWindow);
  
  return floatingWindow.id;
}

// 关闭指定窗口
function closeFloatingWindow(windowId) {
  for (const [agentId, window] of floatingWindows.entries()) {
    if (window.id === windowId && !window.isDestroyed()) {
      window.close();
      floatingWindows.delete(agentId);
      return true;
    }
  }
  return false;
}

// 关闭所有浮动窗口
function closeAllFloatingWindows() {
  for (const [agentId, window] of floatingWindows.entries()) {
    if (!window.isDestroyed()) {
      window.close();
    }
  }
  floatingWindows.clear();
}

// IPC事件处理
ipcMain.handle('create-floating-window', async (event, options) => {
  try {
    console.log('📨 收到创建浮动窗口请求:', options);
    const windowId = createFloatingWindow(options);
    return windowId;
  } catch (error) {
    console.error('❌ 创建浮动窗口失败:', error);
    return null;
  }
});

ipcMain.handle('close-floating-window', async (event, windowId) => {
  try {
    console.log('📨 收到关闭浮动窗口请求:', windowId);
    return closeFloatingWindow(windowId);
  } catch (error) {
    console.error('❌ 关闭浮动窗口失败:', error);
    return false;
  }
});

ipcMain.handle('close-all-floating-windows', async (event) => {
  try {
    console.log('📨 收到关闭所有浮动窗口请求');
    closeAllFloatingWindows();
    return true;
  } catch (error) {
    console.error('❌ 关闭所有浮动窗口失败:', error);
    return false;
  }
});

// 处理关闭当前窗口
ipcMain.on('close-current-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

// 处理置顶事件
ipcMain.on('set-always-on-top', (event, alwaysOnTop) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.setAlwaysOnTop(alwaysOnTop);
  }
});

// 处理全屏事件
ipcMain.on('toggle-fullscreen', (event, isFullscreen) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    console.log(`收到全屏请求: ${isFullscreen}`);
    try {
      if (isFullscreen) {
        // 全屏时确保窗口位置正确
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;
        
        // 设置窗口大小和位置，留出边距
        const marginX = Math.floor(width * 0.025); // 2.5%边距
        const marginY = Math.floor(height * 0.025); // 2.5%边距
        const windowWidth = width - (marginX * 2);
        const windowHeight = height - (marginY * 2);
        
        window.setBounds({
          x: marginX,
          y: marginY,
          width: windowWidth,
          height: windowHeight
        });
        
        // 然后设置全屏
        window.setFullScreen(true);
        console.log(`已设置全屏模式: ${isFullscreen}, 位置: ${marginX},${marginY}, 大小: ${windowWidth}x${windowHeight}`);
      } else {
        // 退出全屏时恢复原始大小
        window.setFullScreen(false);
        window.setBounds({
          x: 100,
          y: 100,
          width: 420,  // 400 + 20边框
          height: 870  // 850 + 20边框
        });
        console.log(`已退出全屏模式`);
      }
      
      // 通知渲染进程全屏状态变化
      setTimeout(() => {
        event.sender.send('fullscreen-changed', isFullscreen);
      }, 100);
    } catch (error) {
      console.error('全屏操作失败:', error);
      // 即使Electron全屏失败，CSS全屏仍然会工作
    }
  }
});

// 应用准备就绪
app.whenReady().then(() => {
  console.log('🚀 Electron应用已准备就绪');
  createMainWindow();
});

// 所有窗口关闭时退出应用（除了macOS）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS上应用激活时创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// 错误处理
app.on('render-process-gone', (event, webContents, details) => {
  console.error('❌ 渲染进程崩溃:', details);
});

app.on('child-process-gone', (event, details) => {
  console.error('❌ 子进程崩溃:', details);
});

console.log('📝 Electron主进程已加载');
