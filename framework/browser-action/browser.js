
import { waitTabCountAtLeast, pause, hang, waitTabCountEqual, waitExist, waitUrlContains } from '../browser-wait/wait.js';

let scenariosRan = 0;

export function windowSetSize(horizontal, vertical) {
    let onMac = process.platform.includes('darwin');
    let onWindows = process.platform.startsWith('win');
    if (onMac) {
        if (!horizontal) horizontal = 1500;
        if (!vertical) vertical = 1000;
        // browser.setWindowSize({ width: horizontal, height: vertical });
        browser.setWindowSize(horizontal, vertical);
    }
    else {
        browser.maximizeWindow();
    }
};

export function getScenariosRan() {
    return scenariosRan;
};

export function incrementScenariosRan() {
    ++scenariosRan;
};

/**
 * Used to restart the browser between each scenario for full e2e tests.
 * This should be used within the first step of each sceanario.
 */
export function restartBrowserBetweenScenario() {
    incrementScenariosRan();
    deleteExtraTabs();
    if (getScenariosRan() > 1) {
        browser.clearLocalStorage();
    }
};

/**
 * Switch browser tab focus with an optional wait as the second parameter.
 * If no inputs are given default behavior is to immediately switch to the second tab.
 * @param {int}     tab     Tab occurrence. Defaults to 2. Index begins at 1. 
 * @param {int}     ms      Optional wait in milliseconds. If input not given function does not wait. 
 */
export function tabFocus(tab, ms) {
    const tabCount = tab || 2;
    let debug = false;
    const tabs = browser.getWindowHandles();
    if (debug) console.log('Initial tab: ' + browser.getWindowHandle());
    if (ms) waitTabCountAtLeast(tabCount, ms);
    else {
        if (tabs.length < tab) {
            throw new Error('Tab count found was less than expected.\nTab Count expected: ' + tab + ' Tabs found: ' + tabs);
        }
    }
    browser.switchToWindow(tabs[tabCount - 1]);
    if (debug) console.log('Current tab: ' + browser.getWindowHandle());
}

/**
 * Switch browser tab focus wait for url matches to the given input and delete the second tab 
 */
export function SwitchTabAndDeleteTab(tab, link) {
    const tabCount = tab || 2;
    let debug = false;
    const tabs = browser.getWindowHandles();
    if (debug) console.log('Initial tab: ' + browser.getWindowHandle());
    else {
        if (tabs.length < tab) {
            throw new Error('Tab count found was less than expected.\nTab Count expected: ' + tab + ' Tabs found: ' + tabs);
        }
    }
    browser.switchToWindow(tabs[tabCount - 1]);
    if (debug) console.log('Current tab: ' + browser.getWindowHandle());
    var url = browser.getUrl();
    waitUrlContains(link, 30000);
    browser.closeWindow();
    browser.switchToWindow(tabs[0]);
}

export function deleteExtraTabs() {
    let tabs = browser.getWindowHandles();
    let tabCount = tabs.length;
    for (let t = tabCount; t > 1; t--) {
        browser.switchToWindow(tabs[t - 1]);
        browser.closeWindow();
    }
    browser.switchToWindow(tabs[0]);
}

/**
 * Close the current tab
 */
export function tabClose() {
    browser.closeWindow();
}

/**
 * refresh the current page
 */
export function refresh() {
    browser.refresh();
}
