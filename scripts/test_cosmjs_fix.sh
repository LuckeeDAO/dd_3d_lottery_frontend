#!/bin/bash

# 测试CosmJS修复是否有效
echo "=== CosmJS修复测试 ==="
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

# 检查是否包含简化的polyfill
if echo "$HTML_CONTENT" | grep -q "参考decentralized_decision_frontend的简洁配置"; then
    echo "✅ 简化polyfill配置已应用"
else
    echo "❌ 简化polyfill配置未找到"
fi

# 检查是否移除了复杂的fallback逻辑
if echo "$HTML_CONTENT" | grep -q "如果浏览器不支持Request"; then
    echo "❌ 仍然包含复杂的fallback逻辑"
else
    echo "✅ 已移除复杂的fallback逻辑"
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

echo ""
echo "=== 测试完成 ==="
echo "请在浏览器中访问: http://localhost:4173/dd_3d_lottery_frontend/"
echo "检查浏览器控制台是否还有 'Cannot destructure property Request' 错误"
echo ""
echo "如果仍然有错误，可能需要进一步调试CosmJS的加载时机"
