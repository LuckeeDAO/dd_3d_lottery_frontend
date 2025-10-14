#!/bin/bash

# 最终测试脚本 - 验证本地和部署环境修复
echo "=== 最终修复验证测试 ==="
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

# 检查控制台日志
echo ""
echo "=== 控制台日志检查 ==="
echo "请在浏览器中打开开发者工具，查看控制台是否显示："
echo "Web API polyfill set: { Request: 'function', Response: 'function', Headers: 'function', fetch: 'function' }"
echo ""

# 检查是否还有错误
echo "=== 错误检查 ==="
echo "请检查浏览器控制台是否还有以下错误："
echo "❌ TypeError: Cannot redefine property: ethereum"
echo "❌ TypeError: Cannot destructure property 'Request' of 'undefined'"
echo ""

echo "=== 测试完成 ==="
echo "如果所有检查都通过，说明修复成功！"
echo "如果仍有错误，请检查："
echo "1. 浏览器控制台的具体错误信息"
echo "2. 网络请求是否正常"
echo "3. 是否有其他JavaScript错误"
