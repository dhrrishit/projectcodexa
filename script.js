function encrypt() {
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

  const salt = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000,
  });

  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: salt });
  const encoded = salt.toString() + ":" + encrypted;

  document.getElementById("encryptedURL").value = `${window.location.origin}${window.location.pathname}#${encoded}`;
}

function decrypt() {
  const hash = window.location.hash.substring(1);
  const components = hash.split(":");

  if (components.length !== 2) {
      alert("Invalid URL");
      return;
  }

  const salt = components[0];
  const encrypted = components[1];
  const password = document.getElementById("decryptPassword").value;

  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000,
  });

  try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
          iv: CryptoJS.enc.Hex.parse(salt),
      });
      document.getElementById("decryptedText").value = decrypted.toString(
          CryptoJS.enc.Utf8
      );
  } catch (error) {
      alert("Incorrect Password");
  }
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
  navigator.clipboard.writeText(urlInput.value)
      .then(function () {
          alert("Copied URL")
      }).catch(function (error) {
          console.error("Could not copy URL:", error);
          alert("Could not copy the URL")
      })
});