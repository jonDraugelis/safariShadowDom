
import {
    waitExist,
    waitTextAny,
    waitTextContains,
    waitOccurrenceAtLeast,
    pause
} from '../browser-wait/wait.js';
import { getElement, getElements } from '../browser-getter/getElementObject.js';
import { getText, getTextFromObject } from '../browser-getter/getText.js';

/**
 * Wrapping of browser.click that automatically retries errors that can 
 * occur intermittently when interacting with an element immidiately after it loads. 
 * Pausing then retrying often solves these errors. The errors caught are listed below. 
 * Error: 'stale element reference'
 * Error: 'not clickable at point'
 * Error: 'not interactable'
 * @param {*} element Page element
 * @param {*} maxIterations number of retries for caught errors
 */
function clicker(elLocator, lastElement, maxIterations) {
    let loops = 0;
    let maxLoops = maxIterations || 5;
    let pauseTime = 300;
    while (loops < maxLoops) {
        loops++;
        try {
            let elmt;
            if (lastElement) {
                let tempEl = getElements(elLocator, true);
                elmt = tempEl[tempEl.length - 1];
            }
            else {
                elmt = getElement(elLocator, true);
            }
            
            // If element exists click it. If not throw an error. 
            // WDIO default behavior is to timeout when an element that does not exists is clicked.
            if (elmt.isExisting()) {
                elmt.click();
                return;
            }
            else {
                throw new Error('Click failed: Element "' + elLocator + '" does not exist.');
            }
        }
        catch (err) {
            let errCaught;
            let errThrown;
            let type;
            if (err.toString().includes('stale element')) {
                type = 'Stale Element';
            }
            else if (err.toString().includes('not clickable at point')) {
                type = 'Not Clickable';
            }
            else if (err.toString().includes('not interactable')) {
                type = 'Not Interactable';
            }
            else {
                throw new Error(err)
            }
            if (loops < maxLoops) {
                errCaught = '-*-*-**** Error Caught ' + type + ': clicker **** ' + loops + ' ' + elLocator + '\n' + err;
                console.error(errCaught);
                pause(pauseTime);
                pauseTime += 200;
            }
            else {
                errThrown = '-*-*-**** Error Thrown ' + type + ': clicker **** ' + loops + ' ' + elLocator + '\n' + err;
                throw new Error(errThrown);
            }
        }
    }
}


/**
 * Click element. 
 * An optional wait is the second parameter 
 * @param {string}  element     Page element
 * @param {int}     ms          Optional wait in milliseconds
 */
export function click(element, ms) {
    if (ms) waitOccurrenceAtLeast(element, 1, ms);
    clicker(element);
}

/**
 * Click last element. 
 * An optional wait is the second parameter 
 * @param {string}  element     Page element
 * @param {int}     ms          Optional wait in milliseconds
 */
export function clickLastElement(element, ms) {
    if (ms) waitOccurrenceAtLeast(element, 1, ms);
    clicker(element, true);
}

/**
 * Click element object. 
 * An optional wait is the second parameter 
 * @param {string}  elObject     Page object
 * @param {int}     ms          Optional wait in milliseconds
 */
export function clickObject(elObject) {
    elObject.click();
}

/**
 * Click element containig any text. 
 * An optional wait is the second parameter 
 * @param {string}  element     Page element
 * @param {int}     ms          Optional wait in milliseconds
 */
export function clickTextAny(elLocator, ms) {
    if (ms) waitTextAny(elLocator, ms);
    let elObjects = getElements(elLocator, true);
    for (let i in elObjects) {
        if (getTextFromObject(elObjects[i]).length > 0) {
            return elObjects[i].click();
        }
    }
    throw new Error("Error: clickTextAny\nElement not present\n" + element);
}

/**
 * Click element containing given text. 
 * An optional wait is the third parameter.  
 * @param {string}  element     Page element.
 * @param {string}  text        Case iNsENsiTiVe text.
 * @param {int}     ms          Optional wait in milliseconds.
 */
export function clickTextContains(element, text, ms) {
    if (!text) throw new Error('Expected text must be defined');
    if (ms) waitTextContains(element, text, ms);
    let elements = getElements(element, true);
    let foundText = '';
    let savedText = '';
    for (let i in elements) {
        foundText = getTextFromObject(elements[i]);
        if (foundText && foundText.toLowerCase().includes(text.toLowerCase())) {
            return elements[i].click();
        }
        else savedText += (foundText + ', ');
    }
    throw new Error("Error: clickTextContains: Element containing expected text was not found.\nElement: " + element + "\nExpected text: " + text + "\nElement count found: " + elements.length + "\nElements text found: " + savedText);
}

/**
 * Click element containing given text. 
 * An optional wait is the third parameter.  
 * @param {string}  element     Page element.
 * @param {string}  text        Case iNsENsiTiVe text.
 * @param {int}     ms          Optional wait in milliseconds.
 */
export function clickTextEquals(element, text, ms) {
    if (!text) throw new Error('Expected text must be defined');
    if (ms) waitTextContains(element, text, ms);
    let elements = getElements(element, true);
    let foundText = '';
    let savedText = '';
    for (let i in elements) {
        foundText = getTextFromObject(elements[i]);
        if (foundText === text) {
            return elements[i].click();
        }
        else savedText += (foundText + ', ');
    }
    throw new Error("Error: clickTextEquals: Element with text equaling expected value was not found.\nElement: " + element + "\nExpected text: " + text + "\nElement count found: " + elements.length + "\nElements text found: " + savedText);
}

/**
 * Click element then wait for an element to be present. 
 * If the element to wait for is not present then retry. 
 * This step is used for elements that fail to register the click method occasionally. 
 * @param {string} elmtToClick 
 * @param {int} waitEl1 
 * @param {string} elmtToWaitFor 
 * @param {int} waitEl2 
 * @param {int} retryAttempts 
 */
export function clickWaitRetry(elmtToClick, waitEl1, elmtToWaitFor, waitEl2, retryAttempts) {
    let loops = 0;
    let maxLoops = retryAttempts;
    let errCaught = '-*-*-**** Error Caught: clickWaitRetry **** ';
    let errThrown = '-*-*-**** Error Thrown: clickWaitRetry **** ';
    while (loops < maxLoops) {
        loops++;
        try {
            click(elmtToClick, waitEl1);
            waitExist(elmtToWaitFor, waitEl2);
            return;
        }
        catch (err) {
            if (loops < maxLoops) {
                console.error(errCaught + loops + '\n' + err);
            }
            else {
                throw new Error(errThrown + loops + '\n' + err);
            }
        }
    }
}