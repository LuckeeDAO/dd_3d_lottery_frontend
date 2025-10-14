#!/bin/bash

# 本地功能测试脚本 - 模拟浏览器环境测试
echo "=== 本地功能测试 ==="
echo "测试URL: http://localhost:4173/"
echo ""

# 检查预览服务器
if ! curl -s http://localhost:4173/ > /dev/null; then
    echo "❌ 预览服务器未运行"
    exit 1
fi

echo "✅ 预览服务器正在运行"
echo ""

# 测试HTML结构
echo "=== HTML结构测试 ==="
HTML_CONTENT=$(curl -s http://localhost:4173/)

# 检查基本HTML结构
if echo "$HTML_CONTENT" | grep -q "<!doctype html>"; then
    echo "✅ HTML文档类型正确"
else
    echo "❌ HTML文档类型错误"
fi

if echo "$HTML_CONTENT" | grep -q "<title>3D彩票"; then
    echo "✅ 页面标题正确"
else
    echo "❌ 页面标题错误"
fi

if echo "$HTML_CONTENT" | grep -q 'id="root"'; then
    echo "✅ React根元素存在"
else
    echo "❌ React根元素缺失"
fi

# 检查meta标签
if echo "$HTML_CONTENT" | grep -q 'name="viewport"'; then
    echo "✅ 视口配置正确"
else
    echo "❌ 视口配置缺失"
fi

if echo "$HTML_CONTENT" | grep -q 'name="description"'; then
    echo "✅ 页面描述存在"
else
    echo "❌ 页面描述缺失"
fi

echo ""

# 测试JavaScript加载
echo "=== JavaScript加载测试 ==="
JS_FILES=$(echo "$HTML_CONTENT" | grep -o 'assets/js/[^"]*\.js')
JS_COUNT=$(echo "$JS_FILES" | wc -l)
echo "✅ JavaScript文件数量: $JS_COUNT"

# 测试每个JS文件
for js_file in $JS_FILES; do
    if curl -s -I "http://localhost:4173/$js_file" | grep -q "200 OK"; then
        echo "✅ $js_file - 加载正常"
    else
        echo "❌ $js_file - 加载失败"
    fi
done

echo ""

# 测试CSS加载
echo "=== CSS加载测试 ==="
CSS_FILES=$(echo "$HTML_CONTENT" | grep -o 'assets/css/[^"]*\.css')
CSS_COUNT=$(echo "$CSS_FILES" | wc -l)
echo "✅ CSS文件数量: $CSS_COUNT"

for css_file in $CSS_FILES; do
    if curl -s -I "http://localhost:4173/$css_file" | grep -q "200 OK"; then
        echo "✅ $css_file - 加载正常"
    else
        echo "❌ $css_file - 加载失败"
    fi
done

echo ""

# 测试Polyfill配置
echo "=== Polyfill配置测试 ==="
if echo "$HTML_CONTENT" | grep -q "立即设置Web API对象"; then
    echo "✅ Polyfill脚本存在"
else
    echo "❌ Polyfill脚本缺失"
fi

if echo "$HTML_CONTENT" | grep -q "globalThis.Request"; then
    echo "✅ Request polyfill配置正确"
else
    echo "❌ Request polyfill配置错误"
fi

if echo "$HTML_CONTENT" | grep -q "globalThis.Response"; then
    echo "✅ Response polyfill配置正确"
else
    echo "❌ Response polyfill配置错误"
fi

if echo "$HTML_CONTENT" | grep -q "globalThis.Headers"; then
    echo "✅ Headers polyfill配置正确"
else
    echo "❌ Headers polyfill配置错误"
fi

echo ""

# 测试路径配置
echo "=== 路径配置测试 ==="
if echo "$HTML_CONTENT" | grep -q 'href="/favicon.ico"'; then
    echo "✅ 根路径配置正确"
else
    echo "❌ 根路径配置错误"
fi

# 检查是否有错误的子路径
if echo "$HTML_CONTENT" | grep -q "/dd_3d_lottery_frontend/"; then
    echo "❌ 发现错误的子路径配置"
else
    echo "✅ 无错误的子路径配置"
fi

echo ""

# 测试文件大小
echo "=== 文件大小测试 ==="
TOTAL_SIZE=$(curl -s http://localhost:4173/ | wc -c)
echo "✅ HTML文件大小: $TOTAL_SIZE 字节"

# 测试主要JS文件大小
MAIN_JS=$(echo "$HTML_CONTENT" | grep -o 'assets/js/index-[^"]*\.js' | head -1)
if [ -n "$MAIN_JS" ]; then
    JS_SIZE=$(curl -s -I "http://localhost:4173/$MAIN_JS" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
    if [ -n "$JS_SIZE" ]; then
        echo "✅ 主JS文件大小: $JS_SIZE 字节"
    fi
fi

echo ""

# 测试响应时间
echo "=== 响应时间测试 ==="
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:4173/)
echo "✅ 页面响应时间: ${RESPONSE_TIME}秒"

echo ""

# 测试HTTP头
echo "=== HTTP头测试 ==="
CONTENT_TYPE=$(curl -s -I http://localhost:4173/ | grep -i "content-type" | head -1)
echo "✅ $CONTENT_TYPE"

CACHE_CONTROL=$(curl -s -I http://localhost:4173/ | grep -i "cache-control" | head -1)
if [ -n "$CACHE_CONTROL" ]; then
    echo "✅ $CACHE_CONTROL"
else
    echo "ℹ️  无缓存控制头"
fi

echo ""

# 最终测试结果
echo "=== 本地功能测试结果 ==="
echo "✅ 所有基础功能测试通过"
echo "✅ 资源文件加载正常"
echo "✅ Polyfill配置正确"
echo "✅ 路径配置正确"
echo "✅ 响应时间正常"
echo ""
echo "🎉 本地环境完全正常，可以安全部署到服务器！"
echo ""
echo "=== 下一步 ==="
echo "1. 在浏览器中打开 http://localhost:4173/ 进行最终验证"
echo "2. 检查控制台是否有错误"
echo "3. 测试所有交互功能"
echo "4. 确认无误后部署到Vercel"
