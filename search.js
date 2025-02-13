document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const navItems = document.querySelectorAll('.nav-item');
    const documentCards = document.querySelectorAll('.document-card');

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'block' : 'none';
        });

        documentCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}); 