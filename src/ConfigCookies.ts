import ConfigAPI from "./ConfigAPI.js";
import CookieWrap from "./CookieWrap.js";

namespace ConfigCookies {
	export type CookieSetter = (config: ConfigAPI, cookieWrap: CookieWrap) => void;
}

class ConfigCookies {
	config: ConfigAPI;
	cookiePackages: Array<{ cookieWrap: CookieWrap, cookieSetter: ConfigCookies.CookieSetter }>;

	constructor(id: string, cookies: Array<{ name: string, url: string, cookieSetter: ConfigCookies.CookieSetter }>) {
		this.config = new ConfigAPI(id);
		this.cookiePackages = new Array();
		cookies.forEach(obj => {
			this.cookiePackages.push({ cookieWrap: new CookieWrap(obj.name, obj.url), cookieSetter: obj.cookieSetter })
		});
	}

	updateCookies(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.config.get_storage().then(() => { // storage


				let promises = new Array();
				this.cookiePackages.forEach(cookiePackage => promises.push(cookiePackage.cookieWrap.get_cookie()));
				Promise.all(promises).then(() => { // cookies


					let promises = new Array();
					this.cookiePackages.forEach(cookiePackage => { //set cookies
						cookiePackage.cookieSetter(this.config, cookiePackage.cookieWrap);
						promises.push(cookiePackage.cookieWrap.set_cookie());
					});


					Promise.all(promises).then(() => resolve()).catch(err => reject(err));
				}).catch(err => reject(err));
			}).catch(err => reject(err));
		});
	}
}

export default ConfigCookies;