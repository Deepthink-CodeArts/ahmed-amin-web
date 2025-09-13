#!/bin/bash

# DeepBase Auto-Build Script
# Automatically builds complete sites from design files

echo "🎨 DeepBase Auto-Build System"
echo "============================="

# Check if design folder has files
if [ ! "$(ls -A design/)" ]; then
    echo "❌ No design files found in design/ folder"
    echo "📁 Please upload your design files to the design/ folder first"
    exit 1
fi

echo "🔍 Analyzing design files..."

# Create necessary directories
mkdir -p design/pages design/components design/assets design/styles design/layouts

# Count design files
html_count=$(find design/ -name "*.html" | wc -l)
css_count=$(find design/ -name "*.css" | wc -l)
img_count=$(find design/ -name "*.{jpg,jpeg,png,gif,svg,webp}" | wc -l)

echo "📊 Found:"
echo "   - $html_count HTML files"
echo "   - $css_count CSS files" 
echo "   - $img_count image files"

echo ""
echo "🚀 Ready for automatic site generation!"
echo ""
echo "Next steps:"
echo "1. Tell Cursor: 'Build the complete site from designs in the design folder'"
echo "2. The AI will analyze your designs and generate:"
echo "   ✅ React components"
echo "   ✅ TypeScript interfaces"
echo "   ✅ Page routing"
echo "   ✅ Backend integration"
echo "   ✅ CMS integration"
echo "   ✅ Responsive styling"
echo ""
echo "💡 Pro tip: Organize your designs in subfolders for better results:"
echo "   - design/pages/ for individual pages"
echo "   - design/components/ for reusable components"
echo "   - design/assets/ for images and media"
