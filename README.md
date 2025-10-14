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

## 📁 项目结构

```
front/
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

## 📋 主要功能

### 1. 投注界面

- **投注金额设置**：用户可以选择投注金额
- **幸运数字选择**：选择幸运数字 (0-999)
- **随机种子输入**：输入随机种子
- **承诺哈希生成**：自动生成承诺哈希

### 2. 阶段管理

- **承诺阶段**：显示投注界面
- **揭秘阶段**：显示揭秘界面
- **结算阶段**：显示结算结果

### 3. 查询功能

- **当前会话查询**：显示当前彩票会话信息
- **参与者信息查询**：查询参与者投注信息
- **历史结果查询**：查看历史中奖结果
- **统计信息查询**：显示系统统计信息

### 4. 用户界面

- **响应式设计**：适配各种屏幕尺寸
- **现代化 UI**：使用 Tailwind CSS 构建
- **交互反馈**：提供良好的用户体验
- **错误处理**：友好的错误提示

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
   - [前端需求设计](docs/01-前端需求设计.md)
   - [前端概要设计](docs/02-前端概要设计.md)
   - [前端详细设计](docs/03-前端详细设计.md)
   - [前端接口设计](docs/04-前端接口设计.md)
   - [前端规格说明](docs/05-前端规格说明.md)
   - [前端测试计划](docs/06-前端测试计划.md)
   - [项目开发Checklist](docs/07-项目开发Checklist.md)
   - [前端独立部署方案文档](docs/前端独立部署方案文档.md)
   - [GitHub部署指南文档](docs/GitHub部署指南文档.md)
2. 搜索 [Issues](https://github.com/your-org/dd-3d-lottery/issues)
3. 创建新的 Issue

---

**DD 3D 彩票前端** - 现代化的 Web 前端应用 🎲