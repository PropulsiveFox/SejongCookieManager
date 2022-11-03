// prevents keyboard security popup
if (navigator.userAgent.toLowerCase().includes('chrome')) {
	chrome.runtime.sendMessage('samaks');
	chrome.runtime.sendMessage('uptlb');
}
else {
	browser.runtime.sendMessage('samaks');
	browser.runtime.sendMessage('uptlb');
}

// keep login
