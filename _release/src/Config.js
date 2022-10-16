import TimeUnit from "./TimeUnit.js";
class Config {
    enabled;
    value;
    unit;
    constructor() {
        this.enabled = false;
        this.value = 0;
        this.unit = TimeUnit.Day;
    }
    static isConfig(object) {
        if (typeof object == 'object' &&
            typeof object.enabled == 'boolean' &&
            typeof object.value == 'number' &&
            TimeUnit.isTimeUnit(object.unit))
            return true;
        else
            return false;
    }
}
export default Config;
