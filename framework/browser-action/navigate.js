import { waitUrlEndsWith } from '../browser-wait/wait.js';

/**
 * Navigates to a url prepended with the base URL.
 * @param {string}  urlPage     URL page to be appended to the base URL
 * @param {int}     ms          Optional wait in milliseconds
 */
export function navigate(urlPage, ms) {
    browser.url(urlPage);
    if (ms) waitUrlEndsWith(urlPage, ms);
}