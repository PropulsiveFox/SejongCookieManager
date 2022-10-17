import Extension from "./Extension.js";
import ConfigCookies from "./ConfigCookies.js";
const defaultCookieSetter = function (config, cookieWrap) {
    cookieWrap.cookie.expirationDate = config.parse_unix_time();
};
/*
    samaks
*/
const portalCookieSetter = function (config, cookieWrap) {
    if (cookieWrap.cookie == null)
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
        cookieSetter: portalCookieSetter
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
    let value = cookieWrap.cookie.value;
    let parsedValue = value.split(',')
        .map(str => str.split(':'))
        .reduce((acc, e) => {
        acc[e[0].trim()] = e[1].trim();
        return acc;
    }, {});
    parsedValue.expires = config.parse_unix_time().toString();
    parsedValue.timeout = config.parse_delta_time().toString();
    let keyValues = new Array();
    for (let key in parsedValue) {
        keyValues.push(`${key}:${parsedValue[key]}`);
    }
    setTimeout(() => {
        cookieWrap.cookie.value = keyValues.join(',');
    }, 10);
    defaultCookieSetter(config, cookieWrap);
};
let kmitb = new ConfigCookies('kmitb', [
    {
        name: 'apt.sid',
        url: 'https://.sejong.ac.kr',
        cookieSetter: defaultCookieSetter
    },
    {
        name: 'BbRouter',
        url: 'https://blackboard.sejong.ac.kr',
        cookieSetter: blackboardCookieSetter
    }
]);
Extension.api.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == 'local') {
        kmitb.updateCookies();
    }
});
Extension.api.cookies.onChanged.addListener(changeInfo => {
    if (changeInfo.removed)
        return;
    if ((changeInfo.cookie.domain == 'blackboard.sejong.ac.kr' &&
        changeInfo.cookie.name == 'BbRouter') ||
        (changeInfo.cookie.domain == '.sejong.ac.kr' &&
            changeInfo.cookie.name == 'apt.sid')) {
        kmitb.updateCookies();
    }
});
