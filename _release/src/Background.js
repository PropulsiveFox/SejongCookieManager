import Extension from "./Extension.js";
import ConfigCookies from "./ConfigCookies.js";
const defaultCookieSetter = function (config, cookieWrap) {
    if (!cookieWrap.cookie)
        return;
    cookieWrap.cookie.expirationDate = config.parse_unix_time();
};
/*
    samaks
*/
const portalKeyboardCookieSetter = function (config, cookieWrap) {
    if (!cookieWrap.cookie)
        cookieWrap.cookie = {
            name: 'chknos',
            value: 'false',
            domain: 'portal.sejong.ac.kr',
            hostOnly: true,
            path: '/',
            secure: false,
            httpOnly: false,
            sameSite: 'no_restriction',
            session: true,
            firstPartyDomain: '',
            partitionKey: null,
            storeId: ''
        };
    defaultCookieSetter(config, cookieWrap);
};
let samaks = new ConfigCookies('samaks', [
    {
        name: 'chknos',
        url: 'https://portal.sejong.ac.kr/',
        cookieSetter: portalKeyboardCookieSetter
    }
]);
Extension.api.runtime.onMessage.addListener(message => {
    if (message == 'samaks')
        samaks.updateCookies();
});
Extension.api.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == 'local') {
        samaks.updateCookies();
    }
});
/*
    kmitb
*/
const blackboardCookieSetter = function (config, cookieWrap) {
    // type BbRouter = {
    // 	expires: string,
    // 	id: string,
    // 	signature: string,
    // 	site: string,
    // 	timeout: string,
    // 	user: string,
    // 	v: string,
    // 	xsrf: string
    // };
    // if (!cookieWrap.cookie) return;
    // let value = cookieWrap.cookie.value;
    // let parsedValue = value.split(',')
    // 	.map(str => str.split(':'))
    // 	.reduce((acc, e) => {
    // 		acc[e[0].trim()] = e[1].trim();
    // 		return acc;
    // 	}, {}) as BbRouter;
    // parsedValue.expires = config.parse_unix_time().toString();
    // parsedValue.timeout = config.parse_delta_time().toString();
    // let keyValues = new Array();
    // for (let key in parsedValue) {
    // 	keyValues.push(`${key}:${parsedValue[key]}`);
    // }
    // setTimeout(() => {
    // 	cookieWrap.cookie.value = keyValues.join(',');
    // }, 10);
    // don't even try to modify cookie. just set expiration date to max(time, 3hour);
    if (!cookieWrap.cookie)
        return;
    let parsedTime = config.parse_delta_time();
    parsedTime = parsedTime > 3 * 60 * 60 ? Math.round(Date.now() / 1000) + 3 * 60 * 60 : config.parse_unix_time();
    cookieWrap.cookie.expirationDate = parsedTime;
};
let kmitb = new ConfigCookies('kmitb', [
    {
        name: 'BbRouter',
        url: 'https://blackboard.sejong.ac.kr',
        cookieSetter: blackboardCookieSetter
    }
]);
let kmitbNames = kmitb.cookiePackages.map(cookiePackage => {
    return cookiePackage.cookieWrap.target.name;
});
Extension.api.runtime.onMessage.addListener(message => {
    if (message == 'kmitb') {
        browser.webRequest.onBeforeRequest.addListener(details => {
            let timerFilter = browser.webRequest.filterResponseData(details.requestId);
            timerFilter.ondata = e => {
                let str = new TextDecoder('utf-8').decode(e.data, { stream: true });
                str = str.replace(/t\.startTimer=e=>\{.*Event\)\(\)\};/, 't.startTimer=e=>{};');
                timerFilter.write(new TextEncoder().encode(str));
            };
            timerFilter.onstop = e => {
                timerFilter.disconnect();
            };
        }, { urls: ["*://ultra.content.blackboardcdn.com/ultra/*.js"] }, ["blocking"]);
    }
});
Extension.api.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == 'local') {
        kmitb.updateCookies();
    }
});
Extension.api.cookies.onChanged.addListener(changeInfo => {
    if (changeInfo.removed)
        return;
    if ((changeInfo.cookie.domain == 'blackboard.sejong.ac.kr' ||
        changeInfo.cookie.domain == '.sejong.ac.kr') &&
        kmitbNames.includes(changeInfo.cookie.name)) {
        kmitb.updateCookies();
    }
});
/*
    uptlb
*/
let uptlb = new ConfigCookies('uptlb', [
    {
        name: 'ssotoken',
        url: 'https://.sejong.ac.kr',
        cookieSetter: defaultCookieSetter
    },
    {
        name: 'PO_JSESSIONID',
        url: 'https://.portal.sejong.ac.kr',
        cookieSetter: defaultCookieSetter
    }
]);
Extension.api.runtime.onMessage.addListener(message => {
    if (message == 'uptlb')
        uptlb.updateCookies();
});
Extension.api.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == 'local')
        uptlb.updateCookies();
});
Extension.api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message == 'uptlb-active') {
        uptlb.updateCookies().then(() => {
            if (uptlb.cookiePackages.every(cookiePackage => cookiePackage.cookieWrap.cookie != null) && uptlb.config.enabled == true) {
                Extension.api.tabs.sendMessage(sender.tab.id, { name: 'uptlb-active', value: true });
            }
            else {
                Extension.api.tabs.sendMessage(sender.tab.id, { name: 'uptlb-active', value: false });
            }
        }).catch(() => {
            Extension.api.tabs.sendMessage(sender.tab.id, { name: 'uptlb-active', value: false });
        });
    }
});
