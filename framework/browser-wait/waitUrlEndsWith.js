import { getUrl } from '../browser-getter/getUrl';
/**
 * Wait for the page url to (not )end with the given url. 
 * @param {int}     url         End of the expected URL.  
 * @param {int}     ms          Optional wait in milliseconds. Default to 30000 ms
 * @param {boolean} notPresent  True state waits for URL to not end with given input. 
 */
export function waitUrlEndsWith(url, ms, notPresent) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let fullUrl;
    notPresent = !!notPresent;
    try {
        browser.waitUntil(function () {
            fullUrl = getUrl();
            return fullUrl.endsWith(url) != notPresent;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            let notPresentString = notPresent ? 'not ' : '';
            throw new Error('waitUrlEndsWith Timed out at ' + waitTime + ' milliseconds.\nExpected actual url to ' + notPresentString + 'end with expected URL.\nFound URL: ' + fullUrl + '\nExpected URL: ' + url);
        }
        else throw new Error('waitUrlEndsWith ' + err);
    }
}
