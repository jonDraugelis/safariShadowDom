import { getElements } from "../browser-getter/getElementObject";

/**
 * Wait for element one to exist or for element two to not exist
 * @param {string} elToExist      First element locator, wait for exist
 * @param {string} elToNotExist   Second element locator, wait for not exist
 * @param {int}    ms           wait time in milliseconds
 */
export function waitExistsElementOneOrNotExistsElTwo(elToExist, elToNotExist, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let els1;
    let elCount1;
    let els2;
    let elCount2;
    try {getElements
        browser.waitUntil(function () {
            els1 = getElements(elToExist);
            els2 = getElements(elToNotExist);
            if (!els1.length) elCount1 = 0;
            else elCount1 = els1.length;
            if (!els2.length) elCount2 = 0;
            else elCount2 = els2.length;
            if (elCount1 > 0 || elCount2 === 0) {
                return true;
            }
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitExistsElementNotExistElTwo Timed out after ' + waitTime + ' ms\nWaited for element one to exist or for element two to not exist\nElement One: ' + elToExist + '\nElement One Occurrence: ' + elCount1 + '\nElement two: ' + elToNotExist + '\nElement Two Occurrence: ' + elCount2);
        }
        else {
            throw new Error('waitExistsElementNotExistElTwo\n' + err);
        }
    }
}
