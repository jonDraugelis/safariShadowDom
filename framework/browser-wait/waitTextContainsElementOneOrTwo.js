import { getElements } from "../browser-getter/getElementObject";
import { getText, getTextFromObject } from "../browser-getter/getText";

/**
 * Wait for element one or element two to contain the given text string.
 * If the text in element two is found the function can be made to pass or fail.
 *      As an example this function could be used to wait for a login failure message or success message.
 *      And if the failure message is found then the function could fail.
 *      Or the step could wait for one of two expected outcomes.
 * @param {string} elementOne      First page locator
 * @param {string} elTextOne    Text string to be found in first locator
 * @param {string} elementTwo   Second page locator
 * @param {string} elTextTwo    Text string to be found in sedond locator
 * @param {int}    ms           wait time in milliseconds
 * @param {boolean} ifFoundFailTwo If true then the step will fail if the text in element two is found. 
 */
export function waitTextContainsElementOneOrTwo(elementOne, elTextOne, elementTwo, elTextTwo, ms, ifFoundFailTwo) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let textWasFoundTwo;
    let textRecordOne = '';
    let textRecordTwo = '';
    let elements;
    let elementsTwo;
    try {
        browser.waitUntil(() => {
            elements = getElements(elementOne);
            elementsTwo = getElements(elementTwo);
            for (let i in elements) {
                textRecordOne = getTextFromObject(elements[i]);
                if (textRecordOne.toLowerCase().includes(elTextOne.toLowerCase())) {
                    return true;
                }
            }
            for (let k in elementsTwo) {
                textRecordTwo = getTextFromObject(elementsTwo[k]);
                if (textRecordTwo.toLowerCase().includes(elTextTwo.toLowerCase())) {
                    textWasFoundTwo = true;
                    return textWasFoundTwo;
                }
            }
        }, waitTime, 'timeOut');
        if (textWasFoundTwo && ifFoundFailTwo) {
            throw new Error('waitTextContainsElementOneOrTwo\nExpected to not find text "' + elTextTwo + '" in element "' + elementTwo + '" but did.');
        }
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notExpectedTwo = ifFoundFailTwo ? 'not ' : '';
            throw new Error('waitTextContainsElementOneOrTwo Timed out after ' + waitTime + ' ms\nWaiting for element "' + elementOne + '" to contain text "' + elTextOne + '"\nOr for element ' + elementTwo + ' to ' + notExpectedTwo + 'contain text "' + elTextTwo + '"\nIn element one found text:\n"' + textRecordOne + '"\nIn element two found text:\n"' + textRecordTwo + '"');
        } else {
            throw new Error('waitTextContainsElementOneOrTwo ' + err);
        }
    }
}
