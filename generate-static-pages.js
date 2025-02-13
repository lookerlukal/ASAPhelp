const fs = require('fs');
const path = require('path');

function generateStaticPages(config) {
    const baseDir = './docs';  // GitHub Pages 默认使用 docs 或 root 目录
    if (!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }

    let documentsList = [];

    function processNode(node, currentPath = '') {
        for (const item of node.children) {
            const itemPath = path.join(currentPath, item.name);
            
            if (item.type === 'file') {
                const content = fs.readFileSync(itemPath, 'utf8');
                const fileName = item.name;
                // 创建更简单的URL结构
                const urlPath = fileName.replace(/\s+/g, '-').toLowerCase();
                const outputPath = path.join(baseDir, `${urlPath}.html`);
                
                documentsList.push({
                    title: fileName,
                    path: urlPath + '.html',
                    content: content
                });
                
                // 生成独立的HTML页面
                const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${fileName} - ASAP文档</title>
    <meta name="description" content="ASAP文档 - ${fileName} - 详细内容和使用说明">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="container">
        <nav id="sidebar">
            <div class="search-container">
                <input type="text" id="search" placeholder="搜索文档...">
            </div>
            <div class="nav-list">
                <a href="index.html" class="nav-item">首页</a>
                <div id="nav-content"></div>
            </div>
        </nav>
        <main class="content">
            <article class="document">
                <h1>${fileName}</h1>
                <div class="document-content">
                    <pre>${content}</pre>
                </div>
            </article>
        </main>
    </div>
    <script src="./search.js"></script>
    <script>
        // 加载导航内容
        fetch('nav-data.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('nav-content').innerHTML = data.navigation;
            });
    </script>
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

    // 生成导航数据
    const navData = {
        navigation: generateNavigation(documentsList)
    };
    fs.writeFileSync(path.join(baseDir, 'nav-data.json'), JSON.stringify(navData, null, 2));

    // 生成主页
    const indexContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>ASAP 文档中心</title>
    <meta name="description" content="ASAP光学软件帮助文档库，包含命令参考和实例分析">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="container">
        <nav id="sidebar">
            <div class="search-container">
                <input type="text" id="search" placeholder="搜索文档...">
            </div>
            <div class="nav-list">
                <div id="nav-content"></div>
            </div>
        </nav>
        <main class="content">
            <h1>ASAP 文档中心</h1>
            <div class="documents-grid">
                ${generateDocumentCards(documentsList)}
            </div>
        </main>
    </div>
    <script src="./search.js"></script>
    <script>
        // 加载导航内容
        fetch('nav-data.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('nav-content').innerHTML = data.navigation;
            });
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(baseDir, 'index.html'), indexContent);

    // 复制样式和脚本文件
    fs.copyFileSync('styles.css', path.join(baseDir, 'styles.css'));
    fs.copyFileSync('search.js', path.join(baseDir, 'search.js'));
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
            <div class="preview">${doc.content.substring(0, 200)}...</div>
        </div>
    `).join('\n');
}

module.exports = generateStaticPages; 