import { getElements } from "../browser-getter/getElementObject";
import { getText, getTextFromObject, getTextArrayFromObjectArray } from "../browser-getter/getText";

/**
 * Wait for an exact text string to (not )be visible within an element.
 * @param {string}  element       Element locator
 * @param {string}  text          Case Sensitive text
 * @param {int}     ms            Milliseconds to wait
 * @param {boolean} notPresent    True state waits for text to not be present
 */
export function waitTextEquals(element, text, ms, notPresent) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let textWasFound = false;
    let textRecord = '';
    notPresent = !!notPresent;
    let els;
    let elCount;
    try {
        browser.waitUntil(function () {
            textRecord = '';
            let elText;
            els = getElements(element);
            if (!els.length) elCount = 0;
            else elCount = els.length;

            for (let i in els) {
                elText = getTextFromObject(els[i]);
                let appendage = i ? '' : ', ';
                textRecord += elText + appendage;
                if (elText.toString() === text) textWasFound = true;
            }

            return notPresent != textWasFound;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notPresentString = notPresent ? '' : 'not ';
            throw new Error('waitTextEquals Timed out after ' + waitTime + ' ms\nExact text was ' + notPresentString + 'found.\nExpected Text: ' + text + '\nFound Text: ' + textRecord + '\nElement: ' + element + '\nElement count: ' + elCount);
        }
        else throw new Error('waitTextEquals ' + err);
    }
}
