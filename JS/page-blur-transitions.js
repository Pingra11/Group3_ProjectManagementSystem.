
// ====================== PAGE BLUR TRANSITIONS ======================

document.addEventListener('DOMContentLoaded', function() {
    // Add blur transition to all navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .logo-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add blur effect
            document.body.classList.add('page-transitioning');
            
            // Get the href attribute
            const href = this.getAttribute('href');
            
            // Navigate after short delay
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        });
    });
    
    // Handle logout button with confirmation
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                document.body.classList.add('page-transitioning');
                setTimeout(() => {
                    // Try to close the current tab/window
                    try {
                        window.close();
                    } catch (error) {
                        // If window.close() doesn't work (some browsers restrict it),
                        // redirect to a blank page or show a logout message
                        document.body.innerHTML = `
                            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: 'Inter', sans-serif; text-align: center;">
                                <div>
                                    <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Logged Out Successfully</h1>
                                    <p style="font-size: 1.2rem; margin-bottom: 2rem;">You have been logged out of the Project Management System.</p>
                                    <p style="font-size: 1rem; color: #cbd5e1;">You can safely close this tab or window.</p>
                                </div>
                            </div>
                        `;
                    }
                }, 150);
            }
        });
    }
});
