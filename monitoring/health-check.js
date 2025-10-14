// 健康检查脚本
const http = require('http');
const https = require('https');

const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:3000/health';
const TIMEOUT = 5000; // 5秒超时

function checkHealth() {
  return new Promise((resolve, reject) => {
    const client = HEALTH_CHECK_URL.startsWith('https') ? https : http;
    
    const req = client.get(HEALTH_CHECK_URL, { timeout: TIMEOUT }, (res) => {
      if (res.statusCode === 200) {
        resolve('healthy');
      } else {
        reject(new Error(`Health check failed with status: ${res.statusCode}`));
      }
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Health check timeout'));
    });
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  checkHealth()
    .then(() => {
      console.log('✅ 健康检查通过');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ 健康检查失败:', err.message);
      process.exit(1);
    });
}

module.exports = { checkHealth };
