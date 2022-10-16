class Extension {
    static #isChromium;
    static api;
    static {
        if (navigator.userAgent.toLowerCase().includes('chrome'))
            this.#isChromium = true;
        else
            this.#isChromium = false;
        if (this.#isChromium)
            this.api = chrome;
        else
            this.api = browser;
    }
    static get isChromium() {
        return this.#isChromium;
    }
}
export default Extension;
