import { waitExist } from '../browser-wait/wait.js';
import { getElement } from '../browser-getter/getElementObject.js';

/**
 * Enter text in form filed. Step will clear existing text. 
 * An optional wait is the third parameter.
 * @param {string}  element     Page element
 * @param {string}  text        Text to be entered into the page element
 * @param {int}     ms          Optional wait in milliseconds
 */
export function enter(element, text, ms) {
    if (ms) waitExist(element, ms);
    getElement(element).setValue(text);
}

/**
 * Enter text in form filed. Step will not clear existing text. 
 * An optional wait is the third parameter.
 * @param {string}  element     Page element
 * @param {string}  text        Text to be entered into the page element
 * @param {int}     ms          Optional wait in milliseconds
 */
export function enterDoNotClear(element, text, ms) {
    if (ms) waitExist(element, ms);
    getElement(element).addValue(text);
}
