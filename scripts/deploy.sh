#!/bin/bash

# 部署脚本 - 将应用部署到GitHub Pages
echo "=== 3D彩票前端部署脚本 ==="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，请先运行构建"
    exit 1
fi

echo "✅ 项目目录检查通过"
echo ""

# 检查Git状态
echo "=== Git状态检查 ==="
if ! git status > /dev/null 2>&1; then
    echo "❌ 当前目录不是Git仓库"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改："
    git status --short
    echo ""
    read -p "是否继续部署？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

echo "✅ Git状态检查通过"
echo ""

# 检查生产构建
echo "=== 生产构建检查 ==="
if ! grep -q "/dd_3d_lottery_frontend/" dist/index.html; then
    echo "❌ 生产构建路径不正确，请运行: VITE_BUILD_FOR_GITHUB_PAGES=true npm run build"
    exit 1
fi

echo "✅ 生产构建检查通过"
echo ""

# 创建gh-pages分支（如果不存在）
echo "=== 准备部署分支 ==="
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "创建gh-pages分支..."
    git checkout --orphan gh-pages
    git rm -rf .
else
    echo "切换到gh-pages分支..."
    git checkout gh-pages
fi

echo "✅ 部署分支准备完成"
echo ""

# 复制dist内容到根目录
echo "=== 复制构建文件 ==="
cp -r dist/* .
echo "✅ 构建文件复制完成"
echo ""

# 添加文件到Git
echo "=== 提交更改 ==="
git add .
git commit -m "Deploy 3D彩票前端 - $(date '+%Y-%m-%d %H:%M:%S')"
echo "✅ 更改已提交"
echo ""

# 推送到远程仓库
echo "=== 推送到远程仓库 ==="
if git push origin gh-pages; then
    echo "✅ 部署成功！"
    echo ""
    echo "=== 部署信息 ==="
    echo "🌐 应用地址: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/dd_3d_lottery_frontend/"
    echo "📁 分支: gh-pages"
    echo "⏰ 部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "=== 后续步骤 ==="
    echo "1. 等待GitHub Pages构建完成（通常需要几分钟）"
    echo "2. 访问上述地址查看部署结果"
    echo "3. 如有问题，请检查GitHub Pages设置"
    echo ""
else
    echo "❌ 推送失败，请检查网络连接和权限"
    exit 1
fi

# 切换回主分支
echo "=== 切换回主分支 ==="
git checkout main 2>/dev/null || git checkout master 2>/dev/null || echo "⚠️  请手动切换回主分支"
echo "✅ 部署脚本执行完成"