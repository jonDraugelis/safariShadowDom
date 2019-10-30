let onMac = process.platform.includes('darwin');
let onWindows = process.platform.startsWith('win');
let onLinux = process.platform.startsWith('linux');
let chromeFile;
let version = '76.0.3809.126';
// let version = '76.0.3809.68';
// let version = '75.0.3770.140';
// let version = '74.0.3729.6';
let filePath = './wdio_drivers/chrome_' + version + '/'

if (onMac) {
    chromeFile = 'chromedriver'
}
else if (onWindows || onLinux) {
    chromeFile = 'chromedriver.exe'
}
else {
    throw new Error('Chromedriver path could not be defined because the platform was not expected. Platform: ' + process.platform);
}

module.exports = {
    chromePath : filePath + chromeFile,
}
