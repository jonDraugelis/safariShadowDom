import { getElements } from '../browser-getter/getElementObject';

const common = require('../helpers').Common;

/**
 * Wait for an element to (not )exist.
 * @param {string}      element         Element locator.
 * @param {int}         ms              Optional wait in Milliseconds. Defaults to 30000
 * @param {boolean}     notPresent      Optional reverse condition. Default waits for element to exist. true state waits for it to not exist. 
 */
export function waitExist(element, ms, notPresent) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 30000;
    let els;
    let elCount;
    if (!notPresent) {
        browser.waitUntil(function () {
            els = getElements(element, 'throwError');
            if (!els.length) elCount = 0;
            else elCount = els.length;
            return elCount > 0;
        }, waitTime, 'waitExist Timed out after ' + waitTime + ' ms. Expected ' + element + ' to be present. ');
    }
    //The browser.waitForExist notPresent variable does nothing. 
    //to account for that bug we coded for the notPresent case.
    else {
        browser.waitUntil(function () {
            try {
                els = getElements(element);
            }
            catch (err) {
                if (err.toString().includes("javascript error: Cannot read property 'createShadowRoot' of null")) {
                    console.log('--*-*-* waitExist Caught: createShadowRoot *-*-*-- Element: ' + element);
                }
                else common.throwError(err);
            }
            if (!els) elCount = 0;
            else elCount = els.length;
            return elCount === 0;
        }, waitTime, 'waitExist Timed out after ' + waitTime + ' ms. Expected ' + element + ' to not be present. ');
    }
}