// Define global variables
let secretKey = ''; 
let twoFactorSetup;
let decryptAttempts = 0;
const maxDecryptAttempts = 5;
let decryptLockoutTime = null;
const lockoutDuration = 30000; // 30 seconds

// Wrap all initial DOM elements in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements after document is ready
    const passwordInput = document.getElementById("password");
    const passwordStrength = document.getElementById("password-strength");
    const twoFactorAuth = document.getElementById('twoFactorAuth');
    const generatePassword = document.getElementById('generatePassword');
    const passwordOptions = document.getElementById('passwordOptions');
    
    // Initialize password strength meter
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener("input", function () {
            updatePasswordStrength(passwordInput.value);
        });
    }
    
    // Initialize password generator
    if (generatePassword && passwordOptions) {
        generatePassword.addEventListener('click', function() {
            const currentDisplay = passwordOptions.style.display;
            passwordOptions.style.display = currentDisplay === 'none' ? 'block' : 'none';
            if (currentDisplay === 'none') {
                generateRandomPassword();
            }
        });
    }

    // Initialize 2FA setup
    twoFactorSetup = document.getElementById('twoFactorSetup');
    if (twoFactorAuth) {
        twoFactorAuth.addEventListener('change', function() {
            if (this.checked) {
                secretKey = generateSecretKey(); 
                setupTwoFactorAuth(); 
                twoFactorSetup.style.display = 'block';
            } else {
                twoFactorSetup.style.display = 'none';
                document.getElementById('qrCode').innerHTML = '';
                secretKey = '';
            }
        });
    }
    
    // Initialize rest of the DOM listeners
    initializePasswordToggles();
    initializeCopyButtons();
    initializeURLShortening();
    initializeClearButtons();
    initializeCopyURL();
    initializeDownloadButton();
    
    // Helper function to initialize password toggles
    function initializePasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Helper function to initialize copy buttons
    function initializeCopyButtons() {
        document.querySelectorAll('.copy-password').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                
                navigator.clipboard.writeText(passwordInput.value).then(() => {
                    const icon = this.querySelector('i');
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    setTimeout(() => {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                    }, 2000);
                });
            });
        });
    }
    
    // Helper function to initialize URL shortening checkbox
    function initializeURLShortening() {
        const useShortUrlCheckbox = document.getElementById('useShortUrl');
        if (useShortUrlCheckbox) {
            useShortUrlCheckbox.addEventListener('change', function() {
                const shortUrlWarning = document.getElementById('shortUrlWarning');
                if (shortUrlWarning) {
                    shortUrlWarning.style.display = this.checked ? 'block' : 'none';
                }
            });
        }
    }
    
    // Helper function to initialize clear buttons
    function initializeClearButtons() {
        const clearInputText = document.getElementById("clearInputText");
        if (clearInputText) {
            clearInputText.addEventListener("click", function () {
                document.getElementById("inputText").value = "";
            });
        }
        
        const clearDecryptedText = document.getElementById("clearDecryptedText");
        if (clearDecryptedText) {
            clearDecryptedText.addEventListener("click", function () {
                document.getElementById("decryptedText").value = "";
            });
        }
    }
    
    // Helper function to initialize copy URL button
    function initializeCopyURL() {
        const copyURLBtn = document.getElementById("copyURL");
        if (copyURLBtn) {
            copyURLBtn.addEventListener("click", function () {
                const urlInput = document.getElementById("encryptedURL");
                const messageSpan = document.getElementById("url-copy-message");
                const copyBtn = this;
                
                if (!urlInput.value) {
                    messageSpan.textContent = "No URL to copy";
                    messageSpan.style.color = "red";
                    setTimeout(() => messageSpan.textContent = "", 2000);
                    return;
                }
                
                navigator.clipboard.writeText(urlInput.value)
                    .then(function () {
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                        copyBtn.style.background = "rgba(34, 197, 94, 0.2)";
                        copyBtn.style.borderColor = "#22c55e";
                        
                        messageSpan.textContent = "URL Copied!";
                        messageSpan.style.color = "lightgreen";
                        
                        setTimeout(() => {
                            copyBtn.innerHTML = 'Copy';
                            copyBtn.style.background = "rgba(255, 255, 255, .05)";
                            copyBtn.style.borderColor = "rgba(255, 255, 255, .1)";
                            messageSpan.textContent = "";
                        }, 2000);
                    }).catch(function (error) {
                        messageSpan.textContent = "Could not copy URL";
                        messageSpan.style.color = "red";
                        setTimeout(() => messageSpan.textContent = "", 2000);
                        console.error("Could not copy URL:", error);
                    });
            });
        }
    }
    
    // Helper function to initialize download button
    function initializeDownloadButton() {
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', handleDownload);
        }
    }
    
    // Function to update password strength inside DOM ready
    function updatePasswordStrength(password) {
        if (!passwordStrength) return;
        
        if (!password) {
            passwordStrength.textContent = '';
            passwordStrength.className = '';
            return;
        }
        
        const result = zxcvbn(password);
        let strengthMessage = '';
        let strengthClass = '';
        
        switch (result.score) {
            case 0: 
                strengthMessage = 'Very weak'; 
                strengthClass = 'very-weak';
                break;
            case 1: 
                strengthMessage = 'Weak'; 
                strengthClass = 'weak';
                break;
            case 2: 
                strengthMessage = 'Fair'; 
                strengthClass = 'fair';
                break;
            case 3: 
                strengthMessage = 'Good'; 
                strengthClass = 'good';
                break;
            case 4: 
                strengthMessage = 'Strong'; 
                strengthClass = 'strong';
                break;
        }
        
        // Use textContent instead of innerHTML to prevent XSS
        passwordStrength.textContent = '';
        const strengthSpan = document.createElement('span');
        strengthSpan.className = 'strength-text';
        strengthSpan.textContent = `Password Strength: ${strengthMessage}`;
        passwordStrength.appendChild(strengthSpan);
        
        passwordStrength.className = '';
        passwordStrength.classList.add(strengthClass);
    }
});

async function shortenURL(longURL) {
    // Validate URL before sending to external service
    try {
        new URL(longURL); // This will throw if the URL is invalid
    } catch (e) {
        console.error("Invalid URL:", e);
        return null;
    }
    
    const apiURL = 'https://is.gd/create.php';
    const postData = new URLSearchParams();
    postData.append('url', longURL);
    postData.append('format', 'simple');

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
            timeout: 5000
        });
        
        if (!response.ok) {
            throw new Error(`Failed to shorten URL: ${response.status} ${response.statusText}`);
        }
        
        const shortURL = await response.text();
        
        // Validate the returned URL is properly formatted
        if (!shortURL || !shortURL.startsWith('http')) {
            throw new Error('Invalid shortened URL returned');
        }
        
        return shortURL;
    } catch (error) {
        console.error("Error shortening URL:", error);
        return null;
    }
}

function generateRandomPassword() {
    const lengthInput = document.getElementById('passwordLength');
    let length = parseInt(lengthInput.value);
    
    // Validate password length - ensure it's between 8 and 64
    if (isNaN(length) || length < 8) {
        length = 8;
        lengthInput.value = 8;
    } else if (length > 64) {
        length = 64;
        lengthInput.value = 64;
    }

    const useUppercase = document.getElementById('useUppercase').checked;
    const useLowercase = document.getElementById('useLowercase').checked;
    const useNumbers = document.getElementById('useNumbers').checked;
    const useSpecial = document.getElementById('useSpecial').checked;

    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
        alert('Please select at least one character type');
        return;
    }

    // Ensure all selected character types are included in the password
    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    // Make sure each character type is included if selected
    let requiredChars = [];
    if (useUppercase) requiredChars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26)));
    if (useLowercase) requiredChars.push('abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26)));
    if (useNumbers) requiredChars.push('0123456789'.charAt(Math.floor(Math.random() * 10)));
    if (useSpecial) requiredChars.push('!@#$%^&*()_+-=[]{}|;:,.<>?'.charAt(Math.floor(Math.random() * 23)));
    
    // Build the password with the required characters first
    for (let i = 0; i < requiredChars.length; i++) {
        password += requiredChars[i];
    }
    
    // Fill the rest of the password with random characters
    for (let i = requiredChars.length; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    document.getElementById('password').value = password;
    document.getElementById('confirmPassword').value = password;
    
    updatePasswordStrength(password);
}

async function handleEncrypt() {
    const inputText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const encryptionMessage = document.getElementById("encryption-message");
    
    // Validate expiration days - ensure it's a positive number
    let expirationDays = parseInt(document.getElementById("expirationDays").value, 10);
    if (isNaN(expirationDays) || expirationDays < 1) {
        expirationDays = 7; // Default to 7 days if invalid
        document.getElementById("expirationDays").value = 7;
    } else if (expirationDays > 365) {
        expirationDays = 365; // Max 1 year expiration
        document.getElementById("expirationDays").value = 365;
    }
    
    const algorithm = document.getElementById("encryptionAlgorithm").value;

    if (!inputText) {
        encryptionMessage.textContent = "Please enter text to encrypt";
        encryptionMessage.style.color = "red";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
        return;
    }

    if (twoFactorAuth && twoFactorAuth.checked) {
        const totpCode = document.getElementById('totpCode').value.trim();
        if (!totpCode) {
            encryptionMessage.textContent = "Please enter your 2FA code";
            encryptionMessage.style.color = "red";
            setTimeout(() => encryptionMessage.textContent = "", 2000);
            return;
        }
        
        // Validate TOTP code format
        if (!/^\d{6}$/.test(totpCode)) {
            encryptionMessage.textContent = "2FA code must be 6 digits";
            encryptionMessage.style.color = "red";
            setTimeout(() => encryptionMessage.textContent = "", 2000);
            return;
        }
        
        // Use time window validation instead of exact match
        if (!validateTOTP(totpCode, secretKey)) {
            encryptionMessage.textContent = "Invalid 2FA code";
            encryptionMessage.style.color = "red";
            setTimeout(() => encryptionMessage.textContent = "", 2000);
            return;
        }
    }

    if (password !== confirmPassword) {
        encryptionMessage.textContent = "Passwords do not match";
        encryptionMessage.style.color = "red";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
        return;
    }
    if (password.length < 8) {
        encryptionMessage.textContent = "Password must be at least 8 characters";
        encryptionMessage.style.color = "red";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
        return;
    }

    // Validate algorithm selection
    if (!['aes', 'rsa', 'multi'].includes(algorithm)) {
        encryptionMessage.textContent = "Invalid encryption algorithm";
        encryptionMessage.style.color = "red";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
        return;
    }

    const iterations = 10000;
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: iterations,
    });

    let encrypted;
    let algorithmPrefix;

    try {
        switch(algorithm) {
            case 'rsa':
                encrypted = CryptoJS.AES.encrypt(inputText, key, { iv: salt });
                algorithmPrefix = 'AES';
                break;
            case 'multi':
                const firstPass = CryptoJS.AES.encrypt(inputText, key, { iv: salt });
                encrypted = CryptoJS.AES.encrypt(firstPass.toString(), key, { iv: salt });
                algorithmPrefix = 'MULTI';
                break;
            default:
                encrypted = CryptoJS.AES.encrypt(inputText, key, { iv: salt });
                algorithmPrefix = 'AES';
        }

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + expirationDays);
        const encoded = `${algorithmPrefix}:${salt.toString()}:${encrypted}:${expirationTime.getTime()}`;
        const longURL = `${window.location.origin}${window.location.pathname}#${encoded}`;
        
        // Only shorten URL if checkbox is checked
        const useShortUrl = document.getElementById('useShortUrl')?.checked || false;
        
        if (useShortUrl) {
            try {
                const shortURL = await shortenURL(longURL);
                if (shortURL) {
                    document.getElementById("encryptedURL").value = shortURL;
                } else {
                    document.getElementById("encryptedURL").value = longURL;
                }
            } catch (error) {
                console.error("Error shortening URL:", error);
                document.getElementById("encryptedURL").value = longURL;
            }
        } else {
            document.getElementById("encryptedURL").value = longURL;
        }

        encryptionMessage.textContent = "Encryption Success";
        encryptionMessage.style.color = "lightgreen";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
    } catch (error) {
        console.error("Encryption error:", error);
        encryptionMessage.textContent = "Encryption failed. Please try again.";
        encryptionMessage.style.color = "red";
        setTimeout(() => encryptionMessage.textContent = "", 2000);
    }
}

function generateSecretKey() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    
    const array = new Uint32Array(20);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < 20; i++) {
        secret += charset[array[i] % charset.length];
    }
    
    return secret;
}

function setupTwoFactorAuth() {
    const qrCode = document.getElementById('qrCode');
    if (!qrCode) return;
    
    qrCode.innerHTML = '';
    
    // Add a timestamp to prevent reuse attacks
    const timestamp = Date.now();
    // Use a more specific account name for better user identification
    const accountName = `ProjectCodeX-A:User-${timestamp}`;
    
    // Properly encode the URI components
    const otpauth = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${encodeURIComponent(secretKey)}&issuer=${encodeURIComponent('ProjectCodeX-A')}&algorithm=SHA1&digits=6&period=30`;
    
    // Create QR code
    new QRCode(qrCode, {
        text: otpauth,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Display the secret key for manual entry
    const secretDisplay = document.createElement('div');
    secretDisplay.className = 'secret-key';
    secretDisplay.textContent = `Secret key: ${secretKey}`;
    qrCode.parentNode.insertBefore(secretDisplay, qrCode.nextSibling);
}

function base32ToBuffer(base32) {
    if (!base32 || typeof base32 !== 'string') {
        console.error('Invalid base32 input');
        return new Uint8Array(0);
    }

    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let buffer = [];

    base32 = base32.toUpperCase().replace(/=+$/, '');
    
    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.charAt(i));
        if (val === -1) {
            console.warn('Invalid character in base32 string:', base32.charAt(i));
            continue;
        }
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
        buffer.push(parseInt(bits.substr(i, 8), 2));
    }

    return new Uint8Array(buffer);
}

function generateTOTP(secret, time = Date.now()) {
    if (!secret || typeof secret !== 'string') {
        console.error('Invalid secret for TOTP generation');
        return '';
    }
    
    const period = 30;
    const counter = Math.floor(time / 1000 / period);
    
    try {
        const key = base32ToBuffer(secret);
        if (key.length === 0) {
            throw new Error('Empty key after base32 conversion');
        }
        
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setBigInt64(0, BigInt(counter), false);
        
        const hmac = CryptoJS.HmacSHA1(
            CryptoJS.lib.WordArray.create(buffer), 
            CryptoJS.lib.WordArray.create(key)
        );
        const hash = hmac.toString(CryptoJS.enc.Hex);
        
        const offset = parseInt(hash.slice(-1), 16);
        const truncatedHash = parseInt(hash.substr(offset * 2, 8), 16) & 0x7fffffff;
        const code = truncatedHash % 1000000;
        
        return code.toString().padStart(6, '0');
    } catch (error) {
        console.error('Error generating TOTP:', error);
        return '';
    }
}

// Add TOTP validation with time window to mitigate timing issues
function validateTOTP(inputCode, secret) {
    if (!secret || !inputCode || !/^\d{6}$/.test(inputCode)) {
        return false;
    }
    
    // Check current time window and adjacent windows to allow for clock skew
    const now = Date.now();
    const windowSize = 30 * 1000; // 30 seconds in milliseconds
    
    // Check current window and one window before/after
    for (let i = -1; i <= 1; i++) {
        const windowTime = now + (i * windowSize);
        const expectedCode = generateTOTP(secret, windowTime);
        
        if (inputCode === expectedCode) {
            return true;
        }
    }
    
    return false;
}

async function handleDecrypt() {
    const decryptionMessage = document.getElementById("decryption-message");
    
    // Check if user is locked out
    if (decryptLockoutTime && Date.now() < decryptLockoutTime) {
        const remainingTime = Math.ceil((decryptLockoutTime - Date.now()) / 1000);
        decryptionMessage.textContent = `Too many attempts. Try again in ${remainingTime} seconds.`;
        decryptionMessage.style.color = "red";
        return;
    } else if (decryptLockoutTime && Date.now() >= decryptLockoutTime) {
        // Reset if lockout period is over
        decryptLockoutTime = null;
        decryptAttempts = 0;
    }
    
    const hash = window.location.hash.substring(1);
    const components = hash.split(":");
    
    if (components.length !== 4) {
        decryptionMessage.textContent = "Invalid URL format";
        decryptionMessage.style.color = "red";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
        return;
    }

    const [algorithmPrefix, saltStr, encrypted, expirationTimeStr] = components;
    const expirationTime = new Date(parseInt(expirationTimeStr, 10));

    if (isNaN(expirationTime.getTime()) || expirationTime < new Date()) {
        decryptionMessage.textContent = "URL has expired.";
        decryptionMessage.style.color = "red";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
        return;
    }

    const password = document.getElementById("decryptPassword").value;
    if (!password) {
        decryptionMessage.textContent = "Please enter a password";
        decryptionMessage.style.color = "red";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
        return;
    }
    
    const iterations = 10000;
    const salt = CryptoJS.enc.Hex.parse(saltStr);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: iterations,
    });

    try {
        let decrypted;
        switch(algorithmPrefix) {
            case 'RSA':
                decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: salt });
                break;
            case 'AES':
                decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: salt });
                break;
            case 'MULTI':
                const firstPass = CryptoJS.AES.decrypt(encrypted, key, { iv: salt });
                decrypted = CryptoJS.AES.decrypt(firstPass.toString(CryptoJS.enc.Utf8), key, { iv: salt });
                break;
            default:
                decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: salt });
        }

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
            throw new Error('Decryption failed');
        }

        // Reset attempts on successful decryption
        decryptAttempts = 0;
        decryptLockoutTime = null;
        
        document.getElementById("decryptedText").value = decryptedText;
        decryptionMessage.textContent = "Decryption Success";
        decryptionMessage.style.color = "lightgreen";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
    } catch (error) {
        console.error("Decryption error:", error);
        
        // Increment attempt counter
        decryptAttempts++;
        
        // Check if max attempts reached
        if (decryptAttempts >= maxDecryptAttempts) {
            decryptLockoutTime = Date.now() + lockoutDuration;
            const remainingTime = Math.ceil(lockoutDuration / 1000);
            decryptionMessage.textContent = `Too many failed attempts. Try again in ${remainingTime} seconds.`;
        } else {
            decryptionMessage.textContent = `Incorrect password or corrupted data (${decryptAttempts}/${maxDecryptAttempts} attempts)`;
        }
        
        decryptionMessage.style.color = "red";
    }
}

function handleDownload() {
  const text = document.getElementById('decryptedText').value;
  if (!text.trim()) {
    // Don't create download if there's no text
    const decryptionMessage = document.getElementById("decryption-message");
    decryptionMessage.textContent = "No text to download";
    decryptionMessage.style.color = "red";
    setTimeout(() => decryptionMessage.textContent = "", 2000);
    return;
  }
  
  const filename = "decrypted_text.txt";
  const blob = new Blob([text], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  
  // Clean up the object URL after download completes or fails
  downloadLink.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
  });
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
