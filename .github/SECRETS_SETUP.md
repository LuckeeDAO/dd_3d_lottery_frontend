# GitHub Secrets 配置指南

为了成功部署DD 3D彩票前端应用，您需要在GitHub仓库中配置以下secrets：

## 🔐 必需的Secrets

### 区块链配置
- `VITE_CHAIN_ID` - 区块链网络ID (例如: `cosmoshub-4`)
- `VITE_RPC_URL` - RPC节点URL (例如: `https://rpc.cosmos.network`)
- `VITE_CONTRACT_ADDRESS` - 智能合约地址 (例如: `cosmwasm1contract...`)
- `VITE_SENDER_ADDRESS` - 发送者地址 (例如: `cosmwasm1sender...`)

### Vercel部署配置
- `VERCEL_TOKEN` - Vercel API Token
- `VERCEL_ORG_ID` - Vercel组织ID
- `VERCEL_PROJECT_ID` - Vercel项目ID

## 📋 配置步骤

### 1. 获取Vercel配置信息

#### Vercel Token
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入 Settings → Tokens
3. 创建新的Token
4. 复制Token值

#### Vercel Org ID 和 Project ID
1. 在Vercel Dashboard中，选择您的项目
2. 进入 Settings → General
3. 在"Project ID"部分找到项目ID
4. 在"Team ID"部分找到组织ID

### 2. 在GitHub中配置Secrets

1. 进入您的GitHub仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 为每个secret添加名称和值：

```
VITE_CHAIN_ID = cosmoshub-4
VITE_RPC_URL = https://rpc.cosmos.network
VITE_CONTRACT_ADDRESS = cosmwasm1contract...
VITE_SENDER_ADDRESS = cosmwasm1sender...
VERCEL_TOKEN = your_vercel_token
VERCEL_ORG_ID = your_org_id
VERCEL_PROJECT_ID = your_project_id
```

## 🚀 部署流程

配置完secrets后，部署流程将自动执行：

1. **代码推送** - 当代码推送到main分支时
2. **测试阶段** - 运行linting、单元测试、E2E测试
3. **构建阶段** - 构建生产版本
4. **部署阶段** - 自动部署到Vercel

## 🔍 故障排除

### 常见问题

1. **Secrets未配置**
   - 确保所有必需的secrets都已配置
   - 检查secret名称是否正确

2. **Vercel部署失败**
   - 验证VERCEL_TOKEN是否有效
   - 检查VERCEL_ORG_ID和VERCEL_PROJECT_ID是否正确

3. **构建失败**
   - 检查环境变量是否正确配置
   - 查看GitHub Actions日志获取详细错误信息

### 查看部署状态

1. 进入GitHub仓库的Actions页面
2. 查看最新的workflow运行状态
3. 点击失败的job查看详细日志

## 📞 支持

如果遇到问题，请：
1. 查看GitHub Actions日志
2. 检查Vercel Dashboard中的部署状态
3. 参考项目文档中的故障排除部分
