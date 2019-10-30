import { getText } from '../browser-getter/getText';

const common = require('../helpers').Common;

/**
 * Greater than (less than) comparison of element text length to an expected length
 * @param {string}   element        Element locator
 * @param {int}      expected       Expected test length to compare against
 * @param {int}      ms             Wait time in milliseconds
 * @param {boolean}  notGreater     Optional reverse condition. Default waits for text length to be greater than. True state waits for less than. 
 * @param {boolean}  notRestrictive  Optional condition. True state allows the function to pass if no element is found.
 */
export function waitTextLengthGreaterThan(element, expected, ms, notGreater, notRestrictive) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let condition;
    let debug = false;
    let foundText;
    let foundTextLength;
    try {
        browser.waitUntil(function () {
            try {
                foundText = getText(element)
                if (debug) console.log('-----------------\nelement: ' + element + '\text in Elemnt: ' + foundText);
            }
            catch (err) {
                if (err.toString().includes('element could not be located')) {
                    //if element is not located then keep looking
                }
                else if (err.toString().includes('stale element')) {
                    console.log('--*-*-* waitTextLengthGreaterThan Caught: stale Element *-*-*-- Element: ' + element);
                }
                else {
                    throw new Error(err);
                }
            }
            if (foundText || foundText === '') {
                //If multiple elements are returned throw an error. 
                if (common.getVariableType(foundText) == 'array') throw new Error('waitTextLengthGreaterThan Elements must be unique.');
                if (debug) console.log('foundText: ' + foundText);
                foundTextLength = foundText.length;
                if (!notGreater) {
                    if (debug) console.log('foundTextLength: ' + foundTextLength + ' Expected: ' + expected);
                    if (foundTextLength > expected) return true;
                    else condition = 1;
                }
                else {
                    if (foundTextLength < expected) return true;
                    else condition = 2;
                }
            }
            else {
                if (notGreater && notRestrictive) return true;
                condition = 0;
            }
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (debug) console.log('condition: ' + condition);
        if (err.toString().includes('timeOut')) {
            if (condition === 0) {
                throw new Error('waitTextLengthGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + ' could not be located on the page.')
            }
            else if (condition === 1) {
                throw new Error('waitTextLengthGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + '\nExpected Text Length Greater Than: ' + expected + '\nFound Text: ' + foundText + '\nFound Text length: ' + foundTextLength);
            }
            else if (condition === 2) {
                throw new Error('waitTextLengthGreaterThan Timed out after ' + waitTime + ' ms.\nElement ' + element + '\nExpected Text Length Less Than: ' + expected + '\nFound Text: ' + foundText + '\nFound Text length: ' + foundTextLength);
            }
            else {
                throw new Error('waitTextLengthGreaterThan ' + err);
            }
        }
    }
}
