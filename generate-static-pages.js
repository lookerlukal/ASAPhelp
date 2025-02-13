const fs = require('fs');
const path = require('path');

function generateStaticPages(config) {
    const baseDir = './docs';  // 改为docs目录
    if (!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }

    // 生成主页的文档列表
    let documentsList = [];

    function processNode(node, currentPath = '') {
        for (const item of node.children) {
            const itemPath = path.join(currentPath, item.name);
            
            if (item.type === 'file') {
                const content = fs.readFileSync(itemPath, 'utf8');
                const fileName = item.name;
                // 创建URL友好的文件名
                const urlPath = itemPath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                const outputPath = path.join(baseDir, `${urlPath}.html`);
                
                // 添加到文档列表
                documentsList.push({
                    title: fileName,
                    path: `${urlPath}.html`,
                    content: content
                });
                
                const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${fileName} - ASAP文档</title>
    <meta name="description" content="ASAP文档 - ${fileName}">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <div class="content">
        <nav class="top-nav">
            <a href="../index.html" class="back-link">← 返回文档中心</a>
        </nav>
        <article class="document">
            <h1>${fileName}</h1>
            <div class="document-content">
                <pre>${content}</pre>
            </div>
        </article>
    </div>
</body>
</html>`;
                
                fs.writeFileSync(outputPath, htmlContent);
            } else if (item.type === 'directory') {
                const newDir = path.join(baseDir, item.name.toLowerCase());
                if (!fs.existsSync(newDir)){
                    fs.mkdirSync(newDir);
                }
                processNode(item, itemPath);
            }
        }
    }

    processNode(config.siteStructure);

    // 生成主页
    const indexContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>ASAP 文档中心</title>
    <meta name="description" content="ASAP光学软件帮助文档库，包含命令参考和实例分析">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <nav id="sidebar">
            <div class="search-container">
                <input type="text" id="search" placeholder="搜索文档...">
            </div>
            <div class="nav-list">
                ${generateNavigation(documentsList)}
            </div>
        </nav>
        <main class="content">
            <h1>ASAP 文档中心</h1>
            <div class="documents-grid">
                ${generateDocumentCards(documentsList)}
            </div>
        </main>
    </div>
    <script src="search.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(baseDir, 'index.html'), indexContent);

    // 生成样式文件
    const cssContent = `
        /* 添加所需的CSS样式 */
    `;
    fs.writeFileSync(path.join(baseDir, 'styles.css'), cssContent);

    // 生成搜索脚本
    const searchScript = `
        // 添加搜索功能的JavaScript代码
    `;
    fs.writeFileSync(path.join(baseDir, 'search.js'), searchScript);
}

function generateNavigation(documents) {
    return documents.map(doc => `
        <a href="${doc.path}" class="nav-item">${doc.title}</a>
    `).join('\n');
}

function generateDocumentCards(documents) {
    return documents.map(doc => `
        <div class="document-card">
            <h2><a href="${doc.path}">${doc.title}</a></h2>
            <p>${doc.content.substring(0, 200)}...</p>
        </div>
    `).join('\n');
}

module.exports = generateStaticPages; 