import { waitExist } from "./waitExist";

//TODO: make sure time waits as expected

/**
 * Wait a shadow element. 
 * A limitation of webComponents is that if a layer of the shadow component is not present and lower layer is defined. 
 * Then we will get a "Cannot read property 'length' of null" error. 
 * To avoid this we will search for each layer of the shadow root one by one. 
 * @param {string}      element         Shadow element locator.
 * @param {int}         ms              Optional wait in Milliseconds. Defaults to 30000
 */
export function waitShadow(element, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    let waitTime = ms || 0;
    let elementArray = element.split(/(\s|\:\:)/);
    const roots = elementArray.length;
    let el = '';
    var start = new Date().getTime();
    for (let i = 0; i < roots; i++) {
        //first element in the array only has the shadow root
        if (i == 0) el = elementArray[i];
        //All successive elements in the array must have the shadow root and a space ' ' or double colon "::"
        //these characters must be added back to the base string. 
        else el += elementArray[i] + elementArray[++i];
        browser.waitForExist(el, waitTime);
        var end = new Date().getTime();
        waitTime = waitTime - (end - start);
    }
}