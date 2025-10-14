#!/bin/bash

# 生产构建测试脚本
echo "=== 生产构建测试 ==="
echo ""

# 检查生产构建
echo "=== 检查生产构建 ==="
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，请先运行: VITE_BUILD_FOR_GITHUB_PAGES=true npm run build"
    exit 1
fi

# 检查HTML文件
echo "=== 检查HTML文件 ==="
if grep -q "/dd_3d_lottery_frontend/" dist/index.html; then
    echo "✅ 生产构建路径正确"
else
    echo "❌ 生产构建路径不正确"
    exit 1
fi

# 检查资源文件
echo "=== 检查资源文件 ==="
CSS_COUNT=$(find dist -name "*.css" | wc -l)
JS_COUNT=$(find dist -name "*.js" | wc -l)
echo "✅ CSS文件数量: $CSS_COUNT"
echo "✅ JavaScript文件数量: $JS_COUNT"

# 启动本地预览服务器测试生产构建
echo ""
echo "=== 启动本地预览服务器测试 ==="
echo "正在启动预览服务器..."

# 停止现有的预览服务器
pkill -f "vite preview" 2>/dev/null || true
sleep 2

# 启动预览服务器
npm run preview &
SERVER_PID=$!

# 等待服务器启动
echo "等待服务器启动..."
sleep 5

# 测试服务器
echo "=== 测试服务器响应 ==="
if curl -s http://localhost:4173/ > /dev/null; then
    echo "✅ 服务器启动成功"
    
    # 测试HTML内容
    echo "=== 测试HTML内容 ==="
    HTML_CONTENT=$(curl -s http://localhost:4173/)
    
    if echo "$HTML_CONTENT" | grep -q "立即设置Web API对象"; then
        echo "✅ Polyfill已应用"
    else
        echo "❌ Polyfill未找到"
    fi
    
    if echo "$HTML_CONTENT" | grep -q "/dd_3d_lottery_frontend/"; then
        echo "✅ 生产路径配置正确"
    else
        echo "❌ 生产路径配置错误"
    fi
    
    # 测试资源文件
    echo "=== 测试资源文件 ==="
    CSS_FILE=$(echo "$HTML_CONTENT" | grep -o 'assets/css/index-[^"]*\.css' | head -1)
    if [ -n "$CSS_FILE" ]; then
        if curl -s -I "http://localhost:4173/$CSS_FILE" | grep -q "200 OK"; then
            echo "✅ CSS文件加载正常"
        else
            echo "❌ CSS文件加载失败"
        fi
    fi
    
    JS_FILE=$(echo "$HTML_CONTENT" | grep -o 'assets/js/index-[^"]*\.js' | head -1)
    if [ -n "$JS_FILE" ]; then
        if curl -s -I "http://localhost:4173/$JS_FILE" | grep -q "200 OK"; then
            echo "✅ JavaScript文件加载正常"
        else
            echo "❌ JavaScript文件加载失败"
        fi
    fi
    
    echo ""
    echo "=== 测试结果 ==="
    echo "✅ 生产构建测试通过！"
    echo "🌐 本地测试地址: http://localhost:4173/"
    echo ""
    echo "请在浏览器中打开上述地址进行最终测试："
    echo "1. 检查控制台是否显示polyfill设置成功"
    echo "2. 检查是否有任何错误"
    echo "3. 检查页面是否正常显示"
    echo ""
    echo "测试完成后，按 Ctrl+C 停止服务器"
    echo ""
    
    # 等待用户中断
    trap "echo ''; echo '停止服务器...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
    wait $SERVER_PID
    
else
    echo "❌ 服务器启动失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
