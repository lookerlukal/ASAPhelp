<?php
$filePath = $_GET['path'] ?? '';
$fileContent = '';
$fileName = basename($filePath);

if (file_exists($filePath)) {
    $fileContent = file_get_contents($filePath);
} else {
    header("HTTP/1.0 404 Not Found");
    $fileContent = "文件未找到";
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($fileName); ?> - ASAP文档</title>
    <meta name="description" content="ASAP文档 - <?php echo htmlspecialchars($fileName); ?>">
    <meta name="robots" content="index, follow">
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        .content {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
            font-family: Consolas, monospace;
        }
        .header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #2b6eb5;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="content">
        <a href="/" class="back-link">← 返回文档中心</a>
        <div class="header">
            <h1><?php echo htmlspecialchars($fileName); ?></h1>
        </div>
        <pre><?php echo htmlspecialchars($fileContent); ?></pre>
    </div>
</body>
</html> 