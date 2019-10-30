import { getText } from '../browser-getter/getText';

const common = require('../helpers').Common;

//TODO: handle an array of stings with .join and .typeof
//if an array of strings is found throw a warning to the console that 
//an array of values was joined to create a single value. 
/**
 * Greater than (less than) comparison of element text numeric value to an expected value
 * @param {string}  element     Element locator
 * @param {int}     expected    Value to compare against
 * @param {int}     ms          Wait time in milliseconds
 * @param {boolean} notGreater  Optional reverse condition. Default waits for text value to be greater than. True state waits for less than.
 */
export function waitTextValueGreaterThan(element, expected, ms, notGreater) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let condition;
    let foundValue;
    let debug = false;
    let foundText;
    let textNumeric;
    try {
        browser.waitUntil(function () {
            try {
                foundText = getText(element);
                if (debug) console.log('-----------------\nelement: ' + element + '\text in Elemnt: ' + foundText);
            }
            catch (err) {
                if (err.toString().includes('element could not be located')) {
                    //if element is not located then keep looking
                    condition = 0;
                    return false;
                }
                else if (err.toString().includes('stale element')) {
                    console.log('--*-*-* waitTextValueGreaterThan Caught: stale Element *-*-*-- Element: ' + element);
                }
                else {
                    throw new Error(err);
                }
            }
            //If text is found convert it to a numeric value
            if (foundText) {
                if (common.getVariableType(foundText) == 'array') throw new Error('Elements must be unique. replace() cannot be used on an array');
                textNumeric = foundText.replace(/[^\d.-]/g, '');
                foundValue = parseFloat(textNumeric);
            }
            //If text is not numeric return false
            if (!foundValue && foundValue !== 0) {
                condition = 1;
                return false;
            }
            //Check against less than expectation
            if (notGreater) {
                if (foundValue < parseFloat(expected)) return true;
                else condition = 2;
            }
            //Check against greater than expectation
            else {
                if (foundValue > parseFloat(expected)) return true;
                else condition = 3;
            }
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            if (condition === 0) {
                throw new Error('waitTextValueGreaterThan Timed out at ' + waitTime + ' ms.\nElement was not located on the page.' + '\nElement: ' + element)
            }
            else if (condition === 1) {
                throw new Error('waitTextValueGreaterThan Timed out at ' + waitTime + ' ms.\nFound text was not numeric: ' + foundText + '\nElement: ' + element);
            }
            else if (condition === 2) {
                throw new Error('waitTextValueGreaterThan Timed out at ' + waitTime + ' ms.\nFound value was not < expected\nExpected Value: ' + expected + '\nFound Value: ' + foundValue + '\nElement: ' + element);
            }
            else if (condition === 3) {
                throw new Error('waitTextValueGreaterThan Timed out at ' + waitTime + ' ms.\nFound value was not > expected\nExpected Value: ' + expected + '\nFound Value: ' + foundValue + '\nElement: ' + element);
            }
            else {
                throw new Error('waitTextValueGreaterThan ' + err);
            }
        }
    }
}
