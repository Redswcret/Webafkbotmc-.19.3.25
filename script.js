import { 
  auth, 
  db, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  ref, 
  set,
  get,
  functions
} from './firebase.js';

// Cloud Function Referenz
const sendVerificationEmail = functions.httpsCallable('sendVerificationEmail');

registerBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const username = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;
  const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
  const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    // 1. Benutzer erstellen
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 2. Benutzerdaten speichern
    await set(ref(db, `users/${user.uid}`), {
      username,
      email,
      verified: false,
      createdAt: new Date().toISOString()
    });
    
    // 3. Verifizierungsemail senden
    const result = await sendVerificationEmail({
      email: user.email,
      displayName: username
    });
    
    alert(`Verification email sent to ${user.email}`);
    await signOut(auth);
    switchTabs(true);
    
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  }
});
