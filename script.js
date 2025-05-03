// Define placeholders for configuration - **WARNING: EXPOSING TOKEN CLIENT-SIDE IS INSECURE**
// For a production application, this logic MUST be handled by a secure backend server.
const BOT_TOKEN = '7841076304:AAHgc-4spP6cfl40sBQBEFNZWf0Lb4teMi8'; // <-- REPLACE WITH YOUR ACTUAL TELEGRAM BOT TOKEN
// Find your own Telegram Chat ID using a bot like @userinfobot if needed for testing specific chat_id
// const YOUR_CHAT_ID = 'YOUR_CHAT_ID_FOR_TESTING';

let currentVerificationCode = null; // Variable to store the code generated for the current login attempt
let targetTelegramId = null; // Variable to store the Telegram ID entered by the user

document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Only schedule the fade-out and redirect if on index.html
        setTimeout(() => {
            document.body.classList.add('fade-out');

            // Redirect to main.html after fade-out animation
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 500); // Match this with CSS transition duration
        }, 3000); // Wait for 3 seconds before starting fade-out
    }

    // Login functionality for main.html
    const loginButton = document.getElementById('loginButton');
    const profileDetails = document.getElementById('profileDetails');
    const userNameElement = document.getElementById('userName');

    if (loginButton) {
        loginButton.addEventListener('click', async () => { // Use async for fetch

            if (BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
                alert("Ошибка: Пожалуйста, замените 'YOUR_TELEGRAM_BOT_TOKEN' на актуальный токен вашего Telegram бота в файле script.js.");
                return; // Stop the process if token is not set
            }

            targetTelegramId = prompt("Введите ваш Telegram ID или юзернейм (например, 123456789 или @myusername):");

            if (!targetTelegramId) {
                alert("Авторизация отменена или Telegram ID не введен.");
                return; // Exit if prompt is cancelled or empty
            }

            // Generate a random 4-digit code
            currentVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();

            // Attempt to send the code via Telegram Bot API
            // **WARNING: Sending requests directly from client-side exposes your bot token!**
            // Anyone viewing your page source can find your token.
            // This is for demonstration based on user request. A secure implementation requires a backend server
            // to handle the Telegram API communication.
            const messageText = `Ваш код авторизации: ${currentVerificationCode}\n\n(Этот код действителен непродолжительное время)`;
            const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${encodeURIComponent(targetTelegramId)}&text=${encodeURIComponent(messageText)}`;

            try {
                // Make the API request
                const response = await fetch(telegramApiUrl);
                const data = await response.json();

                if (data.ok) {
                    // Message sent successfully (from API perspective)
                    // Note: This doesn't guarantee the user received it (e.g., blocked bot, wrong ID)
                    alert(`Код отправлен в Telegram на ID/юзернейм "${targetTelegramId}". Пожалуйста, проверьте свои сообщения.`);

                    // Now prompt user for the code they received
                    const enteredCode = prompt("Введите код, полученный в Telegram:");

                    // Client-side verification (still insecure as the code is known client-side)
                    if (enteredCode === currentVerificationCode) {
                        alert("Авторизация успешна!");
                        // Simulate successful login
                        loginButton.style.display = 'none'; // Hide the login button
                        profileDetails.style.display = 'block'; // Show profile details area
                        userNameElement.textContent = `@${targetTelegramId}`; // Display Telegram ID/username

                        // Clean up temporary variables
                        currentVerificationCode = null;
                        targetTelegramId = null;

                    } else {
                        alert("Неверный код. Попробуйте еще раз.");
                        // Clean up temporary variables on failure
                        currentVerificationCode = null;
                        targetTelegramId = null;
                    }

                } else {
                    // Telegram API returned an error (e.g., chat_id not found, bot blocked)
                    console.error('Telegram API Error:', data);
                    alert(`Не удалось отправить код в Telegram. Проверьте правильность Telegram ID/юзернейма ("${targetTelegramId}") и статус вашего бота. Возможно, пользователь не взаимодействовал с ботом ранее, или бот заблокирован. Ошибка: ${data.description || 'Неизвестно'}`);
                    // Clean up temporary variables on failure
                    currentVerificationCode = null;
                    targetTelegramId = null;
                }

            } catch (error) {
                // Network or other fetch error
                console.error('Fetch Error:', error);
                alert("Произошла ошибка при попытке связаться с серверами Telegram. Проверьте ваше интернет-соединение и правильность URL.");
                 // Clean up temporary variables on failure
                currentVerificationCode = null;
                 targetTelegramId = null;
            }
        });

        // Optional: Check for saved login state... (keep commented out as before)
    }

    // If the current page is main.html, the script does nothing after DOMContentLoaded
    // The fade-in class is now on the .bank-app div in main.html, handled by CSS animation
});