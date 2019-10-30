import * as waits from '../browser-wait/wait';
import { getElement } from './getElementObject';
/**
 * Returns text of a single element
 * Function will catch and retry if SocketException error is thrown. 
 * @param {string}     element      page locator
 */
export function getValue(element) {
    return getElement(element).getValue();
}
