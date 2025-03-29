const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp();

const gmailEmail = 'verify.mcbot@gmail.com';
const gmailPassword = 'bhwz jyov pidg udgt'; // Ihr App-Passwort

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
  const { email, displayName } = data;
  
  // Verifizierungslink erstellen
  const user = await admin.auth().getUserByEmail(email);
  const verificationLink = `https://yourdomain.com/verify?uid=${user.uid}&token=${await admin.auth().createCustomToken(user.uid)}`;

  const mailOptions = {
    from: `Herobrine AFK Bot <${gmailEmail}>`,
    to: email,
    subject: 'Verify Your Herobrine AFK Bot Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Herobrine AFK Bot</h1>
        <h2>Account Verification</h2>
        <p>Hello ${displayName},</p>
        <p>Please verify your email address to activate your Herobrine AFK Bot account:</p>
        <a href="${verificationLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Verify Email
        </a>
        <p>Or copy this link to your browser:<br>
        <code style="word-break: break-all;">${verificationLink}</code></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p>© ${new Date().getFullYear()} Herobrine AFK Bot</p>
      </div>
    `
  };

  try {
    await mailTransport.sendMail(mailOptions);
    await admin.database().ref(`users/${user.uid}`).update({ verificationSent: true });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send verification email');
  }
});
