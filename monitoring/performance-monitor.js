// 性能监控脚本
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTime: [],
      memoryUsage: [],
      cpuUsage: [],
      errorCount: 0,
      requestCount: 0
    };
    
    this.startTime = Date.now();
  }

  // 记录响应时间
  recordResponseTime(time) {
    this.metrics.responseTime.push(time);
    this.metrics.requestCount++;
  }

  // 记录内存使用
  recordMemoryUsage() {
    const usage = process.memoryUsage();
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external
    });
  }

  // 记录错误
  recordError(error) {
    this.metrics.errorCount++;
    console.error('性能监控 - 错误:', error);
  }

  // 获取性能统计
  getStats() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.responseTime.length > 0 
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length 
      : 0;

    return {
      uptime,
      requestCount: this.metrics.requestCount,
      errorCount: this.metrics.errorCount,
      avgResponseTime: Math.round(avgResponseTime),
      maxResponseTime: Math.max(...this.metrics.responseTime, 0),
      minResponseTime: Math.min(...this.metrics.responseTime, Infinity),
      errorRate: this.metrics.requestCount > 0 
        ? (this.metrics.errorCount / this.metrics.requestCount * 100).toFixed(2) + '%'
        : '0%',
      memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] || {}
    };
  }

  // 保存性能报告
  saveReport() {
    const stats = this.getStats();
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      summary: {
        status: stats.errorRate === '0%' ? 'healthy' : 'warning',
        performance: stats.avgResponseTime < 1000 ? 'good' : 'poor'
      }
    };

    const reportPath = path.join(__dirname, 'reports', `performance-${Date.now()}.json`);
    
    // 确保reports目录存在
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('📊 性能报告已保存:', reportPath);
    
    return report;
  }

  // 清理旧数据
  cleanup() {
    // 只保留最近1000条记录
    if (this.metrics.responseTime.length > 1000) {
      this.metrics.responseTime = this.metrics.responseTime.slice(-1000);
    }
    if (this.metrics.memoryUsage.length > 1000) {
      this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-1000);
    }
  }
}

// 创建全局监控实例
const monitor = new PerformanceMonitor();

// 定期记录内存使用
setInterval(() => {
  monitor.recordMemoryUsage();
  monitor.cleanup();
}, 30000); // 每30秒

// 定期保存报告
setInterval(() => {
  monitor.saveReport();
}, 300000); // 每5分钟

// 优雅关闭
process.on('SIGINT', () => {
  console.log('📊 保存最终性能报告...');
  monitor.saveReport();
  process.exit(0);
});

module.exports = monitor;
