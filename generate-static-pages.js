const fs = require('fs');
const path = require('path');

function generateStaticPages(config) {
    const baseDir = './static-pages';
    if (!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }

    function processNode(node, currentPath = '') {
        for (const item of node.children) {
            const itemPath = path.join(currentPath, item.name);
            
            if (item.type === 'file') {
                const content = fs.readFileSync(itemPath, 'utf8');
                const fileName = item.name;
                const outputPath = path.join(baseDir, `${fileName}.html`);
                
                // 使用与file-viewer.php相同的模板
                const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${fileName} - ASAP文档</title>
    <meta name="description" content="ASAP文档 - ${fileName}">
    <meta name="robots" content="index, follow">
    <style>
        /* 复制file-viewer.php中的样式 */
    </style>
</head>
<body>
    <div class="content">
        <a href="/" class="back-link">← 返回文档中心</a>
        <div class="header">
            <h1>${fileName}</h1>
        </div>
        <pre>${content}</pre>
    </div>
</body>
</html>`;
                
                fs.writeFileSync(outputPath, htmlContent);
            } else if (item.type === 'directory') {
                const newDir = path.join(baseDir, item.name);
                if (!fs.existsSync(newDir)){
                    fs.mkdirSync(newDir);
                }
                processNode(item, itemPath);
            }
        }
    }

    processNode(config.siteStructure);
} 