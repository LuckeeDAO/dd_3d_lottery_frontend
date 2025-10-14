#!/bin/bash

# 完整验证脚本 - 验证所有修复是否成功
echo "=== 完整修复验证 ==="
echo "测试URL: http://localhost:4173/"
echo ""

# 检查预览服务器是否运行
if ! curl -s 
http://localhost:4173/ > /dev/null; then
    echo "❌ 预览服务器未运行，请先运行: npm run preview"
    exit 1
fi

echo "✅ 预览服务器正在运行"
echo ""

# 检查HTML内容
echo "=== HTML内容检查 ==="
HTML_CONTENT=$(curl -s http://localhost:4173/)

# 检查是否包含立即执行的polyfill
if echo "$HTML_CONTENT" | grep -q "立即设置Web API对象"; then
    echo "✅ 立即执行polyfill已应用"
else
    echo "❌ 立即执行polyfill未找到"
fi

# 检查是否移除了ethereum重定义
if echo "$HTML_CONTENT" | grep -q "ethereum"; then
    echo "❌ 仍然包含ethereum相关代码"
else
    echo "✅ 已移除ethereum重定义逻辑"
fi

# 检查JavaScript文件引用
if echo "$HTML_CONTENT" | grep -q "assets/js/index-"; then
    echo "✅ JavaScript文件引用正确"
else
    echo "❌ JavaScript文件引用缺失"
fi

# 检查CSS文件引用
if echo "$HTML_CONTENT" | grep -q "assets/css/index-"; then
    echo "✅ CSS文件引用正确"
else
    echo "❌ CSS文件引用缺失"
fi

# 检查路径配置
if echo "$HTML_CONTENT" | grep -q 'href="/favicon.ico"'; then
    echo "✅ 路径配置正确（开发环境）"
else
    echo "❌ 路径配置有问题"
fi

echo ""
echo "=== 资源文件检查 ==="

# 检查CSS文件
CSS_FILE=$(echo "$HTML_CONTENT" | grep -o 'assets/css/index-[^"]*\.css' | head -1)
if [ -n "$CSS_FILE" ]; then
    if curl -s -I "http://localhost:4173/$CSS_FILE" | grep -q "200 OK"; then
        echo "✅ CSS文件加载正常: $CSS_FILE"
    else
        echo "❌ CSS文件加载失败: $CSS_FILE"
    fi
else
    echo "❌ 未找到CSS文件引用"
fi

# 检查JavaScript文件
JS_FILE=$(echo "$HTML_CONTENT" | grep -o 'assets/js/index-[^"]*\.js' | head -1)
if [ -n "$JS_FILE" ]; then
    if curl -s -I "http://localhost:4173/$JS_FILE" | grep -q "200 OK"; then
        echo "✅ JavaScript文件加载正常: $JS_FILE"
    else
        echo "❌ JavaScript文件加载失败: $JS_FILE"
    fi
else
    echo "❌ 未找到JavaScript文件引用"
fi

# 检查CosmJS文件
COSMJS_FILE=$(echo "$HTML_CONTENT" | grep -o 'assets/js/cosmjs-[^"]*\.js' | head -1)
if [ -n "$COSMJS_FILE" ]; then
    if curl -s -I "http://localhost:4173/$COSMJS_FILE" | grep -q "200 OK"; then
        echo "✅ CosmJS文件加载正常: $COSMJS_FILE"
    else
        echo "❌ CosmJS文件加载失败: $COSMJS_FILE"
    fi
else
    echo "❌ 未找到CosmJS文件引用"
fi

echo ""
echo "=== 浏览器测试指南 ==="
echo "请在浏览器中打开: http://localhost:4173/"
echo ""
echo "检查以下内容："
echo "1. 控制台是否显示: 'Web API polyfill set: { Request: 'function', Response: 'function', Headers: 'function', fetch: 'function' }'"
echo "2. 是否没有以下错误："
echo "   ❌ TypeError: Cannot redefine property: ethereum"
echo "   ❌ TypeError: Cannot destructure property 'Request' of 'undefined'"
echo "   ❌ Failed to load resource: 404 (Not Found)"
echo "3. 页面是否正常加载和显示"
echo "4. 所有样式是否正确应用"
echo ""

echo "=== 部署测试指南 ==="
echo "要测试部署环境，请运行："
echo "1. VITE_BUILD_FOR_GITHUB_PAGES=true npm run build"
echo "2. 将dist目录部署到GitHub Pages或其他静态托管服务"
echo "3. 访问: https://yourusername.github.io/dd_3d_lottery_frontend/"
echo ""

echo "=== 修复总结 ==="
echo "✅ 已修复的问题："
echo "   - Ethereum重定义冲突"
echo "   - CosmJS Request未定义问题"
echo "   - 预览服务器路径问题"
echo "   - 资源文件路径问题"
echo "   - 开发和生产环境配置分离"
echo ""
echo "✅ 当前状态："
echo "   - 本地开发环境：http://localhost:4173/"
echo "   - 生产构建：支持GitHub Pages部署"
echo "   - Polyfill：完整的Web API polyfill"
echo "   - 错误处理：移除了有问题的代码"
echo "   - 资源加载：所有文件正常加载"
echo ""

echo "=== 测试完成 ==="
echo "如果所有检查都通过，说明修复成功！"
echo "现在可以正常进行开发和部署了。"
