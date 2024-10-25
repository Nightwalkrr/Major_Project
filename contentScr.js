// contentScript.js

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
  
  // Function to convert text to text.data
  function textToData(text) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(text);
    return data;
  }
  
  // Function to convert text.data to text
  function dataToText(data) {
    const textDecoder = new TextDecoder();
    const text = textDecoder.decode(data);
    return text;
  }
  
  // API endpoint and credentials
  const apiEndpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi';
  const apiKey = 'b6869bd7db8e4c11b7ab676cfe4';
  
  // Function to send text to API and translate it
  async function translateText(text) {
    const data = textToData(text);
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${apiKey}`
      },
      body: data
    });
  
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  
    const translatedData = await response.arrayBuffer();
    const translatedText = dataToText(translatedData);
    return translatedText;
  }
  
  // Main function to translate all text on the page
  async function translatePage() {
    const textNodes = getTextNodes(document.body);
    for (const textNode of textNodes) {
      const originalText = extractTextcontent(textNode);
      const translatedText = await translateText(originalText);
      textNode.textContent = translatedText;
    }
  }
  
  // Run the translation function
  translatePage();