# ProjectCodeX-A

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A web application providing secure client-side text encryption and decryption via shareable URLs.  Encrypt your sensitive information directly in your browser and share it securely!

## Demo

https://projectcodexa-craftedcodex.vercel.app/

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

*   **Client-Side Encryption:** Text is encrypted in the user's browser, ensuring that sensitive data never leaves the client unprotected.
*   **AES Encryption:** Utilizes the robust Advanced Encryption Standard for high-security text protection.
*   **Password-Based Key Derivation Function (PBKDF2):** Derives a strong and complex key for encryption using user-provided passwords.
*   **Unique Salt for Each Encryption:** Enhances security by making attacks like rainbow tables ineffective.
*   **Shareable Encrypted URL:** Generates a link containing the encrypted message for easy sharing.
*   **URL Expiration:** Allows for URLs to expire after a set number of days to further secure the message.
*   **Downloadable Text:**  Decrypt the text and download it as a file for easy access.
*   **Password-Protected Decryption:** Ensures that only users with the correct password can decrypt the text.
*   **Shortened URLs:** Uses is.gd to create a shorter and more easily shareable encrypted URL.

## Why ProjectCodeX-A?

*   **High Security:** Data encryption is performed entirely in the user's browser, mitigating the risk of interception.
*   **Ease of Use:** A simple and intuitive user interface with clear labels and buttons.
*   **No Server Dependency:** Since encryption is client-side, no sensitive data is stored or processed on external servers.
*   **Portable Encryption:** The encrypted URL can be easily shared without requiring additional files or software.
*   **Customizable Design:** A sleek, responsive design using modern CSS practices ensures usability across devices.
*   **Educational Value:** Demonstrates a practical implementation of cryptographic principles, useful for learning purposes.

## Getting Started

Instructions on setting up the project locally.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
*   Basic understanding of HTML, CSS, and JavaScript (if you plan to contribute)

### Installation

This project is designed to run directly in a web browser.  No server-side installation is required. Simply download the files and open the `index.html` file in your browser, or host the files on a web server.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dhrrishh7r5/projectcodexa.git
    cd projectcodexa
    ```

2.  **Open `index.html` in your browser.**

## Usage

1.  **Encryption:**
    *   Enter the text you want to encrypt in the "Text to Encrypt" textarea.
    *   Set the desired expiration days for the encrypted URL.
    *   Enter a strong password (minimum 8 characters) in the "Password" field and confirm it.
    *   Click the "Encrypt" button.
    *   The encrypted URL will be generated and displayed in the "Encrypted URL" field.  You can copy this URL.

2.  **Decryption:**
    *   Paste the encrypted URL into your browser's address bar.
    *   Enter the correct password in the "Password to Decrypt" field.
    *   Click the "Decrypt" button.
    *   The decrypted text will appear in the "Decrypted Text" textarea.

3.  **Downloading Decrypted Text:**
    *   After decrypting the text, click the "Download" button to save the text to a file.

## Security

*   **Client-Side Encryption:** All encryption and decryption operations are performed locally in the user's browser.  No sensitive data is sent to any server.
*   **AES with PBKDF2:**  The application uses the Advanced Encryption Standard (AES) with a key derived from the user-provided password using the Password-Based Key Derivation Function 2 (PBKDF2).  This strengthens the encryption process.
*   **Unique Salt:** A unique salt is generated for each encryption, protecting against rainbow table attacks.
*   **Password Strength Meter:**  A password strength meter is included to encourage users to create strong passwords.
*   **URL Expiration:**  The option to set an expiration date for the generated URL adds an extra layer of security.

**Important Note:** While ProjectCodeX-A provides a secure way to encrypt and share text, the security of the system relies heavily on the strength of the password chosen by the user.  **Always use a strong, unique password.**

## Contributing

Contributions are welcome!  If you have ideas for improvements, bug fixes, or new features, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Submit a pull request to the `main` branch.

Please adhere to the existing code style and conventions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

*   [CryptoJS](https://cdnjs.com/libraries/crypto-js): For providing the cryptographic functions.
*   [zxcvbn](https://github.com/dropbox/zxcvbn): For password strength estimation.


---

Developed by DHRRISHIT DEKA
