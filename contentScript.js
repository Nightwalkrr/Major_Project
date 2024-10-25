console.log("Content script loaded!"); // Log that the content script is loaded

// Function to translate the entire page
async function translateWholePage() {
    const apiKey = 'b6869bd7db8e4c11b7ab676cfe46771c'; // Replace with your Microsoft Translator API Key
    const region = 'centralindia';    // Replace with your Azure API region (e.g., 'centralindia')
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi';
    const chunkSize = 500; // adjust this value to control the chunk size
    const delayBetweenChunks = 500; // adjust this value to control the delay between chunks
    
    // Collect all text nodes in the document
    const textNodes = getTextNodes(document.body);
    let chunkIndex = 0;
    let currentChunk = [];
    let promises = [];

    async function sendChunk() {
        if (currentChunk.length === 0) return;

        const bodyContent = JSON.stringify([{ Text: currentChunk.join('') }]);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Ocp-Apim-Subscription-Region': region,
                    'Content-Type': 'application/json'
                },
                body: bodyContent
            });

            if (!response.ok) {
                throw new Error("API request failed with status: " + response.status);
            }

            const data = await response.json();
            const translatedText = data[0].translations[0].text;

            console.log("Original Text:", currentChunk.join('')); // Debug log for original text
            console.log("Translated Text:", translatedText); // Debug log for translated text

            for (let i = 0; i < currentChunk.length; i++) {
                textNodes[chunkIndex + i].nodeValue = translatedText.split(' ')[i];
            }

            chunkIndex += currentChunk.length;
            currentChunk = [];
        } catch (error) {
            console.error("Error while translating chunk:", error); // Debug log for errors
        }
    }

    async function sendNextChunk() {
        if (currentChunk.length > 0) {
            const promise = sendChunk();
            promises.push(promise);
            await promise;
            setTimeout(sendNextChunk, delayBetweenChunks);
        } else {
            await Promise.all(promises).then(() => {
                console.log("Translation completed."); // Log when all translations are done
            }).catch(error => {
                console.error("Error while translating page:", error); // Debug log for errors
            });
        }
    }

    textNodes.forEach((textNode) => {
        const originalText = extractTextcontent(textNode);
        if (originalText) {
            currentChunk.push(originalText);
            if (currentChunk.length >= chunkSize || textNode === textNodes[textNodes.length - 1]) {
                sendNextChunk();
            }
        }
    });
}

// Function to extract text content from a text node
function extractTextcontent(textNode) {
    return textNode.textContent.trim();
}

// Function to get all text nodes in the document
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }
    return textNodes;
}

translateWholePage();