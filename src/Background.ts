import Extension from "./Extension.js";
import ConfigCookies from "./ConfigCookies.js";

const defaultCookieSetter: ConfigCookies.CookieSetter = function (config, cookieWrap) {
	if (!cookieWrap.cookie) return;
	cookieWrap.cookie.expirationDate = config.parse_unix_time();
}

/*
	samaks
*/
const portalCookieSetter: ConfigCookies.CookieSetter = function (config, cookieWrap) {
	if (!cookieWrap.cookie) cookieWrap.cookie = {
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
	}
	defaultCookieSetter(config, cookieWrap);
}
let samaks = new ConfigCookies('samaks', [
	{
		name: 'chknos',
		url: 'https://portal.sejong.ac.kr/',
		cookieSetter: portalCookieSetter
	}
]);
Extension.api.runtime.onMessage.addListener(message => {
	if (message == 'samaks') samaks.updateCookies();
});
Extension.api.storage.onChanged.addListener((changes, areaName) => {
	if (areaName == 'local') {
		samaks.updateCookies();
	}
});

/*
	kmitb
*/
const blackboardCookieSetter: ConfigCookies.CookieSetter = function (config, cookieWrap) {
	type BbRouter = {
		expires: string,
		id: string,
		signature: string,
		site: string,
		timeout: string,
		user: string,
		v: string,
		xsrf: string
	};

	if (!cookieWrap.cookie) return;

	let value = cookieWrap.cookie.value;
	let parsedValue = value.split(',')
		.map(str => str.split(':'))
		.reduce((acc, e) => {
			acc[e[0].trim()] = e[1].trim();
			return acc;
		}, {}) as BbRouter;
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
}
let kmitb = new ConfigCookies('kmitb', [
	// {
	// 	name: 'apt.sid',
	// 	url: 'https://.sejong.ac.kr',
	// 	cookieSetter: defaultCookieSetter
	// },
	// {
	// 	name: 'AWSELBCORS',
	// 	url: 'https://blackboard.sejong.ac.kr',
	// 	cookieSetter: defaultCookieSetter
	// },
	// {
	// 	name: 'AWSELB',
	// 	url: 'https://blackboard.sejong.ac.kr',
	// 	cookieSetter: defaultCookieSetter
	// },
	{
		name: 'BbRouter',
		url: 'https://blackboard.sejong.ac.kr',
		cookieSetter: blackboardCookieSetter
	},
	// {
	// 	name: 'JSESSIONID',
	// 	url: 'https://blackboard.sejong.ac.kr/learn/api',
	// 	cookieSetter: defaultCookieSetter
	// },
	{
		name: 'ssotoken',
		url: 'https://.sejong.ac.kr',
		cookieSetter: defaultCookieSetter
	}
]);
let kmitbNames = kmitb.cookiePackages.map(cookiePackage => {
	return cookiePackage.cookieWrap.target.name;
});
Extension.api.storage.onChanged.addListener((changes, areaName) => {
	if (areaName == 'local') {
		kmitb.updateCookies();
	}
});
Extension.api.cookies.onChanged.addListener(changeInfo => {
	if (changeInfo.removed) return;
	if ((changeInfo.cookie.domain == 'blackboard.sejong.ac.kr' ||
		changeInfo.cookie.domain == '.sejong.ac.kr') &&
		kmitbNames.includes(changeInfo.cookie.name)) {
		kmitb.updateCookies();
	}
});