import ConfigAPI from "./ConfigAPI.js";
import CookieWrap from "./CookieWrap.js";
class ConfigCookies {
    config;
    cookiePackages;
    constructor(id, cookies) {
        this.config = new ConfigAPI(id);
        this.cookiePackages = new Array();
        cookies.forEach(obj => {
            this.cookiePackages.push({ cookieWrap: new CookieWrap(obj.name, obj.url), cookieSetter: obj.cookieSetter });
        });
    }
    updateCookies() {
        return new Promise((resolve, reject) => {
            this.config.get_storage().then(() => {
                let promises = new Array();
                this.cookiePackages.forEach(cookiePackage => promises.push(cookiePackage.cookieWrap.get_cookie()));
                Promise.all(promises).then(() => {
                    let promises = new Array();
                    this.cookiePackages.forEach(cookiePackage => {
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
