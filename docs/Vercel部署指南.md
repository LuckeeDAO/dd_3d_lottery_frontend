# Vercel部署指南

## 🚀 项目配置

### 1. 路径配置
项目已配置为支持Vercel部署，使用根路径（`/`）而不是子路径。

**Vite配置**：
```typescript
// vite.config.ts
base: process.env.VITE_BUILD_FOR_GITHUB_PAGES === 'true' ? '/dd_3d_lottery_frontend/' : '/',
```

**说明**：
- 默认使用根路径 `/`（适合Vercel）
- 如需GitHub Pages部署，设置环境变量 `VITE_BUILD_FOR_GITHUB_PAGES=true`

### 2. Vercel配置文件
项目包含 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "name": "dd-3d-lottery-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📦 部署步骤

### 方法1：使用Vercel CLI（推荐）

1. **安装Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   cd /home/lc/luckee_dao/dd_3d_lottery/dd_3d_lottery_frontend
   ./scripts/deploy-vercel.sh
   ```

### 方法2：使用Vercel Web界面

1. **访问Vercel控制台**：
   - 打开 [vercel.com](https://vercel.com)
   - 登录您的账户

2. **导入项目**：
   - 点击 "New Project"
   - 选择您的GitHub仓库
   - 选择 `dd_3d_lottery_frontend` 目录

3. **配置构建设置**：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **环境变量**（如需要）：
   - `NODE_ENV`: `production`
   - 其他项目特定的环境变量

5. **部署**：
   - 点击 "Deploy"
   - 等待构建完成

## 🧪 本地测试

### 测试Vercel构建版本

```bash
# 构建项目
npm run build

# 启动预览服务器
npm run preview

# 访问 http://localhost:4173/
```

### 验证检查清单

- [ ] 页面正常加载
- [ ] 控制台显示：`Web API polyfill set: { Request: 'function', ... }`
- [ ] 无错误信息：
  - ❌ `TypeError: Cannot redefine property: ethereum`
  - ❌ `TypeError: Cannot destructure property 'Request' of 'undefined'`
  - ❌ `Failed to load resource: 404 (Not Found)`
- [ ] 所有样式正确应用
- [ ] 所有JavaScript功能正常

## 🔧 故障排除

### 常见问题

1. **资源文件404错误**：
   - 确保使用根路径构建：`npm run build`
   - 检查 `vercel.json` 配置

2. **Polyfill错误**：
   - 检查HTML中的polyfill脚本
   - 确保在模块加载前执行

3. **路由问题**：
   - 确保 `vercel.json` 中的路由配置正确
   - 所有路由都指向 `index.html`

### 调试步骤

1. **检查构建输出**：
   ```bash
   npm run build
   ls -la dist/
   ```

2. **检查HTML内容**：
   ```bash
   head -20 dist/index.html
   ```

3. **本地预览测试**：
   ```bash
   npm run preview
   # 访问 http://localhost:4173/
   ```

## 📊 性能优化

### 已配置的优化

1. **代码分割**：
   - 按功能模块分割JavaScript
   - CosmJS单独打包

2. **缓存策略**：
   - 静态资源长期缓存
   - 版本化文件名

3. **压缩优化**：
   - Terser压缩
   - Gzip压缩

### 监控建议

1. **Vercel Analytics**：
   - 启用Vercel Analytics
   - 监控性能指标

2. **错误监控**：
   - 集成错误监控服务
   - 设置告警

## 🔄 持续部署

### GitHub集成

1. **连接GitHub仓库**：
   - 在Vercel中连接GitHub账户
   - 选择项目仓库

2. **自动部署**：
   - 推送到 `main` 分支自动触发部署
   - 预览分支自动部署

3. **环境管理**：
   - 生产环境：`main` 分支
   - 预览环境：其他分支

## 📝 部署记录

### 当前配置

- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **Node版本**: 18.x
- **路径配置**: 根路径 `/`
- **缓存策略**: 静态资源长期缓存

### 版本信息

- **Vite版本**: 4.5.14
- **React版本**: 18.x
- **构建时间**: ~2-3分钟
- **包大小**: ~3.5MB (gzipped: ~1.2MB)

## 🎯 下一步

1. **部署到Vercel**：
   ```bash
   ./scripts/deploy-vercel.sh
   ```

2. **配置自定义域名**（可选）

3. **设置环境变量**（如需要）

4. **监控和优化**

---

**注意**：此配置确保在Vercel上部署时不会出现路径问题，所有资源文件都能正确加载。