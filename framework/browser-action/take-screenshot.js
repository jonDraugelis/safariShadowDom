/**
 * Navigates to a url prepended with the base URL.
 * @param {string}  urlPage     URL page to be appended to the base URL
 * @param {int}     ms          Optional wait in milliseconds
 */
export function takeScreenshot(filepath) {
    // var path = __dirname;
    // let file;
    // let folder  = path.split('framework')[0] + 'allErrorShots';


    // let onMac = process.platform.includes('darwin');
    // let onWindows = process.platform.startsWith('win');
    // if (onMac) {
    //     file = '/screenshot.png';
    // }
    // else {
    //     file = '\\screenshot.png';
    // }
    // browser.saveScreenshot(folder + file);
    browser.takeScreenshot();
}