/**
 * Wait for a browser tabs to equal expected count. 
 * @param {int}     tabCount    Optional tab count. Defaults to 2. Index begins at 1. 
 * @param {int}     ms          Optional wait in milliseconds. Defaults to 30000 ms.
 */
export function waitTabCountEqual(tabCountExp, ms) {
    if (ms && !Number.isInteger(ms)) throw new Error("Wait time was not an integer. Wait time given: " + ms);
    const waitTime = ms || 0;
    let tabCountFound;
    try {
        browser.waitUntil(function () {
            tabCountFound = browser.getWindowHandles().length
            return tabCountFound === tabCountExp;
        }, waitTime, 'timeOut');
    }
    catch (err) {
        if (err.toString().includes('timeOut')) {
            throw new Error('waitTabCountEqual Timed out after ' + waitTime + ' milliseconds waiting for tab count ' + tabCountFound + ' to meet expected tab count ' + tabCountExp);
        }
        else throw new Error('waitTabCountEqual ' + err);
    }
}