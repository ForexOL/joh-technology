// JOH Technologies - Admin Portal Logic

const ADMIN_PASSWORD = 'JOH-ADMIN-2025';

// DOM Elements
let loginForm, loginSection, dashboardSection, passwordInput, errorMessage;

/**
 * Initialize admin page
 */
function initAdmin() {
  loginForm = document.getElementById('login-form');
  loginSection = document.getElementById('admin-login');
  dashboardSection = document.getElementById('admin-dashboard');
  passwordInput = document.getElementById('password');
  errorMessage = document.getElementById('error-message');
  
  // Check if already logged in (session storage)
  if (sessionStorage.getItem('joh-admin-auth') === 'true') {
    showDashboard();
  }
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
  e.preventDefault();
  
  const password = passwordInput.value;
  
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('joh-admin-auth', 'true');
    showDashboard();
    errorMessage.textContent = '';
  } else {
    errorMessage.textContent = 'Invalid password. Please try again.';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

/**
 * Show dashboard and hide login
 */
function showDashboard() {
  if (loginSection) loginSection.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.add('active');
  initCloudinaryWidget();
}

/**
 * Logout and show login form
 */
function logout() {
  sessionStorage.removeItem('joh-admin-auth');
  if (loginSection) loginSection.classList.remove('hidden');
  if (dashboardSection) dashboardSection.classList.remove('active');
  if (passwordInput) passwordInput.value = '';
}

/**
 * Initialize Cloudinary Upload Widget
 */
function initCloudinaryWidget() {
  // Check if Cloudinary is loaded
  if (typeof cloudinary === 'undefined') {
    console.warn('Cloudinary library not loaded. Upload widget will not function.');
    return;
  }
  
  const uploadButton = document.getElementById('upload-button');
  if (!uploadButton) return;
  
  // Get category selection
  const categorySelect = document.getElementById('upload-category');
  const priceInput = document.getElementById('upload-price');
  const descriptionInput = document.getElementById('upload-description');
  
  uploadButton.addEventListener('click', function() {
    const category = categorySelect?.value || 'uncategorized';
    const price = priceInput?.value || '';
    const description = descriptionInput?.value || '';
    
    if (!price) {
      alert('Please enter a price before uploading.');
      priceInput?.focus();
      return;
    }
    
    if (!description) {
      alert('Please enter a description before uploading.');
      descriptionInput?.focus();
      return;
    }
    
    // Create and open upload widget
    const widget = cloudinary.createUploadWidget({
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      folder: category,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFileSize: 10000000, // 10MB
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      context: {
        alt: price,
        caption: '', // Will be set from filename
        description: description
      },
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#003366',
          tabIcon: '#003366',
          menuIcons: '#003366',
          textDark: '#003366',
          textLight: '#FFFFFF',
          link: '#003366',
          action: '#003366',
          inactiveTabIcon: '#666666',
          error: '#FF0000',
          inProgress: '#003366',
          complete: '#25D366',
          sourceBg: '#F8FAFC'
        }
      }
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        console.log('Upload successful:', result.info);
        alert(`Product uploaded successfully!\n\nPublic ID: ${result.info.public_id}\nCategory: ${category}\nPrice: ${price}`);
        
        // Clear form
        if (priceInput) priceInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
      }
      
      if (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }
    });
    
    widget.open();
  });
}

/**
 * Toggle mobile navigation
 */
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.classList.toggle('active');
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initAdmin);
