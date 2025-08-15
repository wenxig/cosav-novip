#!/usr/bin/env bash
set -euo pipefail

DIST="./js"
OUT="./recovered"
ZIP="../recovered-source.zip"
NPROC=4  # 并行数（不是必须）

if [ ! -d "$DIST" ]; then
  echo "未找到 $DIST，先检查路径（可修改脚本中的 DIST 变量）"
  exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT"

# 逐个处理 .js 与 .map
find "$DIST" -type f \( -iname '*.js' -o -iname '*.map' \) -print0 |
  while IFS= read -r -d '' f; do
    echo "处理: $f"
    fileurl="file://$(realpath "$f")"
    # 使用 npx 可避免全局安装
    npx js-source-extractor "$fileurl" --outDir "$OUT" || {
      echo "警告：$f 处理失败，继续下一个。"
    }
  done

# 可选：格式化（如果安装了 prettier）
if command -v npx >/dev/null 2>&1; then
  echo "尝试使用 prettier 格式化（需要安装 prettier）..."
  npx prettier --write "$OUT/**/*.{js,ts,css,scss,vue}" || echo "prettier 格式化失败或未安装，跳过。"
fi

# 打包
echo "打包为 zip..."
cd "$OUT"
zip -r "$ZIP" . >/dev/null
cd - >/dev/null
echo "完成，zip 在：$ZIP"
