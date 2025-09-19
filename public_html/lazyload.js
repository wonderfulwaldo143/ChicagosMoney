// Lazy Loading for Images - Chicago's Money
// Improves page load performance by loading images only when needed

(function() {
    'use strict';
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        loadAllImages();
        return;
    }
    
    // Configuration
    const config = {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    };
    
    // Create observer
    const imageObserver = new IntersectionObserver(onIntersection, config);
    
    // Observe all images with data-src attribute
    function init() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            imageObserver.observe(img);
        });
        
        // Also handle background images
        const bgElements = document.querySelectorAll('[data-bg]');
        bgElements.forEach(el => {
            imageObserver.observe(el);
        });
    }
    
    // Handle intersection
    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                imageObserver.unobserve(entry.target);
            }
        });
    }
    
    // Load individual image
    function loadImage(element) {
        if (element.dataset.src) {
            // Regular image
            const img = new Image();
            img.onload = () => {
                element.src = element.dataset.src;
                element.classList.add('loaded');
                delete element.dataset.src;
            };
            img.onerror = () => {
                element.classList.add('error');
            };
            img.src = element.dataset.src;
        } else if (element.dataset.bg) {
            // Background image
            const img = new Image();
            img.onload = () => {
                element.style.backgroundImage = `url(${element.dataset.bg})`;
                element.classList.add('loaded');
                delete element.dataset.bg;
            };
            img.src = element.dataset.bg;
        }
    }
    
    // Fallback: load all images
    function loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            delete img.dataset.src;
        });
        
        const bgElements = document.querySelectorAll('[data-bg]');
        bgElements.forEach(el => {
            el.style.backgroundImage = `url(${el.dataset.bg})`;
            delete el.dataset.bg;
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for manual triggering if needed
    window.lazyLoadImages = init;
})();

// Usage Instructions:
// 1. Add to HTML: <script src="lazyload.js" defer></script>
// 2. For images: <img data-src="image.jpg" class="lazy" alt="Description">
// 3. For backgrounds: <div data-bg="background.jpg" class="lazy-bg"></div>
// 4. Add CSS transition: .lazy.loaded { animation: fadeIn 0.3s; }