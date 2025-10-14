#!/bin/bash

# DD 3D 彩票前端部署到 GitHub 脚本
# 用于将前端代码部署到独立的 GitHub 仓库

set -e

# 配置变量
PROJECT_NAME="dd-3d-lottery-frontend"
GITHUB_USERNAME="your-username"  # 请替换为实际的 GitHub 用户名
GITHUB_REPO="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}.git"
FRONTEND_DIR="dd_3d_lottery_frontend"
TEMP_DIR="/tmp/${PROJECT_NAME}_deploy"

echo "🚀 开始部署 DD 3D 彩票前端到 GitHub..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 dd_3d_lottery_frontend 目录中运行此脚本"
    exit 1
fi

# 检查 Git 状态
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告: 工作目录有未提交的更改"
    echo "请先提交所有更改:"
    echo "  git add ."
    echo "  git commit -m 'feat: prepare for deployment'"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 创建临时目录
echo "📁 创建临时目录..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# 克隆或初始化仓库
if [ -d "$PROJECT_NAME" ]; then
    echo "📥 更新现有仓库..."
    cd "$PROJECT_NAME"
    git pull origin main
else
    echo "📥 克隆仓库..."
    git clone "$GITHUB_REPO" || {
        echo "❌ 无法克隆仓库，请确保仓库存在且可访问"
        echo "请先在 GitHub 上创建仓库: https://github.com/new"
        echo "仓库名称: $PROJECT_NAME"
        exit 1
    }
    cd "$PROJECT_NAME"
fi

# 清理现有文件（保留 .git）
echo "🧹 清理现有文件..."
find . -not -path './.git*' -not -name '.' -not -name '..' -delete

# 复制前端文件
echo "📋 复制前端文件..."
cp -r "/home/lc/luckee_dao/dd_3d_lottery/$FRONTEND_DIR"/* .

# 创建独立的 README.md
echo "📝 创建独立的 README.md..."
cat > README.md << 'EOF'
# DD 3D 彩票前端 (Frontend)

基于 React + TypeScript + Vite 的现代化 Web 前端应用。

**版本**: v0.1.0

## 🎯 功能特性

### 核心功能
- **用户友好的投注界面**：直观的投注流程设计
- **实时阶段显示**：显示当前彩票阶段和剩余时间
- **投注历史查询**：查看历史投注记录
- **中奖结果展示**：实时显示中奖结果
- **响应式设计**：支持桌面和移动设备

### 技术特性
- **React 18**：使用最新的 React 框架
- **TypeScript**：类型安全的 JavaScript
- **Vite**：快速的构建工具
- **Tailwind CSS**：现代化的样式框架
- **Jest + Cypress**：完整的测试覆盖

## 🛠️ 快速开始

### 1. 环境要求

- Node.js 18+
- npm 或 yarn

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 开发环境

```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev
```

访问 http://localhost:5173 查看应用。

### 4. 构建生产版本

```bash
# 构建生产版本
npm run build

# 或使用 yarn
yarn build
```

### 5. 预览生产版本

```bash
# 预览生产版本
npm run preview

# 或使用 yarn
yarn preview
```

## 🧪 测试

### 单元测试

```bash
# 运行单元测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 或使用 yarn
yarn test
yarn test:coverage
```

### E2E 测试

```bash
# 运行 E2E 测试
npm run test:e2e

# 运行 E2E 测试 (无头模式)
npm run test:e2e:headless

# 或使用 yarn
yarn test:e2e
yarn test:e2e:headless
```

### 代码质量检查

```bash
# 运行 ESLint
npm run lint

# 修复 ESLint 问题
npm run lint:fix

# 或使用 yarn
yarn lint
yarn lint:fix
```

## 🚀 部署

### 环境变量配置

复制 `env.example` 文件并重命名为 `.env`：

```bash
cp env.example .env
```

配置必要的环境变量：

```env
VITE_CHAIN_ID=cosmoshub-4
VITE_RPC_URL=https://rpc.cosmos.network
VITE_CONTRACT_ADDRESS=cosmwasm1contract...
VITE_SENDER_ADDRESS=cosmwasm1sender...
```

### 部署选项

#### 1. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel --prod
```

#### 2. Docker 部署

```bash
# 构建 Docker 镜像
docker build -t dd-3d-lottery-frontend .

# 运行容器
docker run -p 3000:80 dd-3d-lottery-frontend
```

#### 3. 静态文件部署

```bash
# 构建生产版本
npm run build

# 将 dist 目录部署到任何静态文件服务器
```

## 📁 项目结构

```
dd-3d-lottery-frontend/
├── src/                    # 源代码
│   ├── components/         # React 组件
│   ├── pages/             # 页面组件
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # API 服务
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript 类型定义
│   ├── styles/            # 样式文件
│   └── App.tsx            # 应用入口
├── public/                # 静态资源
├── docs/                  # 前端文档
├── cypress/               # E2E 测试
├── monitoring/            # 监控配置
├── scripts/               # 构建脚本
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 🔧 开发指南

### 组件开发

```typescript
// 创建新组件
import React from 'react';

interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
};
```

### API 服务

```typescript
// 创建 API 服务
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export class LotteryService {
  private client: CosmWasmClient;

  constructor(rpcUrl: string) {
    this.client = new CosmWasmClient(rpcUrl);
  }

  async getCurrentSession() {
    // 实现查询逻辑
  }
}
```

### 状态管理

```typescript
// 使用 React Context 进行状态管理
import { createContext, useContext, useState } from 'react';

interface AppState {
  currentPhase: LotteryPhase;
  userAddress: string | null;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

## 📚 文档

- `docs/` - 前端技术文档
- `DEPLOYMENT_OPTIONS.md` - 部署选项说明
- `PROJECT_STATUS.md` - 项目状态说明

## 🔒 安全考虑

- **输入验证**：所有用户输入都经过验证
- **XSS 防护**：防止跨站脚本攻击
- **CSRF 防护**：防止跨站请求伪造
- **安全头部**：配置安全 HTTP 头部

## 🎨 样式指南

### Tailwind CSS 使用

```tsx
// 使用 Tailwind CSS 类名
<div className="flex items-center justify-center p-4 bg-blue-500 text-white">
  <h1 className="text-2xl font-bold">DD 3D Lottery</h1>
</div>
```

### 响应式设计

```tsx
// 响应式设计示例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 border rounded">Card 1</div>
  <div className="p-4 border rounded">Card 2</div>
  <div className="p-4 border rounded">Card 3</div>
</div>
```

## 📈 性能优化

- **代码分割**：使用动态导入进行代码分割
- **懒加载**：组件和路由懒加载
- **缓存策略**：合理的缓存策略
- **图片优化**：图片压缩和格式优化

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您遇到问题或有任何问题，请：

1. 查看 [文档](docs/)
2. 搜索 [Issues](https://github.com/your-org/dd-3d-lottery-frontend/issues)
3. 创建新的 Issue

---

**DD 3D 彩票前端** - 现代化的 Web 前端应用 🎲
EOF

# 创建 .gitignore
echo "📝 创建 .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
EOF

# 创建 GitHub Actions 工作流
echo "📝 创建 GitHub Actions 工作流..."
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Run E2E tests
      run: npm run test:e2e:headless
    
    - name: Build project
      run: npm run build
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
EOF

# 提交更改
echo "💾 提交更改..."
git add .
git commit -m "feat: deploy DD 3D lottery frontend

- 完整的 React + TypeScript 前端应用
- 现代化 UI 组件和交互
- 完整的测试覆盖
- Vercel 部署配置
- GitHub Actions CI/CD"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin main

# 清理临时目录
echo "🧹 清理临时目录..."
cd /home/lc/luckee_dao/dd_3d_lottery
rm -rf "$TEMP_DIR"

echo "✅ 前端部署完成！"
echo "📦 仓库地址: $GITHUB_REPO"
echo "🔗 GitHub 页面: https://github.com/$GITHUB_USERNAME/$PROJECT_NAME"
echo ""
echo "下一步："
echo "1. 在 GitHub 上配置 Secrets:"
echo "   - VERCEL_TOKEN: Vercel 访问令牌"
echo "   - ORG_ID: Vercel 组织 ID"
echo "   - PROJECT_ID: Vercel 项目 ID"
echo "2. 连接 Vercel 进行自动部署"
echo "3. 配置自定义域名（可选）"
