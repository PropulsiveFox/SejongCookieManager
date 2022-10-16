import Extension from "./Extension.js";
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
}
export default ConfigAPI;
