// Wait for the entire HTML document to be loaded and parsed
document.addEventListener('DOMContentLoaded', function() {
    initFadeAnimations();
    initSmoothScrolling();
    initMobileNav();
    initBackToTopButton();
    initCopyrightYear();
    initDarkModeToggle();
    initLibraryTabsAndFilter(); // Initialize the library logic
    initImageGallery(); // <-- ADD THIS LINE
    initGalleryScroller(); // <-- ADD THIS LINE
});

function initCopyrightYear() {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Fades in sections of the page as they are scrolled into view.
 */
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('visible');
        }, 100);
    }
}

/**
 * Enables smooth scrolling for on-page navigation links.
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length) return;

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight || 70;
                const offsetTop = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Handles the logic for the mobile navigation (hamburger menu).
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        body.classList.toggle('nav-open');
    });
    
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
           body.classList.remove('nav-open');
        }
    });

    document.addEventListener('click', (e) => {
        if (body.classList.contains('nav-open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            body.classList.remove('nav-open');
        }
    });
}


/**
 * Manages the visibility and functionality of the "Back to Top" button.
 */
function initBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Highlights the active navigation link based on scroll position.
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;
    
    const navHeight = document.querySelector('.nav').offsetHeight || 70;
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 20;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

/**
 * Handles the logic for the dark mode toggle and persistence.
 */
function initDarkModeToggle() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (!toggleButton) return;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // Check for saved user preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check for OS-level preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine the initial theme
    let currentTheme = savedTheme || 'dark'; // This now defaults to 'dark' for new visitors

    
    // Apply the determined theme on initial load
    applyTheme(currentTheme);

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save the new preference
    });
}

/**
 * Handles the logic for the Scholar's Library tabs and filter,
 * ensuring the filter state is reset when the papers tab is activated.
 */
function initLibraryTabsAndFilter() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const researchFilter = document.getElementById('research-filter');
    const researchCategories = document.querySelectorAll('.research-category');
    const statusMessage = document.getElementById('filter-status-message');

    if (!tabButtons.length || !researchFilter) return; // Exit if essential elements are missing

    const resetFilterState = () => {
        researchFilter.selectedIndex = 0; // Set dropdown to "Select Research Area"
        researchCategories.forEach(category => {
            category.style.display = 'none'; // Hide all paper categories
        });
        if (statusMessage) {
            statusMessage.classList.remove('visible'); // Hide status message
        }
    };

    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update button active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update pane visibility
            tabPanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === targetTab + '-content');
            });

            // If the papers tab is the one being activated, reset its filter view
            if (targetTab === 'papers') {
                resetFilterState();
            }
        });
    });

    // Handle research area filtering
    researchFilter.addEventListener('change', () => {
        const selectedValue = researchFilter.value;
        const selectedOption = researchFilter.options[researchFilter.selectedIndex];
        const selectedText = selectedOption.text;

        // Default to hiding all categories. They will be explicitly shown below if needed.
        researchCategories.forEach(category => {
            category.style.display = 'none';
        });

        // Determine which categories to show
        if (selectedValue === 'all') {
            researchCategories.forEach(category => category.style.display = 'block');
        } else if (selectedValue) { // A specific category is chosen
            const categoryToShow = document.querySelector(`.research-category[data-area="${selectedValue}"]`);
            if (categoryToShow) categoryToShow.style.display = 'block';
        }
        // If selectedValue is "", all categories remain hidden.

        // Update the status message
        if (statusMessage) {
            if (selectedValue) {
                statusMessage.innerHTML = `Showing results for: <strong>${selectedText}</strong>`;
                statusMessage.classList.add('visible');
            } else {
                statusMessage.classList.remove('visible');
            }
        }
    });

    // Initial state check: if papers tab is active on load, ensure it's reset.
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'papers') {
        resetFilterState();
    }
}

/**
 * =============================================================
 * Handles the logic for the image gallery and lightbox modal.
 * =============================================================
 */
function initImageGallery() {
    const galleryLinks = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (!galleryLinks.length || !lightbox) return;

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');

    const imageSources = Array.from(galleryLinks).map(link => link.href);
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function updateLightboxImage() {
        lightboxImage.src = imageSources[currentIndex];
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        updateLightboxImage();
    }

    galleryLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close if the dark overlay is clicked, but not the content inside it
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
}

/**
 * =============================================================
 * Handles the logic for the horizontal gallery scroller buttons.
 * =============================================================
 */
function initGalleryScroller() {
    const wrapper = document.querySelector('.gallery-scroller-wrapper');
    if (!wrapper) return;

    const scroller = wrapper.querySelector('.gallery-scroller');
    const prevBtn = wrapper.querySelector('.gallery-nav-button.prev');
    const nextBtn = wrapper.querySelector('.gallery-nav-button.next');

    function updateButtonState() {
        const scrollLeft = scroller.scrollLeft;
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;

        // Show/hide previous button
        prevBtn.classList.toggle('visible', scrollLeft > 0);
        // Show/hide next button
        nextBtn.classList.toggle('visible', scrollLeft < maxScroll - 1); // -1 for precision
    }

    nextBtn.addEventListener('click', () => {
        const scrollAmount = scroller.clientWidth * 0.8; // Scroll 80% of the visible width
        scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        const scrollAmount = scroller.clientWidth * 0.8;
        scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Update buttons when the user scrolls manually
    scroller.addEventListener('scroll', updateButtonState);
    
    // Check state on initial load
    // Use a small timeout to ensure layout is fully calculated
    setTimeout(updateButtonState, 100);
}
