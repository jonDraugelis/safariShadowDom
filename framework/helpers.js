const path = require('path');
const waits = require('./browser-wait/wait');
const screenShot = require('./browser-action/take-screenshot');
const elGetter = require('./browser-getter/getElementObject');
// import { getElements } from "./browser-getter/getElementObject";

/**
 * Common functions that do not directly control the browser. 
 */
class Common {
    /**
     * return a unique email
     */
    static getUniqueEmail() {
        return browser.sessionID.substring(0, 6) + "@automation.test";
    };

    static getVariableType(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    /**
     * return a random integer between an inclusive min and an inclusive max
     * @param {int} min inclusive minimum integer
     * @param {int} max inclusive maximum integer
     */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    static print(text) {
        return console.log(text);
    };

    /**
    * Throw an error and take a screenshot.
    * @param {string}     errMessage      Error message
    */
    static throwError(errMessage) {
        screenShot.takeScreenshot();
        throw new Error(errMessage);
    };

    /**
    * If assertion is false, throw an error and take a screenshot.
    * @param {boolean}     assertTrue      Boolean
    * @param {string}     errMessage      Error message
    */
    static assert(assertTrue, errMessage) {
        if (!assertTrue) {
            screenShot.takeScreenshot();
            throw new Error(errMessage);
        }
    };

    /**
     * Print to the console the number of elements found. 
     * Catch any error and print. 
     * @param {string} element page locator
     * @param {int} pause pause before getting page locator
     */
    static elCount(element, pause) {

        if (pause) browser.pause(pause);

        try {
            console.log('------------- Count: ' + elGetter.getElements(element).length + ' - Element: ' + element);
        }
        catch (err) {
            console.log('------------- Count: Er - Element: ' + element);
            console.log(err.toString());
        }
    };

    static textToInt(text, allowArray) {
        const varType = this.getVariableType(text);
        if (varType === 'array') {
            if (allowArray) text.flat();
            else this.throwError('Text was an array. Text given: ' + text);
        }
        if (text) return text.replace(/\D/g, '');
        else this.throwError('No text was present.');
    }

    /**
     * Print to the console the number of elements found for each shadowDom layer
     * Catch any error and print. 
     * @param {string} element page locator
     * @param {int} pause pause before getting page locator
     */
    static elCounts(element, pause) {
        let elementArray = element.split(/(\s|\:\:)/);
        const roots = elementArray.length;
        let el = '';

        if (pause) browser.pause(pause);

        for (let i = 0; i < roots; i++) {
            if (i == 0) el = elementArray[i];
            else el += elementArray[i] + elementArray[++i];
            try {
                console.log('------------- Count: ' + elGetter.getElements(el).length + ' - Element: ' + el);
            }
            catch (err) {
                console.log('------------- Count: Er - Element: ' + el);
                console.log(err.toString());
            }
        }
    };

    /**
     * Verify an all strings within an array are contained within an array of strings
     * @param {array} arrayExpected 
     * @param {array} arrayFound 
     * @param {string} errorMessage 
     */
    static arrayStringsContainedInArrayStrings(arrayExpected, arrayFound, errorMessage) {
        let stringIndex;
        for (let i = 0; i < arrayExpected.length; i++) {
            stringIndex = arrayFound.findIndex(element => element.includes(arrayExpected[i]));
            if (stringIndex == -1) {
                screenShot.takeScreenshot();
                let errMessage = errorMessage ? errorMessage : '';
                throw new Error(errMessage + '\nExpected Text: ' + arrayExpected[i] + '\nFound Text: ' + arrayFound.join('\n'))
            }
        }
    };

    /**
     * Validates that the numeric value of given text meets the expectations value.
     * Throws an error if expectation is not met. 
     * @param {string}  text        text to compare
     * @param {string}  operator    >, >= or =
     * @param {int}     expValue    expected value
     */
    static verify_text_operator_value(text, operator, expValue) {
        let varType = this.getVariableType(text);
        expValue = Number(expValue);
        this.assert(varType === 'string', 'Text was not a string. Object type: ' + varType + '\nText: ' + text);
        this.assert(text && text.replace(/\D/g, ''), 'Text did not contain a numeric value. Value found:' + text);
        let textValue = Number(text.replace(/[^\d.-]/g, ''));
        let errMessage = 'Found text value was not ' + operator + ' expected value.\nExpected value: ' + expValue + '\nFound value: ' + text
        if (operator == '>') {
            this.assert(textValue > expValue, errMessage);
        }
        else if (operator == '>=') {
            this.assert(textValue >= expValue, errMessage);
        }
        else if (operator == '=') {
            this.assert(textValue === expValue, errMessage);
        }
        else if (operator == '<=') {
            this.assert(textValue <= expValue, errMessage);
        }
        else if (operator == '<') {
            this.assert(textValue < expValue, errMessage);
        }
        else throw new Error('Operator was unexpected. Operator given: ' + operator);
    };

    /**
     * Returns true/false if the numeric value of given text does/does not meet the expectations value. 
     * @param {string}  text        text to compare
     * @param {string}  operator    >, >= or =
     * @param {int}     expValue    expected value
     */
    static return_text_operator_value(text, operator, expValue) {
        let varType = this.getVariableType(text);
        expValue = Number(expValue);
        this.assert(varType === 'string', 'Text was not a string. Object type: ' + varType + '\nText: ' + text);
        if( !text || !text.replace(/\D/g, '') ) return false;
        let textValue = Number(text.replace(/[^\d.-]/g, ''));
        
        if (operator == '>') {
            return textValue > expValue;
        }
        else if (operator == '>=') {
            return textValue >= expValue;
        }
        else if (operator == '=') {
            return textValue === expValue;
        }
        else if (operator == '<=') {
            return textValue <= expValue;
        }
        else if (operator == '<') {
            return textValue < expValue;
        }
        else throw new Error('Operator was unexpected. Operator given: ' + operator);
    };

    /**
    * Used to validate that the numeric value of text contained in an element 
    * meets the expectations value. 
    * @param {string}   element     page locator
    * @param {string}   operator    expected value
    * @param {int}      value       >, =, <, >=
    * @param {int}      ms          wait time in ms
    */
    static verify_element_operator_value(element, operator, value, ms) {
        if (operator == '>') {
            waits.waitTextValueGreaterThan(element, value, ms);
        }
        else if (operator == '=') {
            waits.waitTextValueEquals(element, value, ms);
        }
        else if (operator == '<') {
            waits.waitTextValueGreaterThan(element, value, ms, true);
        }
        else if (operator == '>=') {
            waits.waitTextValueGreaterThan(element, value - 1, ms);
        }
        else if (operator == '<=') {
            waits.waitTextValueGreaterThan(element, value + 1, ms, true);
        }
        else throw new Error("operator was not defined");
    };
}


module.exports = { Common };