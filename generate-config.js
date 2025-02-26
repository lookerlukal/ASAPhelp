const fs = require('fs');
const path = require('path');

// 扫描项目根目录下的所有子目录
const targetDir = process.argv[2] || path.join(__dirname);

const scanDirectory = (dir) => {
    console.log(`正在扫描目录: ${dir}`);
    const result = {
        name: path.basename(dir),
        type: 'directory',
        children: []
    };

    const files = fs.readdirSync(dir, { encoding: 'utf-8' });
    console.log('找到文件列表:', files);
    console.log('扫描目录:', dir);
    console.log('找到文件数:', files.length);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        console.log('扫描文件:', fullPath); // 添加调试日志
        if (file === '.git') return; // 跳过.git目录
        if (fs.statSync(fullPath).isDirectory()) {
            const childDir = scanDirectory(fullPath);
            if (true) { // 恢复目录处理
                console.log('保留目录:', fullPath);
                result.children.push(childDir);
            }
        } else if ([".html", ".INR", ".inr"].includes(path.extname(file).toLowerCase())) {
            console.log('发现有效文件:', file);
            result.children.push({
                name: file,
                type: 'file',
                category: path.extname(file).slice(1).toUpperCase(),
                lastModified: fs.statSync(fullPath).mtime.toISOString(),
                size: fs.statSync(fullPath).size
            });
        }
    });

    return result;
};

const config = {
    siteStructure: {
        name: "根目录",
        type: "directory",
        children: scanDirectory(path.resolve(targetDir)).children
    }
};

fs.writeFileSync('site-config.json', JSON.stringify(config, null, 2));
console.log(`配置已生成，扫描目录：${targetDir}`); 