import { getElement } from "./getElementObject";

/**
 * Returns the the number of occurrences of the element.
 * @param {string}     element        Page locator
 * @param {string}     attribute      Attribute of element
 */
export function getAttribute(locater, attribute) {
    return getElement(locater).getAttribute(attribute);
}

/**
 * Returns the the number of occurrences of the element.
 * @param {object}     elObject       Page Object
 * @param {string}     attribute      Attribute of element
 */
export function getAttributeFromObject(elObject, attribute) {
    return elObject.getAttribute(attribute);
}