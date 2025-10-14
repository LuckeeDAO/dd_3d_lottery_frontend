#!/bin/bash

# Vercel部署脚本
echo "=== 3D彩票前端 - Vercel部署脚本 ==="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Vercel CLI是否安装
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装，请先安装："
    echo "npm install -g vercel"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 构建项目
echo "=== 构建项目 ==="
echo "正在构建项目（Vercel部署）..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

echo ""

# 检查构建结果
echo "=== 检查构建结果 ==="
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在"
    exit 1
fi

# 检查HTML文件路径
if grep -q 'href="/favicon.ico"' dist/index.html; then
    echo "✅ 路径配置正确（Vercel根路径）"
else
    echo "❌ 路径配置错误"
    exit 1
fi

echo "✅ 构建结果检查通过"
echo ""

# 部署到Vercel
echo "=== 部署到Vercel ==="
echo "正在部署到Vercel..."
echo ""

if vercel --prod; then
    echo ""
    echo "🎉 部署成功！"
    echo ""
    echo "=== 部署信息 ==="
    echo "🌐 应用地址: 请查看上方Vercel输出的URL"
    echo "📁 构建目录: dist"
    echo "⏰ 部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "=== 后续步骤 ==="
    echo "1. 访问Vercel控制台查看部署状态"
    echo "2. 测试应用功能是否正常"
    echo "3. 配置自定义域名（如需要）"
    echo ""
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi