import { getElements } from '../browser-getter/getElementObject';

const common = require('../helpers').Common;

/**
 * Wait for element occurrence to equal expected count.
 * @param {string}  element         Element locator.
 * @param {int}     occurrence      Occurrence of element. Index begins at 1. 
 * @param {int}     ms              Optional wait time in ms. 
 */
export function waitOccurrence(element, occurrence, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    // Some steps will call waitOccurrence multiple times and use a calculated remainder of time for the input 'ms'
    // For these steps its possible to input a negative wait time.
    // If a negative wait is inputed set it equal to 0
    if (ms < 0) ms = 0;
    const waitTime = ms || 0;
    let elCount;
    let el;
    try {
        browser.waitUntil(function () {
            el = getElements(element);
            if (!el.length) elCount = 0;
            else elCount = el.length;
            return elCount == occurrence;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitOccurrence Timed out at ' + waitTime + ' milliseconds.\nElement count did not equal expected count.\nExpected Count: ' + occurrence + '\nFound Count: ' + elCount + '\nVar types: ' + common.getVariableType(elCount) + ' ' + common.getVariableType(occurrence) + '\nElement: ' + element);
        }
        else throw new Error('waitOccurrence ' + err);
    }
}