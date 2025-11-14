// DOM Elements
const navLinks = document.querySelectorAll('.nav-list a');
const pdfViewer = document.getElementById('pdfViewer');
const welcomeScreen = document.getElementById('welcomeScreen');
const loading = document.getElementById('loading');
const currentTitle = document.getElementById('currentTitle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const backToHomeBtn = document.getElementById('backToHome');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = link.getAttribute('data-file');
            const title = link.textContent.trim();
            loadPDF(filePath, title);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Menu toggle for mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Back to Home button functionality
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            goToHome();
        });
    }

    // Stat button functionality - scroll to category in sidebar
    const statButtons = document.querySelectorAll('.stat-item');
    statButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            scrollToCategory(category);
        });
    });
});

// Function to load PDF
function loadPDF(filePath, title) {
    // Show loading state
    welcomeScreen.style.display = 'none';
    pdfViewer.style.display = 'none';
    loading.style.display = 'flex';
    
    // Update title
    currentTitle.textContent = title;
    currentTitle.classList.remove('animated-title');
    
    // Show Back to Home button
    if (backToHomeBtn) {
        backToHomeBtn.style.display = 'flex';
    }
    
    // Create a new iframe to load the PDF
    // Use a small delay to show loading animation
    setTimeout(() => {
        // Encode the file path properly
        const encodedPath = encodeURIComponent(filePath).replace(/'/g, "%27");
        
        // Set the PDF source
        pdfViewer.src = filePath + '#toolbar=1&navpanes=1&scrollbar=1';
        
        // Handle PDF load
        pdfViewer.onload = () => {
            loading.style.display = 'none';
            pdfViewer.style.display = 'block';
        };
        
        // Handle PDF load error
        pdfViewer.onerror = () => {
            loading.style.display = 'none';
            showError('Failed to load the PDF. Please check if the file exists.');
        };
        
        // Fallback: if onload doesn't fire, show PDF after a delay
        setTimeout(() => {
            if (loading.style.display !== 'none') {
                loading.style.display = 'none';
                pdfViewer.style.display = 'block';
            }
        }, 2000);
    }, 300);
}

// Function to go back to home
function goToHome() {
    // Hide PDF viewer
    pdfViewer.style.display = 'none';
    pdfViewer.src = '';
    
    // Show welcome screen
    welcomeScreen.style.display = 'flex';
    
    // Hide Back to Home button
    if (backToHomeBtn) {
        backToHomeBtn.style.display = 'none';
    }
    
    // Reset title
    currentTitle.textContent = 'Select A Genre to Start Reading';
    currentTitle.classList.add('animated-title');
    
    // Remove active state from all nav links
    navLinks.forEach(link => link.classList.remove('active'));
}

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3 style="margin-bottom: 0.5rem; color: #dc2626;">Error</h3>
        <p style="color: #64748b;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
        ">OK</button>
    `;
    document.body.appendChild(errorDiv);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
});

// Function to scroll to category in sidebar
function scrollToCategory(category) {
    // Map category names to section headings (matching the actual HTML text)
    const categoryMap = {
        'essays': 'Essays',
        'plays': 'One-Act Plays',
        'poems': 'Poems',
        'stories': 'Short Stories'
    };

    const categoryName = categoryMap[category];
    if (!categoryName) return;

    // Find the category heading in the sidebar
    const categoryHeadings = document.querySelectorAll('.nav-category');
    let targetHeading = null;

    categoryHeadings.forEach(heading => {
        // Compare the actual text content (not the displayed uppercase version)
        if (heading.textContent.trim() === categoryName) {
            targetHeading = heading;
        }
    });

    if (targetHeading) {
        // Open sidebar on mobile if closed
        if (window.innerWidth <= 768) {
            sidebar.classList.add('open');
        }

        // Scroll to the category section
        setTimeout(() => {
            targetHeading.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });

            // Highlight the category section briefly
            const navSection = targetHeading.closest('.nav-section');
            if (navSection) {
                navSection.style.transition = 'background-color 0.3s ease';
                navSection.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                
                setTimeout(() => {
                    navSection.style.backgroundColor = '';
                }, 2000);
            }
        }, 100);
    }
}

// Smooth scroll for navigation
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Smooth scroll to top of viewer
        document.querySelector('.pdf-viewer-container').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

