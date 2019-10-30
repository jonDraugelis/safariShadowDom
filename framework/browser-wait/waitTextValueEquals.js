import { getText } from '../browser-getter/getText';

const common = require('../helpers').Common;

/**
 * Greater than (less than) comparison of element text numeric value to an expected value
 * @param {string}  element     Element locator
 * @param {int}     expected    Value to compare against
 * @param {int}     ms          Wait time in milliseconds
 */
export function waitTextValueEquals(element, expected, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let condition;
    let foundValue;
    let foundText;
    let textNumeric;
    try {
        browser.waitUntil(function () {
            try {
                foundText = getText(element);
            }
            catch (err) {
                if (err.toString().includes('element could not be located')) {
                    //if element is not located then keep looking
                    condition = 0;
                }
                else if (err.toString().includes('stale element')) {
                    console.log('--*-*-* waitTextValueEquals Caught: stale Element *-*-*-- Element: ' + element);
                }
                else {
                    throw new Error(err);
                }
            }
            //If text is found convert it to a numeric value
            if (foundText) {
                if (common.getVariableType(foundText) == 'array') throw new Error('Elements must be unique. replace() cannot be used on an array');
                textNumeric = foundText.replace(/[^\d]/g, '');
                foundValue = parseInt(textNumeric);
            }
            //If text is not numeric return false
            if (!foundValue && foundValue !== 0) {
                condition = 1;
                return false;
            }
            //Check against expectation
            else {
                if (foundValue == expected) return true;
                else condition = 2;
            }
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            if (condition === 0) {
                throw new Error('waitTextValueEquals Timed out at ' + waitTime + ' ms.\nElement was not located on the page.' + '\nElement: ' + element)
            }
            else if (condition === 1) {
                throw new Error('waitTextValueEquals Timed out at ' + waitTime + ' ms.\nFound text was not numeric: ' + foundText + '\nElement: ' + element);
            }
            else if (condition === 2) {
                throw new Error('waitTextValueEquals Timed out at ' + waitTime + ' ms.\nFound value was not == expected\nExpected Value: ' + expected + '\nFound Value: ' + foundValue + '\nElement: ' + element);
            }
            else {
                throw new Error('waitTextValueEquals ' + err);
            }
        }
    }
}
