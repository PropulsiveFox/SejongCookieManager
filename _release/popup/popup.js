import PopupUIBlock from "./PopupUIBlock.js";
const LOAD_STATUS = document.querySelector('#load-status');
const SAVE_STATUS = document.querySelector('#save-status');
const SAVE_BUTTON = document.querySelector('#save-config');
const DISCLAIMER_BUTTON = document.querySelector('#security-risk-understood');
function setStyleToSuccessful(element) {
    element.style.transition = '';
    element.style.opacity = '1';
    element.style.color = '#33cc33';
    element.style.transition = 'opacity .6s ease';
    clearTimeout(fadeoutTimeout);
    fadeoutTimeout = setTimeout(() => {
        element.style.opacity = '0';
    }, 2000);
}
function setStyleToFailed(element) {
    element.style.transition = '';
    element.style.opacity = '1';
    element.style.color = '#ff3333';
}
let fadeoutTimeout;
let Configs = new Array(new PopupUIBlock('samaks'), new PopupUIBlock('kmitb'));
// load phase
let loadPromises = new Array();
Configs.forEach(config => { loadPromises.push(config.set_to_ui()); });
Promise.all(loadPromises)
    .then(() => {
    setStyleToSuccessful(LOAD_STATUS);
    LOAD_STATUS.innerHTML = '로드됨';
})
    .catch(err => {
    console.error(err);
    setStyleToFailed(LOAD_STATUS);
    LOAD_STATUS.innerHTML = '로드 실패';
});
// save
SAVE_BUTTON.addEventListener('click', () => {
    if (!DISCLAIMER_BUTTON.checked)
        return;
    let savePromises = new Array();
    for (let config of Configs)
        savePromises.push(config.get_from_ui());
    Promise.all(savePromises)
        .then(() => {
        setStyleToSuccessful(SAVE_STATUS);
        SAVE_STATUS.innerHTML = '저장됨';
    })
        .catch(err => {
        console.error(err);
        setStyleToFailed(SAVE_STATUS);
        SAVE_STATUS.innerHTML = '저장 실패';
    });
});
