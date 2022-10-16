class CookieWrap {
    #target;
    // fetchedCookie: Cookie;
    constructor(name, url, valueSetter) {
        this.#target = { name: name, url: url };
    }
}
export {};
