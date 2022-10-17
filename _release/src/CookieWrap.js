import Extension from "./Extension.js";
class CookieWrap {
    target;
    cookie;
    cookieDetails;
    constructor(name, url) {
        this.target = { name: name, url: url };
    }
    get_cookie() {
        return new Promise((resolve, reject) => {
            Extension.api.cookies.get(this.target)
                .then(cookie => {
                this.cookie = cookie;
                return resolve();
            })
                .catch(err => reject(err));
        });
    }
    set_cookie() {
        // @ts-ignore
        this.cookieDetails = new Object();
        this.cookieDetails.url = this.target.url;
        for (let key in this.cookie)
            this.cookieDetails[key] = this.cookie[key];
        // @ts-ignore
        delete this.cookieDetails.session;
        delete this.cookieDetails.hostOnly;
        delete this.cookieDetails.domain;
        delete this.cookieDetails.storeId;
        return new Promise((resolve, reject) => {
            // @ts-ignore
            Extension.api.cookies.set(this.cookieDetails)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
}
export default CookieWrap;
