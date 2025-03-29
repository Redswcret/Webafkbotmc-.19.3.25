import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    ref, 
    set,
    get
} from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    // UI Elemente
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    // Tab-Umschaltung
    loginTab.addEventListener('click', () => switchTabs(true));
    registerTab.addEventListener('click', () => switchTabs(false));

    // Login Funktion
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Check verification in database
            const userRef = ref(db, 'users/' + user.uid);
            const snapshot = await get(userRef);
            
            if (!user.emailVerified) {
                alert("Bitte verifiziere deine Email zuerst! Wir haben dir einen Link gesendet.");
                await signOut(auth);
                return;
            }
            
            if (snapshot.exists() && snapshot.val().verified !== false) {
                alert(`Erfolgreich eingeloggt als: ${user.email}`);
                // Weiterleitung zur Dashboard-Seite
                window.location.href = "dashboard.html";
            } else {
                alert("Dein Account muss noch vom Admin verifiziert werden.");
                await signOut(auth);
            }
        } catch (error) {
            alert(`Login fehlgeschlagen: ${error.message}`);
        }
    });

    // Registrierungs Funktion
    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            alert("Passwörter stimmen nicht überein!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Verifizierungsemail senden
            await sendEmailVerification(user);
            
            // Benutzerdaten in Datenbank speichern
            await set(ref(db, 'users/' + user.uid), {
                username: username,
                email: email,
                verified: false, // Erst nach Email-Verifizierung true
                createdAt: new Date().toISOString()
            });

            alert(`Registrierung erfolgreich! Verifizierungsemail wurde an ${email} gesendet.`);
            
            // User ausloggen bis verifiziert
            await signOut(auth);
            
            // Zurück zum Login
            switchTabs(true);
        } catch (error) {
            alert(`Registrierung fehlgeschlagen: ${error.message}`);
        }
    });

    function switchTabs(isLogin) {
        loginTab.classList.toggle('active', isLogin);
        registerTab.classList.toggle('active', !isLogin);
        loginForm.style.display = isLogin ? 'block' : 'none';
        registerForm.style.display = isLogin ? 'none' : 'block';
    }
});
