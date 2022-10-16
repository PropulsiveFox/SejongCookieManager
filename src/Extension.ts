class Extension {
	static #isChromium: boolean;
	static api: typeof chrome | typeof browser;

	static {
		if (navigator.userAgent.toLowerCase().includes('chrome'))
			this.#isChromium = true;
		else this.#isChromium = false;

		if (this.#isChromium) this.api = chrome;
		else this.api = browser;
	}

	static get isChromium(): boolean {
		return this.#isChromium;
	}
}

export default Extension;