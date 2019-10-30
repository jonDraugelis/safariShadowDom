const shadow = require('../../setShadowDom');
let errorMessage = '';
const common = require('../helpers').Common;


/**
 * Set in the cofig file and determins if shadow dom locators will be used. 
 */
function isShadowRoot() {
    return shadow.isShadowDom();
}

/**
 * This function prevents the standed WDIO functionality of timing out when an element within 
 * a shadow dom cannot be found. We would rather return an empty object or throw an error
 * that tells us which layer of the locator could not be located. 
 * 
 * This function will determine if an element be found in the parent shadow dom. 
 * IF the element is not found this will either throw an error or return an empty object. 
 
 * @param {object} elementObject current element object
 * @param {string} currentElement current element string
 * @param {string} fullElement full element string
 * @param {boolean} throwShadowError If true throw an error if element is not found. 
 */
function elementObjectExists(elementObject, currentElement, fullElement, throwShadowError) {
    // If the elementObject is undefined or if the object does not exist return false/throw error.
    if (!elementObject || !elementObject.isExisting()) {
        setElementShadowError(currentElement, fullElement);
        if (throwShadowError) throw new Error(getElementShadowError());
        else return false;
    }
    else return true;
}

/**
 * This function prevents the standed WDIO functionality of timing out when an element within 
 * a shadow dom cannot be found. We would rather return an empty object or throw an error
 * that tells us which layer of the locator could not be located. 
 * 
 * This function will determine if an element be found in the parent shadow dom. 
 * IF the element is not found this will either throw an error or return an empty object. 
 
 * @param {object} elementObject current element object
 * @param {string} currentElement current element string
 * @param {string} fullElement full element string
 * @param {boolean} throwShadowError If true throw an error if element is not found. 
 */
function elementArrayExists(elementObject, currentElement, fullElement, throwShadowError) {
    if (elementObject.length === 0) {
        setElementShadowError(currentElement, fullElement);
        if (throwShadowError) throw new Error(getElementShadowError());
        else return false;
    }
    else return true;
}

function setElementShadowError(currentElement, fullElement) {
    errorMessage = 'getElement: Element "' + currentElement + '" was not found\nFull element: ' + fullElement;
}

export function getElementShadowError() {
    return errorMessage;
}

/**
 * This method was created to match our pre-existing element locator strategy.
 * It will create an array with the locator and all its children and identify if it is within a shadow root. 
 * We want to be able to write locators in the following format.
 * 
 * i.g.
 * the locators should be able an element within any number of shadow roots. 
 * let locator = 'shadow-root-one shadow-root-level-two shadow-root-level-three paper-button'
 * WDIO will search the locator like this: $(shadow-root-one).shadow$(shadow-root-level-two).shadow$(shadow-root-level-three).shadow$(paper-button)
 * 
 * Also: The locator should be able to search for parent and children elements within the same shadow root.
 * In the follwoign example the login contained within the shadow root of shadow-root-level-two
 * but input-button is a child of #login. It is not contained within #login shadow root. 
 * let locator = 'shadow-root-one shadow-root-level-two #login::.input-button'
 * WDIO will search the locator like this: $(shadow-root-one).shadow$(shadow-root-level-two).shadow$(#login .input-button);
 * 
 * This method makes both of those locators work as described. 
 * It will create an array with the locator and all its children allong with whether or not it is within a shadow root or not. 
 *
 * @param {string} element element locator
 */
function elementLocatorArray(element) {
    if (!element) throw new Error('Valid element locator must be provided. Input: ' + element);
    let varType = common.getVariableType(element);
    if (varType !== 'string') throw new Error('Variable type must be a string. Variable type given: ' + varType);

    let newTry = element.split(' ');
    let finalNew = [];
    for (let i = 0; i < newTry.length; i++) {
        finalNew.push(newTry[i].replace(/::/g, ' ').replace(/-@-/g, ' '));
    }
    return finalNew;
}

/**
 * Returns a single element.
 * if isShadowRoot is set to true from the config file then function will use shadow root locator: shadow$()
 * if isShadowRoot is set to true from the config file then function will use base locator: $()
 * 
 * Shadow root syntax. 
 * Locators can be preceeded by ' ' or a '::'
 * If locator is preceded by a ' ' then the shadow root locator will be used to locate that element. 
 * If locator is preceded by a '::' then the shadow root locator will NOT be used to locate that element.
 * 
 * String '-@-' will be replaced with a ' ' for all locators. This allows for locators that conatin spaces. 
 * @param {string}     element      page locator
 */
export function getElement(element, throwShadowError) {
    let elObject;
    let debug = false;
    if (isShadowRoot()) {
        let elementArray = elementLocatorArray(element);
        const roots = elementArray.length;
        for (let i = 0; i < roots; i++) {
            if (i === 0) {
                elObject = $(elementArray[0]);
                if (!elementObjectExists(elObject, elementArray[i], element, throwShadowError)) break;
            }
            else {
                elObject = elObject.shadow$(elementArray[i]);
                if (!elementObjectExists(elObject, elementArray[i], element, throwShadowError)) break;
            }
        }
    }
    else {
        elObject = $(element);
    }
    return elObject;
}

/**
 * Returns an array of elements objects. 
 * @param {string}     element               Page locator
 * @param {boolean}    throwShadowError      Throw error boolean
 */
export function getElements(element, throwShadowError) {
    let elObject;
    let debug = false;
    if (isShadowRoot()) {
        let elementArray = elementLocatorArray(element);
        let roots = elementArray.length;

        for (let i = 0; i < roots; i++) {
            // If on the last locater return multiple element objects. 
            if (i === 0) {
                // First element is never in the shadow root. 
                if (roots === 1) {
                    elObject = $$(elementArray[0]);
                }
                // If multiple locators are present return a single element object
                // Only single element objects can be searched within. 
                else {
                    elObject = $(elementArray[i]);
                    if (!elementObjectExists(elObject, elementArray[0], element, throwShadowError)) break;
                }
            }
            else {
                // If on the last locator return multiple element objects
                if (i === (roots - 1)) {
                    elObject = elObject.shadow$$(elementArray[i]);
                    if (!elementArrayExists(elObject, elementArray[i], element, throwShadowError)) break;
                }
                // If not on the last locator return a single element object
                else {
                    elObject = elObject.shadow$(elementArray[i]);
                    if (!elementObjectExists(elObject, elementArray[i], element, throwShadowError)) break;
                }
            }
        }
    }
    else {
        elObject = $$(element);
    }
    return elObject;
}

/**
 * Searches within the given element object and returns an array of element objects.
 * @param {object}     objectGiven          Page object
 * @param {string}     element              Page locator
 * @param {boolean}    throwShadowError     Throw error boolean
 */
export function getElementInnerFromObject(objectGiven, element, throwShadowError) {
    let elObject;
    if (isShadowRoot()) {
        let elementArray = elementLocatorArray(element);
        let roots = elementArray.length;
        // If on the last locater return multiple elements.
        for (let i = 0; i < roots; i++) {
            // First object is retrieved from the given object not the browser. 
            if (i === 0) {
                elObject = objectGiven.shadow$(elementArray[i]);
                if (!elementObjectExists(elObject, elementArray[0], element, throwShadowError)) break;
            }
            else {
                elObject = elObject.shadow$(elementArray[i]);
                if (!elementObjectExists(elObject, elementArray[i], element, throwShadowError)) break;
            }
        }
    }
    else {
        elObject = objectGiven.$(element);
    }
    return elObject;
}

/**
 * Searches within the given element object and returns a single element object.
 * @param {object}     objectGiven          Page object
 * @param {string}     element              Page locator
 * @param {boolean}    throwShadowError     Throw error boolean
 */
export function getElementsInnerFromObject(objectGiven, element, throwShadowError) {
    let elObject;
    if (isShadowRoot()) {
        let elementArray = elementLocatorArray(element);
        let roots = elementArray.length;
        // If on the last locater return multiple elements.
        for (let i = 0; i < roots; i++) {
            // First object is retrieved from the given object not the browser. 
            if (i === 0) {
                // If the first locater is also the last locater return multiple elements. 
                if (roots === 1) {
                    elObject = objectGiven.shadow$$(elementArray[0]);
                }
                // If there are multiple locaters return a single element.
                // Only single objects can be searched within. 
                else {
                    elObject = objectGiven.shadow$(elementArray[i]);
                    if (!elementObjectExists(elObject, elementArray[0], element, throwShadowError)) break;
                }
            }
            else {
                // If on the last locator return multiple elements
                if (i === (roots - 1)) {
                    elObject = elObject.shadow$$(elementArray[i]);
                    if (!elementArrayExists(elObject, elementArray[i], element, throwShadowError)) break;
                }
                // If not on the last locator return a single element
                else {
                    elObject = elObject.shadow$(elementArray[i]);
                    if (!elementObjectExists(elObject, elementArray[i], element, throwShadowError)) break;
                }
            }
        }
    }
    else {
        elObject = objectGiven.$$(element);
    }
    return elObject;
}
