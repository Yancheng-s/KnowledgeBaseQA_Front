const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🚀 启动Electron开发环境...');

// 启动Vite开发服务器
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 检查Vite服务器是否就绪
function checkViteServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5174', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Vite服务器已就绪');
        resolve();
      } else {
        reject(new Error(`服务器响应状态码: ${res.statusCode}`));
      }
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('连接超时'));
    });
  });
}

// 等待Vite服务器启动
async function waitForViteAndStartElectron() {
  let attempts = 0;
  const maxAttempts = 30; // 最多尝试30次，每次间隔1秒
  
  while (attempts < maxAttempts) {
    try {
      await checkViteServer();
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
      
      return; // 成功启动，退出函数
    } catch (error) {
      attempts++;
      console.log(`⏳ 等待Vite服务器启动... (${attempts}/${maxAttempts})`);
      if (attempts >= maxAttempts) {
        console.error('❌ Vite服务器启动超时，请检查服务器状态');
        vite.kill();
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
    }
  }
}

// 开始等待并启动
waitForViteAndStartElectron();

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
