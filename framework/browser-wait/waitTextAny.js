const common = require('../helpers').Common;
import { getTextArrayFromObjectArray } from '../browser-getter/getText';
import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for any text to (not )be visible within an element.
 * Waiting for no text to be present can have two possible use cases. 
 * 1. Waiting for an element that exists to have no text.
 * 2. Waiting for an element to not exist which gaurantess it has not text. 
 *      1. If notPresent == true && notRestrictive == false 
 *          An element must be present and with no text within it to pass.
 *      2. If notPresent == true && notRestrictive == true 
 *          If no element is found the function will pass.
 * @param {string}  element         Element locator
 * @param {int}     ms              Time to wait in Milliseconds
 * @param {boolean} notPresent      True state waits for text to not be present
 * @param {boolean} notRestrictive  If not text is expected a true state allows the function to pass if no element is found.
 * @param {boolean} allowBrackets   True state allows text to contain brackets. False state will fail if text contains brackets. 
 */
export function waitTextAny(element, ms, notPresent, notRestrictive, allowBrackets) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    notPresent = !!notPresent;
    //If set to true will enable console logs. 
    let debug = false;
    let elCount;
    let els;
    let expectation = notPresent ? 0 : 1;
    let result;
    let theText = '';
    try {
        browser.waitUntil(function () {
            result = -1;
            els = getElements(element);
            //Check to see if els is null before getting the length of the element.
            if (!els.length) elCount = 0;
            else elCount = els.length;
            if (elCount === 0 && notPresent && notRestrictive) {
                result = 0
            }
            if (elCount > 0) {
                theText = getTextArrayFromObjectArray(els);
                if (debug) console.log('------------------\nelement: ' + element + '\ntext: "' + theText + '"');
                if (debug) console.log('length: ' + theText.length);
                for (let k = 0; k < theText.length; k++) {
                    if (theText[k].length > 0) {
                        if (allowBrackets) result = 1;
                        else {
                            let containsBracket = /\{|\}|\[|\]/.test(theText[k]);
                            //If bracket is found fail
                            if (containsBracket) {
                                result = 2;
                                return false;
                            }
                            else result = 1;
                        }
                        break;
                    }
                    else {
                        result = 0;
                    }
                }
                if (debug) console.log('result: ' + result);
            }
            return expectation === result;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            if (notPresent) {
                throw new Error('waitTextAny Timed out after ' + waitTime + ' ms for element "' + element + '" expected no text, but found "' + theText + '" in ' + elCount + ' elements');
            }
            else {
                if (result === 2) throw new Error('waitTextAny Timed out after ' + waitTime + '\nFound text with brackets\nElement: ' + element + '\nText Found: ' + theText);
                else throw new Error('waitTextAny Timed out after ' + waitTime + ' ms for element "' + element + '" expected text, but found none in ' + elCount + ' elements');
            }
        }
        else throw new Error('waitTextAny ' + err);
    }
}
