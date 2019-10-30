import { getTextFromObject } from "../browser-getter/getText";
import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for element one or element two to contain the any text string.
 * If text in element two is found the function can be made to pass or fail.
 *      As an example this function could be used to wait for a login failure message or success message.
 *      And if the failure message is found then the function could fail.
 * @param {string} elementOne      First page locator
 * @param {string} elementTwo   Second page locator
 * @param {int}    ms           wait time in milliseconds
 * @param {boolean} ifFoundFailTwo If true then the step will fail if the text in element two is found. 
 */
export function waitTextAnyElementOneOrTwo(elementOne, elementTwo, ms, ifFoundFailTwo) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let textWasFoundTwo;
    let textRecordOne = '';
    let textRecordTwo = '';
    let elementsOne;
    let elementsTwo;
    try {
        browser.waitUntil(function () {
            elementsOne = getElements(elementOne);
            elementsTwo = getElements(elementTwo);
            for (let i in elementsOne) {
                textRecordOne = getTextFromObject(elementsOne[i]);
                if (textRecordOne.length > 0) {
                    return true;
                }
            }
            for (let k in elementsTwo) {
                textRecordTwo = getTextFromObject(elementsTwo[k]);
                if (textRecordTwo.length > 0) {
                    textWasFoundTwo = true;
                    return textWasFoundTwo;
                }
            }
        }, waitTime, 'timeOut');
        if (textWasFoundTwo && ifFoundFailTwo) {
            throw new Error('waitTextAnyElementOneOrTwo\nExpected to not find text in element "' + elementTwo + '" but did.\nText Found: ' + textRecordTwo);
        }
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notExpectedTwo = ifFoundFailTwo ? 'not ' : '';
            throw new Error('waitTextAnyElementOneOrTwo Timed out after ' + waitTime + ' ms\nWaiting for element "' + elementOne + '" to contain text.\nWaiting for element "' + elementTwo + '" to ' + notExpectedTwo + 'contain text"\nIn element one found text:\n"' + textRecordOne + '"\nIn element two found text:\n"' + textRecordTwo + '"');
        } else {
            throw new Error('waitTextAnyElementOneOrTwo ' + err);
        }
    }
}
