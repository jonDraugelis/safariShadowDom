import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for element occurrence to be no more than a given amount.
 * @param {int}     element         Element locator.
 * @param {int}     occurrence      Occurrence of element. Index begins at 1. 
 * @param {int}     ms              Optional wait time in ms. 
 */
export function waitOccurrenceAtMost(element, occurrence, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let elCount;
    let el;
    try {
        browser.waitUntil(function () {

            //If stale element error is found catch the error and log a warning to the console.
            try {
                el = getElements(element);
            }
            catch (err) {
                if (err.toString().includes('stale element')) {
                    console.log('--*-*-* waitOccurrenceAtMost Caught: stale Element *-*-*-- Element: ' + element);
                }
                else throw new Error(err);
            }
            if (!el.length) elCount = 0;
            else elCount = el.length;
            return elCount <= occurrence;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitOccurrenceAtMost Timed out at ' + waitTime + ' milliseconds.\nElement count did not meet expectation.\nElement: ' + element + '\nFound Count: ' + elCount + '\nExpected Count: ' + occurrence);
        }
        else {
            throw new Error('waitOccurrenceAtMost ' + err)
        }
    }
}