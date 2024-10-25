console.log("Content script loaded!"); // Log that the content script is loaded

// Function to translate the entire page
function translateWholePage() {
    const apiKey = 'b6869bd7db8e4c11b7ab676cfe46771c'; // Replace with your Microsoft Translator API Key
    const region = 'centralindia';    // Replace with your Azure API region (e.g., 'centralindia')
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi';
    
    // Collect all text nodes in the document
    const textNodes = getTextNodes(document.body);
    let promises = [];

    textNodes.forEach((textNode) => {
        //const originalText = textNode.nodeValue.trim();
        const originalText = extractTextcontent(textNode);////////////////////////////////////////////////////////
        
        // Only translate non-empty text nodes
        if (originalText) 
        {
            console.log("Translating chunk:", originalText); // Debug log for the chunk being translated

            const bodyContent = JSON.stringify([{ Text: originalText }]);
            const promise = fetch(endpoint, 
            {
                method: 'POST',
                headers: 
                {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Ocp-Apim-Subscription-Region': region,
                    'Content-Type': 'application/json'
                },
                body: bodyContent
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error("API request failed with status: " + response.status);
                }
                return response.json();
            })
            .then(data => 
            {
                const translatedText = data[0].translations[0].text;
                console.log("Original Text:", originalText); // Debug log for original text
                console.log("Translated Text:", translatedText); // Debug log for translated text
                textNode.nodeValue = translatedText; // Replace text in the text node
            })
            .catch(error => 
            {
                console.error("Error while translating chunk:", error); // Debug log for errors
            });

            promises.push(promise);
        }
    });

    // Wait for all translations to complete
    Promise.all(promises).then(() => {
        console.log("Translation completed."); // Log when all translations are done
    }).catch(error => {
        console.error("Error while translating page:", error); // Debug log for errors
    });;
}
/*
// Function to get all text nodes in a node
function getTextNodes(node) {
    let textNodes = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    let currentNode;
    
    while (currentNode = walker.nextNode()) {
        textNodes.push(currentNode);
    }
    return textNodes;
}*/

function getTextNodes(node) {
    if (!node || !(node instanceof Node) || !node.nodeType || !node.parentNode) {
        throw new Error('Invalid node parameter. Expected a valid DOM node.');
    }
    let textNodes = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, {
        acceptNode: function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    }, false);
    let currentNode;

    while (currentNode = walker.nextNode()) {
        textNodes.push(currentNode);
    }
    return textNodes;
}


// Listener for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);  // Log the incoming message
    if (request.action === "translatePage" && sender.id === chrome.runtime.id) {
        console.log("Received request to translate page.");
        translateWholePage(); // Call the translation function
        sendResponse({ status: "Translation started" });
    } else {
        sendResponse({ status: "Unknown action" });
    }
});
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

function translateWholePage() {
    console.log("Translating whole page...");
    const apiKey = 'b6869bd7db8e4c11b7ab676cfe46771c'; // Replace with your Microsoft Translator API Key
    const region = 'centralindia';    // Replace with your Azure API region (e.g., 'centralindia')
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi';
    
    // Collect all text nodes in the document
    const textNodes = getTextNodes(document.body);
    console.log("Found " + textNodes.length + " text nodes.");
    let promises = [];

    textNodes.forEach((textNode, index) => {
        console.log("Translating text node " + (index + 1) + " of " + textNodes.length);
        const originalText = extractTextContent(textNode);
        console.log("Original text: " + originalText);
        
        // Split the text into smaller chunks
        const chunkSize = 100;
        const chunks = [];
        for (let i = 0; i < originalText.length; i += chunkSize) {
            chunks.push(originalText.substring(i, i + chunkSize));
        }

        // Translate each chunk separately
        chunks.forEach((chunk, chunkIndex) => {
            console.log("Translating chunk " + (chunkIndex + 1) + " of " + chunks.length);
            const bodyContent = JSON.stringify([{ Text: chunk }]);
            const promise = fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Ocp-Apim-Subscription-Region': region,
                    'Content-Type': 'application/json'
                },
                body: bodyContent
            })
            .then(response => {
                console.log("Received response from API.");
                if (!response.ok) {
                    throw new Error("API request failed with status: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received translation data.");
                const translatedText = data[0].translations[0].text;
                console.log("Translated text: " + translatedText);
                // Add a delay before translating the next chunk
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 500); // 500ms delay
                });
            })
            .then(() => {
                // Translate the next chunk
                if (chunkIndex < chunks.length - 1) {
                    return translateChunk(chunks[chunkIndex + 1]);
                } else {
                    return Promise.resolve();
                }
            })
            .catch(error => {
                console.error("Error while translating chunk:", error); // Debug log for errors
            });

            promises.push(promise);
        });
    });

    // Wait for all translations to complete
    Promise.all(promises).then(() => {
        console.log("Translation completed."); // Log when all translations are done
    }).catch(error => {
        console.error("Error while translating page:", error); // Debug log for errors
    });
}
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
console.log("Content script loaded!"); // Log that the content script is loaded

// Function to translate the entire page
function translateWholePage() {
    const apiKey = 'b6869bd7db8e4c11b7ab676cfe46771c'; // Replace with your Microsoft Translator API Key
    const region = 'centralindia';    // Replace with your Azure API region (e.g., 'centralindia')
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi';
    
    // Collect all text nodes in the document
    const textNodes = getTextNodes(document.body);
    let promises = [];

    textNodes.forEach((textNode) => {
        //const originalText = textNode.nodeValue.trim();
        const originalText = extractTextcontent(textNode);////////////////////////////////////////////////////////
        
        // Only translate non-empty text nodes
        if (originalText) 
        {
            console.log("Translating chunk:", originalText); // Debug log for the chunk being translated

            const bodyContent = JSON.stringify([{ Text: originalText }]);
            const promise = fetch(endpoint, 
            {
                method: 'POST',
                headers: 
                {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Ocp-Apim-Subscription-Region': region,
                    'Content-Type': 'application/json'
                },
                body: bodyContent
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error("API request failed with status: " + response.status);
                }
                return response.json();
            })
            .then(data => 
            {
                const translatedText = data[0].translations[0].text;
                console.log("Original Text:", originalText); // Debug log for original text
                console.log("Translated Text:", translatedText); // Debug log for translated text
                textNode.nodeValue = translatedText; // Replace text in the text node
            })
            .catch(error => 
            {
                console.error("Error while translating chunk:", error); // Debug log for errors
            });

            promises.push(promise);
        }
    });

    // Wait for all translations to complete
    Promise.all(promises).then(() => {
        console.log("Translation completed."); // Log when all translations are done
    }).catch(error => {
        console.error("Error while translating page:", error); // Debug log for errors
    });;
}
/*
// Function to get all text nodes in a node
function getTextNodes(node) {
    let textNodes = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    let currentNode;
    
    while (currentNode = walker.nextNode()) {
        textNodes.push(currentNode);
    }
    return textNodes;
}*/

function getTextNodes(node) {
    if (!node || !(node instanceof Node) || !node.nodeType || !node.parentNode) {
        throw new Error('Invalid node parameter. Expected a valid DOM node.');
    }
    let textNodes = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, {
        acceptNode: function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    }, false);
    let currentNode;

    while (currentNode = walker.nextNode()) {
        textNodes.push(currentNode);
    }
    return textNodes;
}


// Listener for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);  // Log the incoming message
    if (request.action === "translatePage" && sender.id === chrome.runtime.id) {
        console.log("Received request to translate page.");
        translateWholePage(); // Call the translation function
        sendResponse({ status: "Translation started" });
    } else {
        sendResponse({ status: "Unknown action" });
    }
});
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
chrome.runtime.onInstalled.addListener((tab) => {
    console.log("Extension icon Clicked,trying to send message to content script...");
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
  });
  
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________