#!/bin/bash

# GitHub Pages 部署脚本
set -e

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 错误: 构建失败，dist目录不存在"
    exit 1
fi

echo "✅ 构建成功"

# 提交到GitHub
echo "📤 提交到GitHub..."
git add .
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的更改"
git push origin main

echo "✅ 部署完成！"
echo "🌐 请访问: https://luckeedao.github.io/dd_3d_lottery_frontend/"
echo "📋 注意: GitHub Pages可能需要几分钟才能更新"
