#!/bin/bash

echo "=== CosmJS集成测试 ==="

# 确保在前端项目目录
cd /home/lc/luckee_dao/dd_3d_lottery/dd_3d_lottery_frontend

echo "1. 检查服务器状态..."
if curl -s http://localhost:4173/ > /dev/null; then
    echo "✅ 服务器正在运行"
else
    echo "❌ 服务器未运行，正在启动..."
    npm run preview &
    sleep 5
fi

echo ""
echo "2. 测试页面加载..."
response=$(curl -s http://localhost:4173/)
if echo "$response" | grep -q "3D彩票"; then
    echo "✅ 页面标题正确"
else
    echo "❌ 页面标题错误"
fi

echo ""
echo "3. 检查JavaScript资源..."
js_files=$(curl -s http://localhost:4173/ | grep -o 'src="/assets/js/[^"]*\.js"' | head -3)
if [ -n "$js_files" ]; then
    echo "✅ JavaScript文件引用正确:"
    echo "$js_files"
else
    echo "❌ JavaScript文件引用错误"
fi

echo ""
echo "4. 检查CSS资源..."
css_files=$(curl -s http://localhost:4173/ | grep -o 'href="/assets/css/[^"]*\.css"')
if [ -n "$css_files" ]; then
    echo "✅ CSS文件引用正确:"
    echo "$css_files"
else
    echo "❌ CSS文件引用错误"
fi

echo ""
echo "5. 测试资源可访问性..."
main_js=$(curl -s http://localhost:4173/ | grep -o 'src="/assets/js/index-[^"]*\.js"' | head -1 | sed 's/src="//' | sed 's/"//')
if [ -n "$main_js" ]; then
    if curl -s "http://localhost:4173$main_js" | head -1 | grep -q "function\|var\|const"; then
        echo "✅ 主JavaScript文件可访问"
    else
        echo "❌ 主JavaScript文件不可访问"
    fi
else
    echo "❌ 无法找到主JavaScript文件"
fi

echo ""
echo "6. 检查构建输出..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ 构建输出存在"
    echo "   - dist/index.html: $(wc -c < dist/index.html) bytes"
    echo "   - dist/assets目录: $(find dist/assets -type f | wc -l) 个文件"
else
    echo "❌ 构建输出不存在"
fi

echo ""
echo "7. 检查CosmJS依赖..."
if grep -q "@cosmjs" package.json; then
    echo "✅ CosmJS依赖已安装"
    echo "   - @cosmjs/cosmwasm-stargate: $(grep -o '"@cosmjs/cosmwasm-stargate": "[^"]*"' package.json)"
    echo "   - @cosmjs/stargate: $(grep -o '"@cosmjs/stargate": "[^"]*"' package.json)"
else
    echo "❌ CosmJS依赖未安装"
fi

echo ""
echo "8. 检查polyfill实现..."
if curl -s http://localhost:4173/ | grep -q "Web API polyfill"; then
    echo "✅ polyfill代码存在"
else
    echo "❌ polyfill代码不存在"
fi

echo ""
echo "=== 测试完成 ==="
echo ""
echo "请在浏览器中访问 http://localhost:4173/ 并检查："
echo "1. 页面是否正常显示"
echo "2. 控制台是否有 'Cannot destructure property' 错误"
echo "3. 控制台是否有 'Illegal invocation' 错误"
echo "4. 钱包连接功能是否正常"
echo "5. CosmJS相关功能是否可用"
