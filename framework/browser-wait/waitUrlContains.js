import { getUrl } from '../browser-getter/getUrl';
/**
 * Wait for the page url present in the given url. 
 * @param {int}     url         expected URL.  
 * @param {int}     ms          Optional wait in milliseconds. Default to 30000 ms
 * @param {boolean} notPresent  True state waits for URL to not contain given input. 
 */
export function waitUrlContains(url, ms, notPresent) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let fullUrl;
    notPresent = !!notPresent;
    try {
        browser.waitUntil(function () {
            fullUrl = getUrl();
            return fullUrl.includes(url) != notPresent;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notPresentString = notPresent ? 'not ' : '';
            throw new Error('waitUrlContains Timed out at ' + waitTime + ' milliseconds.\nExpected actual url to ' + notPresentString + 'contain expected URL.\nFound URL: ' + fullUrl + '\nExpected URL: ' + url);
        }
        throw new Error('waitUrlContains ' + err);
    }
}
