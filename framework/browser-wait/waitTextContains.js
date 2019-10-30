const common = require('../helpers').Common;
import { getText, getTextArrayFromObjectArray } from '../browser-getter/getText';
import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for a specific text string to (not )be visible within any occurrence of an element.
 * @param {string}  element       Element locator
 * @param {string}  text          Case insensitive text
 * @param {int}     ms            Milliseconds to wait
 * @param {boolean} notPresent    True state waits for text to not be present
 * @param {boolean} notRestrictive  True state allows the function to pass if no element is found. 
 */
export function waitTextContains(element, text, ms, notPresent, notRestrictive) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    notPresent = !!notPresent;
    //If set to true will enable console logs. 
    let debug = false;
    let els;
    let elCount;
    let expectation = notPresent ? 0 : 1;
    let result;
    let theText = '';

    try {
        browser.waitUntil(() => {
            result = -1;
            els = getElements(element);
            if (!els.length) elCount = 0;
            else elCount = els.length;
            if (elCount == 0 && notPresent && notRestrictive) {
                result = 0;
            }
            if (elCount > 0) {
                theText = getTextArrayFromObjectArray(els);
                if (debug) console.log('------------------\nelement: ' + element + '\ntext: "' + theText + '"');
                for (let k = 0; k < theText.length; k++) {
                    if (theText[k].toLowerCase().includes(text.toLowerCase())) {
                        result = 1;
                        break;
                    }
                    else {
                        result = 0;
                    }
                }
                if (debug) console.log('condition: ' + result);
            }
            return expectation === result;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let maybeNot = notPresent ? 'not ' : '';
            throw new Error('waitTextContains() timed out after ' + waitTime + ' ms\nExpected element to ' + maybeNot + 'contain text\nElement Given: ' + element + '\nElement Occurred: ' + elCount + '\nText Expected: ' + text + '\nText Found: ' + theText);
        }
        else throw new Error('waitTextContains ' + err);
    }
}
