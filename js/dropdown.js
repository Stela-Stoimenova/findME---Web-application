// Improved dropdown functionality with click support
document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll('.dropdown-categories, .dropdown-user, .dropdown-about');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (!button || !content) return;
        
        // Toggle dropdown on click
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherContent = otherDropdown.querySelector('.dropdown-content');
                    if (otherContent) {
                        otherContent.style.display = 'none';
                    }
                }
            });
            
            // Toggle current dropdown
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
        
        // Keep dropdown open when clicking inside
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                content.style.display = 'none';
            }
        });
    });
});
