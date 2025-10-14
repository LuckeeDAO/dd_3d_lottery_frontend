#!/bin/bash

# DD 3D Lottery Frontend 项目自动上传到 GitHub 脚本
# 使用方法: ./scripts/upload_to_github.sh

set -e  # 遇到错误时退出

echo "🚀 开始上传 DD 3D Lottery Frontend 项目到 GitHub..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Git 状态
echo "📋 检查 Git 状态..."
git status

# 添加所有修改的文件
echo "📝 添加所有修改的文件..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "feat: 完成 DD 3D Lottery Frontend 开发

- 实现完整的3D彩票前端界面
- 支持多号码选择和倍数投注
- 实现钱包连接和状态管理
- 添加随机种子设置功能
- 实现投注验证和提交逻辑
- 支持响应式设计和移动端适配
- 添加完整的用户交互体验

核心功能:
- 自由号码选择 (0-999)
- 倍数投注 (1-1000倍)
- 自动投注金额计算
- 随机种子设置
- 钱包连接管理
- 投注历史记录
- 中奖结果展示

技术特性:
- React 18 + TypeScript
- Material-UI 组件库
- Zustand 状态管理
- Vite 构建工具
- 响应式设计
- 热重载开发

UI/UX 特性:
- 直观的号码选择界面
- 实时投注金额计算
- 清晰的投注摘要
- 流畅的用户交互
- 移动端友好设计"

# 确认远程仓库设置
echo "🔗 确认远程仓库设置..."
git remote -v

# 推送代码到 GitHub
echo "⬆️  推送代码到 GitHub..."
git push -u origin main

echo "✅ 项目已成功上传到 GitHub!"

# 显示项目信息
echo ""
echo "📊 项目统计:"
echo "   - 总文件数: $(find . -type f | wc -l)"
echo "   - React组件: $(find . -name "*.tsx" | wc -l)"
echo "   - TypeScript文件: $(find . -name "*.ts" | wc -l)"
echo "   - 样式文件: $(find . -name "*.css" -o -name "*.scss" | wc -l)"
echo "   - 文档文件: $(find . -name "*.md" | wc -l)"
echo "   - 脚本文件: $(find . -name "*.sh" | wc -l)"

echo ""
echo "🎉 上传完成! 您现在可以访问 GitHub 仓库查看您的项目"
echo "📋 本次提交包含:"
echo "   - 完整的3D彩票前端实现"
echo "   - 多号码选择和倍数投注功能"
echo "   - 钱包连接和状态管理"
echo "   - 响应式设计和移动端适配"
echo "   - 完整的用户交互体验"
echo "   - 生产就绪的构建配置"
