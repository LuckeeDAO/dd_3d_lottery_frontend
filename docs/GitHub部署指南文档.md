# DD 3D 彩票系统 GitHub 部署指南

## 🎯 部署概述

本指南将帮助您将DD 3D彩票系统的前端和后端分别部署到独立的GitHub仓库。

## 📋 部署前准备

### 环境要求

- Git 2.30+
- GitHub 账户
- 适当的仓库权限

### 仓库命名规范

- **后端仓库**: `dd-3d-lottery-backend`
- **前端仓库**: `dd-3d-lottery-frontend`

## 🚀 后端部署

### 1. 创建GitHub仓库

1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库：`dd-3d-lottery-backend`
3. 设置为公开仓库
4. 添加 README.md（可选）

### 2. 配置部署脚本

```bash
# 进入后端目录
cd dd_3d_lottery_backend

# 编辑部署脚本
nano scripts/deploy_to_github.sh

# 修改配置变量
GITHUB_USERNAME="your-username"  # 替换为您的GitHub用户名
```

### 3. 执行部署

```bash
# 运行部署脚本
./scripts/deploy_to_github.sh
```

### 4. 验证部署

- 检查仓库内容是否完整
- 验证 README.md 是否正确生成
- 确认所有文件都已上传

## 🌐 前端部署

### 1. 创建GitHub仓库

1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库：`dd-3d-lottery-frontend`
3. 设置为公开仓库
4. 添加 README.md（可选）

### 2. 配置部署脚本

```bash
# 进入前端目录
cd dd_3d_lottery_frontend

# 编辑部署脚本
nano scripts/deploy_to_github.sh

# 修改配置变量
GITHUB_USERNAME="your-username"  # 替换为您的GitHub用户名
```

### 3. 执行部署

```bash
# 运行部署脚本
./scripts/deploy_to_github.sh
```

### 4. 验证部署

- 检查仓库内容是否完整
- 验证 README.md 是否正确生成
- 确认所有文件都已上传

## 🔧 配置CI/CD

### 后端CI/CD配置

后端仓库将自动配置以下功能：

- **代码格式检查**: 使用 `cargo fmt`
- **代码质量检查**: 使用 `cargo clippy`
- **构建测试**: 自动构建和运行测试
- **WASM优化**: 自动优化WASM文件
- **安全扫描**: 进行安全审计

### 前端CI/CD配置

前端仓库将自动配置以下功能：

- **代码格式检查**: 使用 ESLint
- **单元测试**: 使用 Jest
- **E2E测试**: 使用 Cypress
- **构建测试**: 自动构建项目
- **Vercel部署**: 自动部署到Vercel

## 📊 部署结果

### 后端仓库结构

```
dd-3d-lottery-backend/
├── src/                    # 源代码
├── tests/                  # 测试文件
├── scripts/                # 部署脚本
├── docs/                   # 项目文档
├── schema/                 # JSON Schema
├── Cargo.toml             # 项目配置
├── README.md              # 项目说明
└── .github/workflows/     # CI/CD 配置
```

### 前端仓库结构

```
dd-3d-lottery-frontend/
├── src/                    # 源代码
├── public/                 # 静态资源
├── docs/                   # 前端文档
├── cypress/                # E2E 测试
├── scripts/                # 构建脚本
├── package.json            # 项目配置
├── README.md               # 项目说明
└── .github/workflows/     # CI/CD 配置
```

## 🔗 仓库链接

部署完成后，您将获得以下仓库：

- **后端仓库**: `https://github.com/your-username/dd-3d-lottery-backend`
- **前端仓库**: `https://github.com/your-username/dd-3d-lottery-frontend`

## 🚀 后续步骤

### 1. 配置Vercel部署（前端）

```bash
# 安装Vercel CLI
npm install -g vercel

# 在前端仓库中配置Vercel
cd dd-3d-lottery-frontend
vercel

# 配置环境变量
vercel env add VITE_CHAIN_ID production
vercel env add VITE_RPC_URL production
vercel env add VITE_CONTRACT_ADDRESS production
vercel env add VITE_SENDER_ADDRESS production
```

### 2. 配置区块链部署（后端）

```bash
# 在后端仓库中配置部署
cd dd-3d-lottery-backend

# 设置环境变量
export CHAIN_ID="cosmoshub-4"
export RPC_URL="https://rpc.cosmos.network"
export ADMIN_ADDRESS="cosmwasm1admin..."

# 运行部署脚本
./scripts/deploy.sh
```

### 3. 设置监控和告警

- 配置GitHub Actions通知
- 设置Vercel部署通知
- 配置区块链监控

## 🔒 安全配置

### 1. 仓库权限

- 设置适当的仓库权限
- 配置分支保护规则
- 启用代码审查

### 2. 密钥管理

- 使用GitHub Secrets存储敏感信息
- 配置环境变量
- 设置访问令牌

### 3. 访问控制

- 配置团队访问权限
- 设置部署权限
- 管理API密钥

## 📈 监控和维护

### 1. 部署监控

- 监控部署状态
- 检查构建日志
- 验证功能正常

### 2. 性能监控

- 监控应用性能
- 检查错误日志
- 优化构建时间

### 3. 安全监控

- 定期安全扫描
- 更新依赖包
- 检查漏洞报告

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   - 检查GitHub权限
   - 验证仓库设置
   - 查看错误日志

2. **构建错误**
   - 检查依赖配置
   - 验证环境变量
   - 查看构建日志

3. **权限问题**
   - 检查GitHub权限
   - 验证访问令牌
   - 确认仓库设置

### 解决方案

1. **重新部署**
   ```bash
   # 重新运行部署脚本
   ./scripts/deploy_to_github.sh
   ```

2. **检查配置**
   ```bash
   # 检查Git配置
   git config --list
   
   # 检查远程仓库
   git remote -v
   ```

3. **清理重试**
   ```bash
   # 清理临时文件
   rm -rf /tmp/*_deploy
   
   # 重新部署
   ./scripts/deploy_to_github.sh
   ```

## 📚 相关文档

- [系统架构设计](系统架构设计.md)
- [部署指南](部署指南.md)
- [项目结构说明](项目结构说明.md)

## 🤝 支持

如果您在部署过程中遇到问题，请：

1. 查看 [故障排除](#故障排除) 部分
2. 检查 GitHub 仓库设置
3. 验证部署脚本配置
4. 联系技术支持

---

**DD 3D 彩票系统 GitHub 部署指南** - 完整的独立仓库部署解决方案 🚀
