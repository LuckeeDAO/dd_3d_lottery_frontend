#!/bin/bash

# 测试本地显示是否正常
echo "=== 本地显示测试 ==="
echo "测试URL: http://localhost:4173/dd_3d_lottery_frontend/"
echo ""

# 检查预览服务器是否运行
if ! curl -s http://localhost:4173/dd_3d_lottery_frontend/ > /dev/null; then
    echo "❌ 预览服务器未运行，请先运行: npm run preview"
    exit 1
fi

echo "✅ 预览服务器正在运行"
echo ""

# 检查HTML内容
echo "检查HTML内容..."
HTML_CONTENT=$(curl -s http://localhost:4173/dd_3d_lottery_frontend/)
if echo "$HTML_CONTENT" | grep -q "3D彩票 - 去中心化彩票系统"; then
    echo "✅ HTML标题正确"
else
    echo "❌ HTML标题不正确"
fi

# 检查JavaScript文件
if echo "$HTML_CONTENT" | grep -q "assets/js/index-"; then
    echo "✅ JavaScript文件引用正确"
else
    echo "❌ JavaScript文件引用缺失"
fi

# 检查CSS文件
if echo "$HTML_CONTENT" | grep -q "assets/css/index-"; then
    echo "✅ CSS文件引用正确"
else
    echo "❌ CSS文件引用缺失"
fi

# 检查CosmJS兼容性脚本
if echo "$HTML_CONTENT" | grep -q "CosmJS兼容性脚本"; then
    echo "✅ CosmJS兼容性脚本已添加"
else
    echo "❌ CosmJS兼容性脚本缺失"
fi

echo ""
echo "=== 测试完成 ==="
echo "请在浏览器中访问: http://localhost:4173/dd_3d_lottery_frontend/"
echo "检查浏览器控制台是否还有JavaScript错误"
