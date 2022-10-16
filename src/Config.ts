import TimeUnit from "./TimeUnit.js";

class Config {
	enabled: boolean;
	value: number;
	unit: TimeUnit;

	constructor() {
		this.enabled = false;
		this.value = 0;
		this.unit = TimeUnit.Day;
	}

	static isConfig(object: Config | object): object is Config {
		if (typeof object == 'object' &&
		typeof (object as Config).enabled == 'boolean' &&
		typeof (object as Config).value == 'number' &&
		TimeUnit.isTimeUnit((object as Config).unit)) return true;
	else return false;
	}
}

export default Config;