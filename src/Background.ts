import Extension from "./Extension.js";
import ConfigAPI from "./ConfigAPI.js";
import CookieWrap from "./CookieWrap.js";

interface ConfigCookies {
	config: ConfigAPI;
	cookies: Array<CookieWrap>;
}
class ConfigCookies {
	config: ConfigAPI;
	cookies: Array<CookieWrap>;

	constructor(id: string, cookies: Array<{ name: string, url: string, cookieSetter: CookieWrap.CookieSetter }>) {
		this.config = new ConfigAPI(id);
		this.cookies = new Array();
		cookies.forEach(obj => this.cookies.push(new CookieWrap(obj.name, obj.url, obj.cookieSetter)));
	}

	updateCookies(): Promise<void> {

	}
}
