import { getElements } from "../browser-getter/getElementObject";
import { getText, getTextArrayFromObjectArray } from "../browser-getter/getText";

const common = require('../helpers').Common;

/**
 * Wait for either of two strings to be visible within any occurrence of an element.
 * @param {*} element       Element locator
 * @param {*} text1         Case insensitive text
 * @param {*} text2         Case insensitive text
 * @param {*} ms            Milliseconds to wait
 */
export function waitTextContainsStringOneOrTwo(element, text1, text2, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let els;
    let elCount;
    let browserText = '';
    try {
        browser.waitUntil(function () {
            els = getElements(element);
            if (!els.length) elCount = 0;
            else elCount = els.length;
            if (elCount > 0) {
                browserText = getTextArrayFromObjectArray(els);
                for (let k = 0; k < browserText.length; k++) {
                    if (browserText[k].toLowerCase().includes(text1.toLowerCase()) || browserText[k].toLowerCase().includes(text2.toLowerCase())) {
                        return true;
                    }
                }
            }
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitTextContainsStringOneOrTwo Timed out after ' + waitTime + ' ms\nExpected Element: "' + element + '"\nExpected Text: "' + text1 + '" or "' + text2 + '"\nFound Element Count: ' + elCount + '\nFound Text: ' + browserText);
        }
        else throw new Error('waitTextContainsStringOneOrTwo ' + err);
    }
}
