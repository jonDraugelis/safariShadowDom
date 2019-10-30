import { getElement } from "../browser-getter/getElementObject";
import { getAttribute } from "../browser-getter/getAttribute";
import { getText } from "../browser-getter/getText";

/**
 * Greater than (less than) comparison of element attribute numeric value to an expected value
 * @param {string}  element     Element locator
 * @param {string}  attribute   Attribute of element
 * @param {float}   expected    Value to compare against
 * @param {int}     ms          Wait time in milliseconds
 * @param {boolean} notGreater  Optional reverse condition. Default waits for text value to be greater than. True state waits for less than. 
 */
export function waitAttributeValueGreaterThan(element, attribute, expected, ms, notGreater) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let condition;
    let foundValue;
    try {
        browser.waitUntil(function () {
            try {
                let attributeNumeric = getAttribute(element, attribute);
                foundValue = parseFloat(attributeNumeric.replace(/[^\d.-]/g, ''));
            }
            catch (err) {
                if (err.toString().includes('element could not be located')) {
                    //if element is not located then keep looking
                    condition = 0;
                }
                else {
                    throw new Error(err);
                }
            }
            if (!foundValue && foundValue !== 0) {
                condition = 1;
                return false;
            }
            if (notGreater) {
                if (foundValue < expected) return true;
                else condition = 2;
            }
            else {
                if (foundValue > expected) return true;
                else condition = 3;
            }

        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            if (condition === 0) {
                throw new Error('waitAttributeValueGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + ' could not be located on the page.')
            }
            else if (condition === 1) {
                throw new Error('waitAttributeValueGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + ' found value was null or empty\nFoundValue: ' + foundValue);
            }
            else if (condition === 2) {
                throw new Error('waitAttributeValueGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + ' found value ' + foundValue + ' was not less than or equal to expected value ' + expected);
            }
            else if (condition === 3) {
                throw new Error('waitAttributeValueGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + ' found value ' + foundValue + ' was not greater than or equal to expected value ' + expected);
            }
            else {
                throw new Error('waitAttributeValueGreaterThan ' + err);
            }
        }
    }
}