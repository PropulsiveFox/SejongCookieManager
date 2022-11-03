if (navigator.userAgent.toLowerCase().includes('chrome')) {
    chrome.runtime.sendMessage('kmitb');
}
else {
    browser.runtime.sendMessage('kmitb');
    // look for login page
    browser.runtime.sendMessage('uptlb-enabled').then(response => {
        console.log('got response!');
        response.valuePromise.then(shoudRedirect => {
            if (shoudRedirect && document.querySelector('span#login-button')) {
                window.location.href = 'https://portal.sejong.ac.kr/jsp/login/bbfrmv3.jsp';
            }
        });
    });
}
// @ts-ignore
// if you want to experiment. use this command in console of blackboard.*
// window.webpackJsonp.find(element => element[0] == 586);
