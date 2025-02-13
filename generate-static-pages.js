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
                const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${item.name} - ASAP帮助文档</title>
    <meta name="description" content="ASAP文档 - ${item.name}">
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
                
                const outputPath = path.join(baseDir, `${item.name}.html`);
                fs.writeFileSync(outputPath, htmlContent);
            } else if (item.type === 'directory') {
                processNode(item, itemPath);
            }
        }
    }

    processNode(config.siteStructure);
} 