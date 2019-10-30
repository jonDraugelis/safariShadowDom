import { getText, getTextArrayFromObjectArray } from '../browser-getter/getText';
import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for the number of children containing any text to equal the expected count. 
 * @param {int}         element         Element locator.
 * @param {int}         occurrence      Occurrence of element. Index begins at 1. 
 * @param {int}         ms              Optional wait time in ms. 
 */
export function waitOccurrenceWithTextAny(element, occurrence, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let els;
    let elCount;
    let elText;
    let elTextCount;

    try {
        browser.waitUntil(function () {
            els = getElements(element);
            if (!els.length) elCount = 0;
            else elCount = els.length;

            if (elCount > 0) {
                elText = getTextArrayFromObjectArray(els, true);
                elTextCount = elText.length;
            }
            else elTextCount = 0

            return elTextCount === occurrence;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitOccurrenceChildTextAny Timed at ' + waitTime + ' milliseconds.\nElement ' + element + ' Element count ' + elCount + '.\nElements expected to contain text : ' + occurrence + '\nElements found containing text: ' + elText.length + '\nText found: ' + elText);
        }
        else throw new Error('waitOccurrenceChildTextAny ' + err);
    }
}