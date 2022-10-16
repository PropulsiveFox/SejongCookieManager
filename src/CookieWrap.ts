import Extension from "./Extension";

namespace CookieWrap {
	export type CookieSetter = (this: CookieWrap) => void;
}

class CookieWrap {
	#target: { name: string, url: string };

	cookie: chrome.cookies.Cookie | browser.cookies.Cookie;

	cookieSetter: CookieWrap.CookieSetter
	cookieDetails: chrome.cookies.SetDetails | browser.cookies._SetDetails;

	constructor(name: string, url: string, cookieSetter: CookieWrap.CookieSetter) {
		this.#target = { name: name, url: url };
		this.cookieSetter = cookieSetter;
	}

	get_cookie(): Promise<void> {
		return new Promise((resolve, reject) => {
			Extension.api.cookies.get(this.#target)
				.then(cookie => {
					this.cookie = cookie;
					return resolve();
				})
				.catch(err => reject(err));
		});
	}

	set_cookie(): Promise<void> {
		this.cookieSetter();
		this.cookieDetails.url = this.#target.url;
		for (let key in this.cookie) this.cookieDetails[key] = this.cookie[key];
		return new Promise((resolve, reject) => {
			// @ts-ignore
			Extension.api.cookies.set(this.cookieDetails)
				.then(() => resolve())
				.catch(err => reject(err));
		});
	}
}

export default CookieWrap;