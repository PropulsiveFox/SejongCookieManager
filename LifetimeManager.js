import Browser from "./Browser.js";
import ConfigLoader from "./ConfigLoader.js";
import Cookie from "./Cookie.js";

/** @type { {samaks: ConfigLoader, kmitb: ConfigLoader} } */
let configs = {
	samaks: new ConfigLoader('samaks'),
	kmitb: new ConfigLoader('kmitb')
}
/** @type { {chknos: Cookie, BbRouter: Cookie} } */
let cookies = {
	chknos: new Cookie('chknos', 'portal.sejong.ac.kr', { setValue: true, value: 'false' }),
	BbRouter: new Cookie('BbRouter', 'blackboard.sejong.ac.kr', { setValue: false })
}

function cookieChangeHandler(changeInfo) {
	if (changeInfo.removed == true) return;

	if (changeInfo.cookie.domain == 'blackboard.sejong.ac.kr' &&
		changeInfo.cookie.name == 'BbRouter') {
		cookies.BbRouter.getCookie().then(() => {
			// expires:1665642501,id:A6,signature:b9,site:c8,timeout:10800,user:64,v:2,xsrf:e4
			/** @type {string} */
			let cookieValue = cookies.BbRouter.cookieInfo.value;
			/** @type {{expires: string, timeout: string}} */
			let parsedObject = cookieValue
				.split(',')
				.map(str => str.split(':'))
				.reduce((acc, e) => {
					acc[e[0].trim()] = acc[e[1].trim()];
					return acc;
				}, {});

			parsedObject.expires = Math.round(Date.now() / 1000 + Cookie.evalTime(configs.kmitb.value, configs.kmitb.unit)).toString();
			parsedObject.timeout = (34560000).toString();

			let stringified = new Array();
			for (let key in parsedObject) {
				stringified.push(`${key}:${parsedObject[key]}`);
			}
			stringified = stringified.join(',');
			cookies.BbRouter.cookieInfo.value = stringified;
		});
	}
	else return;
}
if (Browser.isChromium) chrome.cookies.onChanged.addListener(cookieChangeHandler);
else browser.cookies.onChanged.addListener(cookieChangeHandler);

function changeHandler(changes, areaName) {
	if (areaName != 'local') return;

	config.fetch_from_storage();
	if (config.isEnabled) {
		// todo: update cookie
	}
}
ConfigLoader.addChangeHandler(changeHandler);

function messageHandler(message) {
	if(message.value = 'samaks')
}
if (Browser.isChromium) chrome.runtime.onMessage.addListener(messageHandler);
