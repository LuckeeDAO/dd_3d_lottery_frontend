#!/bin/bash

# 检查GitHub Pages部署状态
echo "=== GitHub Pages部署状态检查 ==="
echo "仓库: https://github.com/LuckeeDAO/dd_3d_lottery_frontend"
echo "GitHub Pages URL: https://luckeedao.github.io/dd_3d_lottery_frontend/"
echo ""

# 检查GitHub Actions状态
echo "检查GitHub Actions状态..."
curl -s "https://api.github.com/repos/LuckeeDAO/dd_3d_lottery_frontend/actions/runs?per_page=1" | jq -r '.workflow_runs[0].status, .workflow_runs[0].conclusion'

echo ""
echo "=== 部署检查完成 ==="
echo "如果GitHub Actions显示'success'，则部署成功"
echo "如果显示'queued'或'in_progress'，请等待几分钟后重试"
