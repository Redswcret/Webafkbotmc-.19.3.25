document.addEventListener('DOMContentLoaded', function() {
    // Tabs umschalten
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Login/Register-Buttons
    document.getElementById('login-btn').addEventListener('click', () => {
        alert('Login attempt (simulated)');
    });

    document.getElementById('register-btn').addEventListener('click', () => {
        alert('Verification email sent from: verify.mcbot@gmail.com');
    });
});