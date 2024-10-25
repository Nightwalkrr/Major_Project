document.getElementById('translateButton').addEventListener('click', () => {
    const selectedLanguage = document.getElementById('languageSelect').value;

    // Send a message to the background script with the selected language
    chrome.runtime.sendMessage({ action: "translatePage", language: selectedLanguage }, (response) => {
        console.log("Response from background:", response);
    });
});