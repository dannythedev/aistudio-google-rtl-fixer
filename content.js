function setRtlIfNeeded(element) {
    if (!element.textContent) return;
    
    // 1. Instantly skip ANY element that is a code block or inside one
    if (element.closest('pre') || element.closest('code')) return;

    // 2. Regex to detect RTL characters
    const rtlChars = /[\u0590-\u05FF\u0600-\u06FF]/;
    
    if (rtlChars.test(element.textContent)) {
        element.setAttribute('dir', 'rtl');
        element.style.setProperty('text-align', 'right', 'important');
    } else {
        // 3. If it contains NO RTL characters, force LTR to nullify parent inheritance
        element.setAttribute('dir', 'ltr');
        element.style.setProperty('text-align', 'left', 'important');
    }
}

function processElements() {
    // Target inputs, editable areas, text blocks, headers, and list items
    const targets = document.querySelectorAll('p, span, textarea, input, [contenteditable="true"], div[role="textbox"], h1, h2, h3, h4, h5, h6, li');
    targets.forEach(setRtlIfNeeded);

    // Explicitly nullify RTL on all code blocks by forcing native LTR
    const codeBlocks = document.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
        block.setAttribute('dir', 'ltr');
        block.style.setProperty('text-align', 'left', 'important');
    });
}

// Run once immediately
processElements();

// Watch the page for new AI responses or DOM updates
const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
            shouldProcess = true;
            break;
        }
    }
    if (shouldProcess) processElements();
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});