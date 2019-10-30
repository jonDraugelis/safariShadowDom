import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for element one or element two to exist
 * If element two is found the function can be made to pass or fail.
 *      As an example this function could be used to wait for a login failure element or success element.
 *      And if the failure element is found then the function could fail.
 *      Or the step could wait for one of two expected successful outcomes.
 * @param {string} elementOne      First element locator
 * @param {string} elementTwo   Second element locator
 * @param {int}    ms           wait time in milliseconds
 * @param {boolean} ifFoundFailTwo If true then the step will fail if element two is found. 
 */
export function waitExistsElementOneOrTwo(elementOne, elementTwo, ms, ifFoundFailTwo) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let els1;
    let elCount1;
    let els2;
    let elCount2;
    try {getElements
        browser.waitUntil(function () {
            els1 = getElements(elementOne);
            els2 = getElements(elementTwo);
            if (!els1.length) elCount1 = 0;
            else elCount1 = els1.length;
            if (!els2.length) elCount2 = 0;
            else elCount2 = els2.length;
            if (elCount1 > 0 || elCount2 > 0) {
                return true;
            }
        }, waitTime, 'timeOut');
        if (elCount2 > 0 && ifFoundFailTwo) {
            throw new Error('Expected element to not exist\nElement: ' + elementTwo + '\nElement Occurrence: ' + elCount2);
        }
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notExpectedTwo = ifFoundFailTwo ? '\nIf element two exists fail' : '';
            throw new Error('waitTextContainsElementOneOrTwo Timed out after ' + waitTime + ' ms\nWaited for element one to exist or element two to exist\nElement One: ' + elementOne + '\nElement One Occurrence: ' + elCount1 + notExpectedTwo + '\nElement two: ' + elementTwo + ' Element Two Occurrence: ' + elCount2);
        }
        else {
            throw new Error('waitTextContainsElementOneOrTwo\n' + err);
        }
    }
}
