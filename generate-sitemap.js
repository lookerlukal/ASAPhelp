const generateSitemap = (config) => {
    const urls = config.siteStructure.children
        .filter(item => item.type === 'file')
        .map(item => `
            <url>
                <loc>https://asaphelp.example.com/${item.name}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
            </url>
        `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
    </urlset>`;
}; 