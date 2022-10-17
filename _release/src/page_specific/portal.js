if (navigator.userAgent.toLowerCase().includes('chrome')) {
    chrome.runtime.sendMessage('samaks');
}
else
    browser.runtime.sendMessage('samaks');
