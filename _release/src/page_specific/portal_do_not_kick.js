if (navigator.userAgent.toLowerCase().includes('chrome')) {
}
else {
    browser.runtime.sendMessage('uptlb-enabled').then(isEnabled => {
        if (isEnabled.value)
            do_not_kick_me_out_of_portal();
    });
}
// prevents portal.sejong.ac.kr main page kick
function do_not_kick_me_out_of_portal() {
    localStorage.setItem("autoLogintreset", "Y");
    setTimeout(do_not_kick_me_out_of_portal, 60 * 1000); // every 60 seconds
}
