import ConfigAPI from "../src/ConfigAPI.js";
class PopupUIBlock extends ConfigAPI {
    ui;
    constructor(id) {
        super(id);
        this.ui = {
            enabled: document.querySelector(`#${id}`),
            value: document.querySelector(`#value-${id}`),
            units: document.querySelectorAll(`[name="unit-${id}"]`)
        };
    }
    set_to_ui() {
        return new Promise((resolve, reject) => {
            this.get_storage()
                .then(() => {
                this.ui.enabled.checked = this.enabled;
                this.ui.value.value = this.value.toString();
                this.ui.units.forEach(element => {
                    if (element.id.split('-')[0] == this.unit) {
                        element.checked = true;
                    }
                });
                return resolve();
            })
                .catch(err => reject(err));
        });
    }
    get_from_ui() {
        this.enabled = this.ui.enabled.checked;
        this.value = Number.parseInt(this.ui.value.value);
        for (let element of this.ui.units) {
            if (element.checked == true) {
                this.unit = element.id.split('-')[0];
                break;
            }
        }
        return this.set_storage();
    }
}
export default PopupUIBlock;
