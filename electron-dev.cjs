const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动Electron开发环境...');

// 启动Vite开发服务器
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 等待Vite服务器启动
setTimeout(() => {
  console.log('📦 启动Electron应用...');
  
  // 启动Electron
  const electron = spawn('npm', ['run', 'electron'], {
    stdio: 'inherit',
    shell: true
  });

  electron.on('close', (code) => {
    console.log(`Electron进程退出，代码: ${code}`);
    vite.kill();
    process.exit(code);
  });

  electron.on('error', (err) => {
    console.error('启动Electron失败:', err);
    vite.kill();
    process.exit(1);
  });
}, 3000); // 等待3秒让Vite启动

vite.on('error', (err) => {
  console.error('启动Vite失败:', err);
  process.exit(1);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭应用...');
  vite.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 正在关闭应用...');
  vite.kill();
  process.exit(0);
});
