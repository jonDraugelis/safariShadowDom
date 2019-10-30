import * as waits from '../browser-wait/wait';
const common = require('../helpers').Common;
import { getElement, getElements } from './getElementObject';

/**
 * Returns text from a locator string. 
 * If a single element is found returns test as a string. 
 * If multiple elements are found returns text as an array.
 * Function will catch and retry if SocketException error is thrown. 
 * @param {string}     element      page locator
 */
export function getText(elLocator) {
    let els = getElements(elLocator);
    let elCount = els.length;
    //If there is one element return a string not an array. 
    if (elCount === 1) {
        return els[0].getText();
    }
    //If there are multiple elements return an array of strings. 
    else {
        let textArray = [];
        for (let i = 0; i < elCount; i++) {
            textArray.push(els[i].getText());
        }
        return textArray;
    }

    // let text;
    // let loops = 0;
    // let maxLoops = 10;
    // let errThrown = '-*-*-**** Error Thrown: getText **** ';
    // while (loops < maxLoops) {
    //     loops++;
    //     try {
    //         // text = $(elLocator).getText();
    //         text = getElements(elLocator).getText();
    //         return text;
    //     }
    //     catch (err) {
    //         if (err.toString().includes('java.net.SocketException:')) {
    //             if (loops !== maxLoops) {
    //                 console.error('-*-*-**** Error Caught SocketException: getText **** ' + loops + '\n' + err);
    //             }
    //             else {
    //                 throw new Error(errThrown + loops + '\n' + err);
    //             }
    //         }
    //         else if (err.toString().includes('java.io.IOException:')) {
    //             if (loops !== maxLoops) {
    //                 console.error('-*-*-**** Error Caught java.io.IOException: getText **** ' + loops + '\n' + err);
    //             }
    //             else {
    //                 throw new Error(errThrown + loops + '\n' + err);
    //             }
    //         }
    //         else if (err.toString().includes('stale element')) {
    //             if (loops !== maxLoops) {
    //                 console.error('-*-*-**** Error Caught Stale Element: getText **** ' + loops + '\n' + err);
    //                 waits.pause(50);
    //             }
    //             else {
    //                 throw new Error(errThrown + loops + '\n' + err);
    //             }
    //         }
    //         else {
    //             throw new Error(err);
    //         }
    //     }

    // }

}

/**
 * Returns text from a locator string. 
 * Always returns text as an array.
 * @param {string}     element      page locator
 */
export function getTextArray(elLocator) {
    let els = getElements(elLocator);
    let textArray = [];
    for (let i = 0; i < els.length; i++) {
        textArray.push(els[i].getText());
    }
    return textArray;
}

/**
 * Returns text from a locator object. 
 * If a single element is found returns test as a string. 
 * If multiple elements are found returns text as an array.
 * @param {string}     element      page locator
 */
export function getTextFromObject(elObject) {
    return elObject.getText();
}

/**
 * Returns text as an array from an array of objects
 * If multiple elements are found returns text as an array.
 * @param {string}     elObject                 an array of page objects
 * @param {boolean}     returnOccupiedStrings    if true only strings with length > 0 are returned.
 */
export function getTextArrayFromObjectArray(elObject, returnOccupiedStrings) {
    let textArray = [];
    for (let i = 0; i < elObject.length; i++) {
        let objectText = elObject[i].getText();
        if (returnOccupiedStrings) {
            if (objectText && objectText.length > 0) {
                textArray.push(objectText);
            }
        }
        else textArray.push(objectText);
    }
    return textArray;
}
