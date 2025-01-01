function encrypt() {
    // Get the input text and the password
    const text = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
  
    // Generate a salt for key derivation
    const salt = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });
  
    // Encrypt the text using AES encryption
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: salt });
  
    // The encrypted data will be the salt and then the encrypted ciphertext
    const encoded = salt.toString() + ":" + encrypted;
  
    // Create and display the encrypted URL
    document.getElementById("encryptedURL").value = `${window.location.origin}${window.location.pathname}#${encoded}`;
  }
  
  function decrypt() {
    // Get encrypted data
    const hash = window.location.hash.substring(1);
  
    // Split the salt and encrypted text
    const components = hash.split(":");
  
    // If not two parts, it means it is invalid
    if (components.length !== 2) {
      alert("Invalid URL");
      return;
    }
  
    const salt = components[0];
    const encrypted = components[1];
  
    // Get the user-provided password
    const password = document.getElementById("decryptPassword").value;
  
    // Re-generate key from salt and password
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000,
    });
  
    try {
      // Decrypt the encrypted text using AES decryption
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: CryptoJS.enc.Hex.parse(salt),
      });
      // Display the decrypted text
      document.getElementById("decryptedText").value = decrypted.toString(
        CryptoJS.enc.Utf8
      );
    } catch (error) {
      alert("Incorrect Password");
    }
  }
  
  //Clear input button
  document.getElementById("clearInputText").addEventListener("click", function () {
    document.getElementById("inputText").value = "";
  });
  
  //Clear decrypted button
  document
    .getElementById("clearDecryptedText")
    .addEventListener("click", function () {
      document.getElementById("decryptedText").value = "";
    });
  
  //Copy URL button
  document.getElementById("copyURL").addEventListener("click", function () {
    const urlInput = document.getElementById("encryptedURL");
      navigator.clipboard.writeText(urlInput.value)
      .then(function(){
        alert("Copied URL")
      }).catch(function(error){
        console.error("Could not copy URL:", error);
        alert("Could not copy the URL")
      })
  });