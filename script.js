const passwordInput = document.getElementById("password");
const passwordStrength = document.getElementById("password-strength");

passwordInput.addEventListener("input", function () {
    const result = zxcvbn(passwordInput.value);
    let strengthMessage = '';
    switch (result.score) {
        case 0: strengthMessage = 'Very weak'; break;
        case 1: strengthMessage = 'Weak'; break;
        case 2: strengthMessage = 'Fair'; break;
        case 3: strengthMessage = 'Good'; break;
        case 4: strengthMessage = 'Strong'; break;
    }
    passwordStrength.textContent = `Password Strength: ${strengthMessage}`;
    passwordStrength.classList.remove('weak', 'fair', 'good', 'strong', 'very-weak')
    if (result.score === 0) {
        passwordStrength.classList.add('very-weak')
    } else if (result.score === 1) {
        passwordStrength.classList.add('weak');
    } else if (result.score === 2) {
        passwordStrength.classList.add('fair')
    } else if (result.score === 3) {
        passwordStrength.classList.add('good')
    } else {
        passwordStrength.classList.add('strong')
    }
});


async function shortenURL(longURL) {
    const apiURL = 'https://is.gd/create.php';
    const postData = new URLSearchParams();
    postData.append('url', longURL);

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
        });
        if (!response.ok) {
            throw new Error(`Failed to shorten URL with is.gd: ${response.status} ${response.statusText}`);
        }
        const shortURL = await response.text();
        return shortURL;
    } catch (error) {
        console.error("Error shortening URL:", error);
        return null;
    }
}

async function handleEncrypt() {
    const inputText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const encryptionMessage = document.getElementById("encryption-message");
    const expirationDays = parseInt(document.getElementById("expirationDays").value, 10) || 7;


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

    const iterations = 10000;
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: iterations,
    });
    console.log("Encryption salt:", salt.toString());
    const encrypted = CryptoJS.AES.encrypt(inputText, key, { iv: salt });
    console.log("Encrypted text before encoding:", encrypted.toString());
      const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + expirationDays);
    const encoded = salt.toString() + ":" + encrypted + ":" + expirationTime.getTime();
     console.log("Encoded:", encoded);
    const longURL = `${window.location.origin}${window.location.pathname}#${encoded}`;

    // Call the shortenURL function
     const shortURL = await shortenURL(longURL);
    if (shortURL) {
        document.getElementById("encryptedURL").value = shortURL;
     } else {
       // In case of an error, just use the regular URL.
        document.getElementById("encryptedURL").value = longURL;
     }


    encryptionMessage.textContent = "Encryption Success";
    encryptionMessage.style.color = "lightgreen";
    setTimeout(() => encryptionMessage.textContent = "", 2000);
}

function handleDecrypt() {
    const hash = window.location.hash.substring(1);
    const components = hash.split(":");
    const decryptionMessage = document.getElementById("decryption-message");

  if (components.length !== 3) {
      decryptionMessage.textContent = "Invalid URL";
      decryptionMessage.style.color = "red";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
        return;
    }

    const salt = components[0];
    const encrypted = components[1];
     const expirationTime = new Date(parseInt(components[2], 10));

  if (isNaN(expirationTime.getTime()) || expirationTime < new Date()) {
      decryptionMessage.textContent = "URL has expired.";
      decryptionMessage.style.color = "red";
      setTimeout(() => decryptionMessage.textContent = "", 2000);
        return;
    }


    const password = document.getElementById("decryptPassword").value;

    const iterations = 10000;

      const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32,
        iterations: iterations,
    });
    console.log("Decryption Salt:", salt);

    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: CryptoJS.enc.Hex.parse(salt),
        });
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        console.log("Decrypted text:", decryptedText);

        document.getElementById("decryptedText").value = decryptedText;
         decryptionMessage.textContent = "Decryption Success";
        decryptionMessage.style.color = "lightgreen";
        setTimeout(() => decryptionMessage.textContent = "", 2000);
    } catch (error) {
        console.error("Decryption error:", error);
        decryptionMessage.textContent = "Decryption failed. Please check the password.";
        decryptionMessage.style.color = "red";
          setTimeout(() => decryptionMessage.textContent = "", 2000);
    }
}
function handleDownload() {
  const text = document.getElementById('decryptedText').value;
  const filename = "decrypted_text.txt";
  const blob = new Blob([text], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
document.getElementById("clearInputText").addEventListener("click", function () {
    document.getElementById("inputText").value = "";
});
document
    .getElementById("clearDecryptedText")
    .addEventListener("click", function () {
        document.getElementById("decryptedText").value = "";
    });
document.getElementById("copyURL").addEventListener("click", function () {
    const urlInput = document.getElementById("encryptedURL");
    const messageSpan = document.getElementById("url-copy-message");
    navigator.clipboard.writeText(urlInput.value)
        .then(function () {
            messageSpan.textContent = "URL Copied!";
            messageSpan.style.color = "lightgreen";
            setTimeout(() => messageSpan.textContent = "", 2000);
        }).catch(function (error) {
            messageSpan.textContent = "Could not copy URL";
            messageSpan.style.color = "red";
            setTimeout(() => messageSpan.textContent = "", 2000);
            console.error("Could not copy URL:", error);

        })
});
document.getElementById('downloadButton').addEventListener('click', handleDownload);