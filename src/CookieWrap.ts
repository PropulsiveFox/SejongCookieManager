import Extension from "./Extension.js";

class CookieWrap {
	target: { name: string, url: string };

	cookie: chrome.cookies.Cookie | browser.cookies.Cookie;

	cookieDetails: chrome.cookies.SetDetails | browser.cookies._SetDetails;

	constructor(name: string, url: string) {
		this.target = { name: name, url: url };
	}

	get_cookie(): Promise<void> {
		return new Promise((resolve, reject) => {
			Extension.api.cookies.get(this.target)
				.then(cookie => {
					this.cookie = cookie;
					return resolve();
				})
				.catch(err => reject(err));
		});
	}

	set_cookie(): Promise<void> {
		// @ts-ignore
		this.cookieDetails = new Object() as chrome.cookies.SetDetails;
		this.cookieDetails.url = this.target.url;
		for (let key in this.cookie) this.cookieDetails[key] = this.cookie[key];
		// @ts-ignore
		delete this.cookieDetails.session; delete this.cookieDetails.hostOnly;
		delete this.cookieDetails.domain; delete this.cookieDetails.storeId;
		return new Promise((resolve, reject) => {
			// @ts-ignore
			Extension.api.cookies.set(this.cookieDetails)
				.then(() => resolve())
				.catch(err => reject(err));
		});
	}
}

export default CookieWrap;