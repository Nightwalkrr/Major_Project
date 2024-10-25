
/*chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed or updated.");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked, trying to send message to content script...");

  // Check if the tab is active and has a content script loaded
  chrome.tabs.sendMessage(tab.id, { action: "translatePage" }, (response) => {
    // If response is undefined, it means the content script is not loaded
    if (chrome.runtime.lastError) {
      console.error("Error sending message to content script:", chrome.runtime.lastError);
      alert("Content script is not loaded. Please ensure you are on a valid webpage.");
    } else {
      console.log("Response from content script:", response);
    }
  });
});*/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translatePage") {
    console.log("Lang Selected = ", request.language);
    // Send the message to the content script
    chrome.tabs.query({active: true,currentwindows: true},(tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "translatePage", language:request.language}, (reponse) =>{
        sendResponse(reponse);
      });
    });
    return true; // Keep the message channel open for sendResponse
  }
});