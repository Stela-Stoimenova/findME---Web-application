// Global search and navbar category filters across all pages
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Handle global search from any page: navigate to interactive with q=
    const form = document.getElementById('global-search-form');
    const input = document.getElementById('global-search-input');
    if (form && input) {
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const q = (input.value || '').trim();
        if (!q) return;
        // If already on interactive page, update via query to trigger geocode handler
        const isInteractive = /interactive\.html$/i.test(location.pathname);
        if (isInteractive) {
          const url = new URL(window.location.href);
          url.searchParams.set('q', q);
          window.location.href = url.toString();
        } else {
          window.location.href = `../html/interactive.html?q=${encodeURIComponent(q)}`;
        }
      });
    }

    // Navbar category dropdown: filter in-place on interactive else navigate with category param
    document.querySelectorAll('.categories-content a[data-category]').forEach(link => {
      link.addEventListener('click', function(e){
        e.preventDefault();
        const cat = this.getAttribute('data-category') || 'all';
        const isInteractive = /interactive\.html$/i.test(location.pathname);
        if (isInteractive) {
          // Dispatch event to apply filter and scroll to section
          document.dispatchEvent(new CustomEvent('apply-category-filter', { detail: { category: cat } }));
          const filter = document.getElementById('filter-section');
          if (filter && typeof filter.scrollIntoView === 'function') {
            filter.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.location.href = `../html/interactive.html?category=${encodeURIComponent(cat)}`;
        }
      });
    });
  });
})();
