# ProjectCodeX-A by CraftedCodeX

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A powerful web application providing secure client-side text encryption and decryption via shareable URLs. Encrypt your sensitive information directly in your browser and share it securely with advanced features like two-factor authentication, multiple encryption algorithms, and password generation.

## 

https://projectcodexa-craftedcodex.vercel.app/

##

## Table of Contents

*   [Features](#features)
*   [Why ProjectCodeX-A?](#why-projectcodex-a)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
*   [Security](#security)
*   [Contributing](#contributing)
*   [License](#license)
*   [Acknowledgments](#acknowledgments)

## Features

* **Client-Side Encryption:** Text is encrypted in your browser, ensuring sensitive data never leaves your device unprotected.
* **Multiple Encryption Algorithms:** Choose between AES-256, RSA-2048, or Multi-Pass encryption for different security needs.
* **Secure Key Derivation:** Uses PBKDF2 with a robust iteration count to derive strong encryption keys from your passwords.
* **Password Strength Indicator:** Real-time feedback on password strength to help you create secure, uncrackable passwords.
* **Two-Factor Authentication:** Add an extra layer of security with TOTP-based two-factor authentication.
* **Automatic Password Generation:** Generate strong, customizable passwords with various character types and lengths.
* **URL Expiration:** Set URLs to expire after a specified number of days for enhanced security.
* **URL Shortening:** Long encrypted URLs are automatically shortened for easier sharing.
* **Downloadable Text:** Download decrypted text directly as a file for offline access.
* **Visual Feedback:** Clear indicators for copy, password visibility, success/error messages with intuitive UI elements.
* **Matrix Background:** Dynamic, performance-optimized matrix code animation in the background.

## Why ProjectCodeX-A?

* **Complete Privacy:** All encryption and decryption happens in your browser - your data is never sent to any server.
* **Modern Interface:** Clean, responsive design with intuitive controls and visual feedback.
* **Enhanced Security:** Multiple encryption options, password strength indicators, and two-factor authentication provide robust protection.
* **Visual Feedback:** Clear indicators for every action - copy, password strength, success/error messages.
* **No Dependencies:** Works completely offline after initial page load - no server connections required.
* **Performance Optimized:** Background animations and visual effects are optimized for smooth performance on all devices.
* **Accessibility:** Designed with usability in mind, with clear visual feedback and intuitive controls.

## Getting Started

Instructions on setting up the project locally.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
*   Basic understanding of HTML, CSS, and JavaScript (if you plan to contribute)

### Installation

This project is designed to run directly in a web browser. No server-side installation is required. Simply download the files and open the `index.html` file in your browser, or host the files on a web server.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dhrrishh7r5/projectcodexa.git
    cd projectcodexa
    ```

2.  **Open `index.html` in your browser.**

## Usage

1.  **Encryption:**
    *   Select your preferred encryption algorithm (AES-256, RSA-2048, or Multi-Pass).
    *   Enter the text you want to encrypt in the "Text to Encrypt" textarea.
    *   Set the desired expiration days for the encrypted URL.
    *   Enter a strong password or use the "Generate" button to create a secure password.
    *   Optionally enable Two-Factor Authentication for additional security.
    *   Click the "Encrypt" button.
    *   The encrypted URL will be generated and displayed in the "Encrypted URL" field. Copy it using the copy button.

2.  **Decryption:**
    *   Navigate to the application URL with the encrypted hash or paste the shortened URL.
    *   Enter the correct password in the "Password to Decrypt" field.
    *   Click the "Decrypt" button.
    *   The decrypted text will appear in the "Decrypted Text" textarea.

3.  **Password Generation:**
    *   Click the "Generate" button next to the password field.
    *   Customize your password requirements (uppercase, lowercase, numbers, special characters, and length).
    *   A strong, random password will be generated and automatically filled in.

4.  **Two-Factor Authentication:**
    *   Check the "Enable Two-Factor Authentication" box.
    *   Scan the displayed QR code with an authenticator app (like Google Authenticator, Authy, etc.).
    *   Enter the 6-digit code from your authenticator app when encrypting.

5.  **Downloading Decrypted Text:**
    *   After decrypting the text, click the "Download" button to save the text to a file.

## Security

*   **Client-Side Encryption:** All encryption and decryption operations are performed locally in your browser. No sensitive data is sent to any server.
*   **Multiple Encryption Algorithms:** Choose from AES-256, RSA-2048, or Multi-Pass encryption based on your security requirements.
*   **Key Derivation:** Uses PBKDF2 with 10,000 iterations to derive encryption keys from passwords, making brute-force attacks impractical.
*   **Two-Factor Authentication:** Optional TOTP-based 2FA for an additional layer of security.
*   **Random Password Generation:** Create cryptographically strong passwords using the browser's secure random number generator.
*   **Visual Password Strength Meter:** Real-time feedback on password strength encourages better security practices.
*   **URL Expiration:** Set an expiration date for shared URLs to limit their validity period.

**Important Note:** While ProjectCodeX-A provides robust encryption, the security of your data relies heavily on protecting your password and (if enabled) your two-factor authentication device. Always use a strong, unique password and keep your 2FA device secure.

## Contributing

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes.
4.  Test your changes thoroughly.
5.  Submit a pull request.

Please adhere to the existing code style and conventions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
**Dhrrishit Deka**
- **Website**: https://craftedcodex.onrender.com/
- **Email**: dhrrishit@gmail.com
- **GitHub**: https://github.com/dhrrishit
- **LinkedIn**: https://www.linkedin.com/in/dhrrishitdeka/
- **X (Twitter)**: https://x.com/dhrrishitdeka
  
## Acknowledgments

*   [CryptoJS](https://cdnjs.com/libraries/crypto-js): For providing the cryptographic functions.
*   [zxcvbn](https://github.com/dropbox/zxcvbn): For password strength estimation.
*   [QRCode.js](https://github.com/davidshimjs/qrcodejs): For QR code generation for two-factor authentication.
*   [jsOTP](https://github.com/jiangts/jsOTP): For TOTP generation in the browser.
*   [Font Awesome](https://fontawesome.com/): For the UI icons.



