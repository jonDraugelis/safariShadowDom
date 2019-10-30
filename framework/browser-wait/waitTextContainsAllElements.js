const common = require('../helpers').Common;
import { getElements } from "../browser-getter/getElementObject";
import { getText, getTextArrayFromObjectArray } from "../browser-getter/getText";

/**
 * Wait for a specific text string to be visible within all occurrences of an element.
 * @param {string}  element       Element locator
 * @param {string}  text          Case insensitive text
 * @param {int}     ms            Milliseconds to wait
 */
export function waitTextContainsAllElements(element, textExp, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    //If set to true will enable console logs. 
    let debug = false;
    let els;
    let elCount;
    let result;
    let getType;
    let theText = '';

    try {
        browser.waitUntil(function () {
            result = -1;
            els = getElements(element);
            if (!els.length) elCount = 0;
            else elCount = els.length;
            if (elCount == 0 && notPresent && notRestrictive) {
                result = 0
            }
            if (elCount > 0) {
                theText = getTextArrayFromObjectArray(els);
                if (debug) console.log('------------------\nelement: ' + element + '\ntext: "' + theText + '"');
                for (let k = 0; k < theText.length; k++) {
                    if (debug) console.log('Found: ' + theText[k].toLowerCase() + '\nContains Expected: ' + theText[k].toLowerCase().includes(textExp.toLowerCase()));
                    if (!theText[k].toLowerCase().includes(textExp.toLowerCase())) {
                        result = 0;
                        break;
                    }
                    else {
                        result = 1;
                    }
                }
                if (debug) console.log('condition: ' + result);
            }
            return 1 === result;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            if (result === 0) throw new Error('waitTextContainsAllElements Timed out after ' + waitTime + ' ms\nExpected all elements "' + element + '" to contain text "' + textExp + '"\nInstead, found the following text in ' + elCount + ' elements\n' + theText);
            else if (result === -1) throw new Error('waitTextContainsAllElements Timed out after ' + waitTime + ' ms\nExpected all elements "' + element + '" to contain text "' + textExp + '"\nInstead, found no elements');
            else throw new Error('waitTextContainsAllElements unexpected condition occurred: ' + result);
        }
        else throw new Error('waitTextContainsAllElements ' + err);
    }
}
