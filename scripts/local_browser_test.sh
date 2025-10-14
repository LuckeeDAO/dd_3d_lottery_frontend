#!/bin/bash

echo "=== 本地浏览器功能测试 ==="
echo "测试URL: http://localhost:4173/"
echo ""

# 检查预览服务器是否运行
if ! lsof -i:4173 -t > /dev/null; then
  echo "❌ 预览服务器未运行，请先运行: npm run preview"
  exit 1
fi
echo "✅ 预览服务器正在运行"

# 等待服务器完全启动
sleep 3

# 使用curl获取页面内容
HTML_CONTENT=$(curl -s http://localhost:4173/)

echo ""
echo "=== HTML结构测试 ==="

# 检查HTML文档类型
if echo "$HTML_CONTENT" | grep -q "<!doctype html>"; then
  echo "✅ HTML文档类型正确"
else
  echo "❌ HTML文档类型不正确"
fi

# 检查页面标题
if echo "$HTML_CONTENT" | grep -q "<title>3D彩票 - 去中心化彩票系统</title>"; then
  echo "✅ 页面标题正确"
else
  echo "❌ 页面标题不正确"
fi

# 检查React根元素是否存在
if echo "$HTML_CONTENT" | grep -q "<div id=\"root\"></div>"; then
  echo "✅ React根元素存在"
else
  echo "❌ React根元素不存在"
fi

# 检查polyfill脚本是否存在
if echo "$HTML_CONTENT" | grep -q "Web API polyfill set:"; then
  echo "✅ Polyfill脚本存在"
else
  echo "❌ Polyfill脚本不存在"
fi

# 检查是否有正确的构造函数定义
if echo "$HTML_CONTENT" | grep -q "function RequestPolyfill"; then
  echo "✅ Request构造函数定义正确"
else
  echo "❌ Request构造函数定义不正确"
fi

if echo "$HTML_CONTENT" | grep -q "function ResponsePolyfill"; then
  echo "✅ Response构造函数定义正确"
else
  echo "❌ Response构造函数定义不正确"
fi

if echo "$HTML_CONTENT" | grep -q "function HeadersPolyfill"; then
  echo "✅ Headers构造函数定义正确"
else
  echo "❌ Headers构造函数定义不正确"
fi

echo ""
echo "=== 资源文件测试 ==="

# 检查CSS文件
CSS_FILES=$(echo "$HTML_CONTENT" | grep -oP 'href="/assets/css/[^"]+\.css"' | sed 's/href="//;s/"//')
CSS_COUNT=$(echo "$CSS_FILES" | wc -l)
echo "✅ CSS文件数量: $CSS_COUNT"

for css_file in $CSS_FILES; do
  if curl -s -f -I "http://localhost:4173${css_file}" > /dev/null; then
    echo "✅ ${css_file} - 加载正常"
  else
    echo "❌ ${css_file} - 加载失败"
  fi
done

# 检查JavaScript文件
JS_FILES=$(echo "$HTML_CONTENT" | grep -oP 'src="/assets/js/[^"]+\.js"' | sed 's/src="//;s/"//')
JS_COUNT=$(echo "$JS_FILES" | wc -l)
echo "✅ JavaScript文件数量: $JS_COUNT"

for js_file in $JS_FILES; do
  if curl -s -f -I "http://localhost:4173${js_file}" > /dev/null; then
    echo "✅ ${js_file} - 加载正常"
  else
    echo "❌ ${js_file} - 加载失败"
  fi
done

echo ""
echo "=== 路径配置测试 ==="

# 检查favicon路径
if echo "$HTML_CONTENT" | grep -q "href=\"/favicon.ico\""; then
  echo "✅ 根路径配置正确"
else
  echo "❌ 根路径配置不正确"
fi

# 检查是否有错误的子路径引用
if echo "$HTML_CONTENT" | grep -q "/dd_3d_lottery_frontend/"; then
  echo "❌ 存在错误的子路径配置"
else
  echo "✅ 无错误的子路径配置"
fi

echo ""
echo "=== 性能测试 ==="

# 测试页面响应时间
RESPONSE_TIME=$(curl -s -o /dev/null -w '%{time_total}' http://localhost:4173/)
echo "✅ 页面响应时间: ${RESPONSE_TIME}秒"

# 测试HTML文件大小
HTML_SIZE=$(echo -n "$HTML_CONTENT" | wc -c)
echo "✅ HTML文件大小: ${HTML_SIZE} 字节"

echo ""
echo "=== 浏览器测试指南 ==="
echo "请在浏览器中打开: http://localhost:4173/"
echo ""
echo "检查以下内容："
echo "1. 控制台是否显示: 'Web API polyfill set: { Request: 'function', Response: 'function', Headers: 'function', fetch: 'function' }'"
echo "2. 是否没有以下错误："
echo "   ❌ TypeError: Cannot redefine property: ethereum"
echo "   ❌ TypeError: Cannot destructure property 'Request' of 'undefined'"
echo "   ❌ TypeError: Illegal invocation"
echo "   ❌ Failed to load resource: 404 (Not Found)"
echo "3. 页面是否正常加载和显示"
echo "4. 所有样式是否正确应用"
echo "5. 所有功能是否正常工作"
echo "6. CosmJS相关功能是否正常（如果页面中有相关功能）"

echo ""
echo "=== 测试完成 ==="
echo "如果所有检查都通过，说明本地环境完全正常！"
echo "现在可以安全地部署到Vercel了。"
