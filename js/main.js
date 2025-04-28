/**
 * Main JavaScript for Saudi AI Contracts
 * Handles language switching, mobile menu, file upload, and other interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const htmlTag = document.documentElement;
    const languageSwitcher = document.getElementById('language-switcher');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-upload');
    const arTexts = document.querySelectorAll('.ar-text');
    const enTexts = document.querySelectorAll('.en-text');
    
    // Initialize language based on HTML lang attribute
    initializeLanguage();
    
    // Language Switcher
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', toggleLanguage);
    }
    
    // Mobile Menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }
    
    if (closeMenuButton && mobileMenu) {
        closeMenuButton.addEventListener('click', closeMobileMenu);
    }
    
    // File Upload
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', triggerFileInput);
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Add animation classes to elements
    setupAnimations();
    
    /**
     * Initialize language display based on HTML lang attribute
     */
    function initializeLanguage() {
        const currentLang = htmlTag.getAttribute('lang') || 'ar';
        
        if (currentLang === 'ar') {
            showArabicText();
        } else {
            showEnglishText();
        }
    }
    
    /**
     * Toggle between Arabic and English languages
     */
    function toggleLanguage() {
        if (htmlTag.getAttribute('lang') === 'ar') {
            // Switch to English
            htmlTag.setAttribute('lang', 'en');
            htmlTag.setAttribute('dir', 'ltr');
            showEnglishText();
        } else {
            // Switch to Arabic
            htmlTag.setAttribute('lang', 'ar');
            htmlTag.setAttribute('dir', 'rtl');
            showArabicText();
        }
    }
    
    /**
     * Show Arabic text and hide English text
     */
    function showArabicText() {
        arTexts.forEach(el => el.classList.remove('hidden'));
        enTexts.forEach(el => el.classList.add('hidden'));
    }
    
    /**
     * Show English text and hide Arabic text
     */
    function showEnglishText() {
        arTexts.forEach(el => el.classList.add('hidden'));
        enTexts.forEach(el => el.classList.remove('hidden'));
    }
    
    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }
    
    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    /**
     * Trigger file input click when upload area is clicked
     */
    function triggerFileInput() {
        fileInput.click();
    }
    
    /**
     * Handle file selection from input
     */
    function handleFileSelect() {
        if (fileInput.files.length > 0) {
            updateFileInfo(fileInput.files[0]);
        }
    }
    
    /**
     * Handle dragover event
     * @param {Event} e - The dragover event
     */
    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    }
    
    /**
     * Handle dragleave event
     * @param {Event} e - The dragleave event
     */
    function handleDragLeave(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    }
    
    /**
     * Handle drop event
     * @param {Event} e - The drop event
     */
    function handleDrop(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFileInfo(e.dataTransfer.files[0]);
        }
    }
    
    /**
     * Update file information display
     * @param {File} file - The selected file
     */
    function updateFileInfo(file) {
        const uploadText = uploadArea.querySelector('.upload-text');
        const currentLang = htmlTag.getAttribute('lang') || 'ar';
        
        if (uploadText) {
            if (currentLang === 'ar') {
                uploadText.innerHTML = `تم اختيار: ${file.name}`;
            } else {
                uploadText.innerHTML = `Selected: ${file.name}`;
            }
        }
        
        // Add a selected class to the upload area
        uploadArea.classList.add('file-selected');
    }
    
    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                    
                    // Scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * Setup animations for elements
     */
    function setupAnimations() {
        // Add animation classes to elements that should animate on scroll
        const animatedElements = document.querySelectorAll('.hero-image, .trust-item, .regulation-item, .step-item, .plan-card');
        
        // Simple animation on scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(el => {
                el.classList.add('will-animate');
                observer.observe(el);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            animatedElements.forEach(el => {
                el.classList.add('animate-in');
            });
        }
    }
    
    /**
     * Form submission handling
     */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const feedbackType = document.getElementById('feedback-type').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !feedbackType || !message) {
                showFormMessage('error', 
                    htmlTag.getAttribute('lang') === 'ar' 
                        ? 'يرجى ملء جميع الحقول المطلوبة' 
                        : 'Please fill in all required fields'
                );
                return;
            }
            
            // Simulate form submission
            showFormMessage('success', 
                htmlTag.getAttribute('lang') === 'ar' 
                    ? 'تم إرسال ملاحظتك بنجاح! سنتواصل معك قريبًا.' 
                    : 'Your feedback has been sent successfully! We will contact you soon.'
            );
            
            // Reset form
            contactForm.reset();
        });
    }
    
    /**
     * Show form submission message
     * @param {string} type - Message type ('success' or 'error')
     * @param {string} message - Message text
     */
    function showFormMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add to form
        if (contactForm) {
            contactForm.appendChild(messageElement);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
    
    /**
     * Add CSS class for styling form message
     */
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .form-message.success {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10B981;
            border: 1px solid #10B981;
        }
        .form-message.error {
            background-color: rgba(239, 68, 68, 0.1);
            color: #EF4444;
            border: 1px solid #EF4444;
        }
        .will-animate {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .drag-over {
            border-color: var(--primary);
            background-color: rgba(30, 64, 175, 0.05);
        }
        .file-selected {
            border-color: var(--primary);
            background-color: rgba(30, 64, 175, 0.05);
        }
    `;
    document.head.appendChild(style);
});
