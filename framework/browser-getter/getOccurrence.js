import { getElements } from "./getElementObject";

/**
 * Returns the the number of occurrences of the element.
 * @param {string}     element      page locator
 */
export function getOccurrence(element) {
    let occurrence = getElements(element).length;
    if (!occurrence) occurrence = 0;
    return occurrence;
}

export function getOccurrenceFromObjectArray(elementObjects) {
    let occurrence = elementObjects.length;
    if (!occurrence) occurrence = 0;
    return occurrence;
}