// DOM Elements
const navLinks = document.querySelectorAll('.nav-list a');
const pdfViewer = document.getElementById('pdfViewer');
const welcomeScreen = document.getElementById('welcomeScreen');
const loading = document.getElementById('loading');
const currentTitle = document.getElementById('currentTitle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

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
});

// Function to load PDF
function loadPDF(filePath, title) {
    // Show loading state
    welcomeScreen.style.display = 'none';
    pdfViewer.style.display = 'none';
    loading.style.display = 'flex';
    
    // Update title
    currentTitle.textContent = title;
    
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

