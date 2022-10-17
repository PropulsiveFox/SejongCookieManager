import Extension from "./Extension.js";
import TimeUnit from "./TimeUnit.js";
import Config from "./Config.js";
class ConfigAPI {
    #id;
    enabled;
    value;
    unit;
    constructor(id) {
        this.#id = id;
    }
    get_storage() {
        return new Promise((resolve, reject) => {
            Extension.api.storage.local.get(this.#id)
                .then(o => {
                let config = o[this.#id];
                if (!Config.isConfig(config))
                    config = new Config();
                this.enabled = config.enabled;
                this.value = config.value;
                this.unit = config.unit;
                return resolve();
            })
                .catch(err => reject(err));
        });
    }
    set_storage() {
        return new Promise((resolve, reject) => {
            let cfg = new Config();
            cfg.enabled = this.enabled;
            cfg.value = this.value;
            cfg.unit = this.unit;
            let o = {};
            o[this.#id] = cfg;
            Extension.api.storage.local.set(o)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
    parse_delta_time() {
        if (this.enabled == false)
            return undefined;
        switch (this.unit) {
            case TimeUnit.Year:
                return this.value * 366 * 24 * 60 * 60;
            case TimeUnit.Month:
                return this.value * 31 * 24 * 60 * 60;
            case TimeUnit.Week:
                return this.value * 7 * 24 * 60 * 60;
            case TimeUnit.Day:
                return this.value * 24 * 60 * 60;
            case TimeUnit.Hour:
                return this.value * 60 * 60;
            case TimeUnit.Minute:
                return this.value * 60;
            case TimeUnit.Second:
            default:
                return this.value;
        }
    }
    parse_unix_time() {
        if (this.enabled == false)
            return undefined;
        return Math.round(Date.now() / 1000) + this.parse_delta_time();
    }
}
export default ConfigAPI;
