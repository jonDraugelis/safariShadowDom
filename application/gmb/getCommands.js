let command = require('../../framework/commandParser').command;
const fs = require('fs');
const glob = require('glob');
const TagExpressionParser = require('cucumber-tag-expressions').TagExpressionParser;
const tagParser = new TagExpressionParser();
const path = require('path')
// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, 'tempDownload');

// Set base test values from the command line. Default values are provided for some fields
// Sites refer to impersonation sites
let site = command.site || 'gcc';
// Global timeout for step definitions
let timeOut = command.timeOut || 80000;
timeOut = parseInt(timeOut);
// env for a impersontaion site: dev, test and prod
let env = command.env || 'test';
// BaseURL defined from the command line. This will override the default URLs
let baseCommand = command.base;
// baseUrls for the different impersonation sites
let baseUrlGcc;
let baseUrlMyBiz;
let baseUrlPortal;
// Cucumber tags
let allTags = command.tags;
// Browser to be used
let browserUsed = command.browser || 'chrome';
// SacueKey for logging into sauceLabs. If it is defined it will override default key
let sauceKey = command.sauceKey;
// SauceName for logging into sauceLabs. If it is defined it will override default name
let sauceName = command.sauceName;
// Maximum number of cuncurrent browsers. Each feature file will launch its own browser
let maxBrowsers = command.maxBrowsers || 1;
// If retry is true certain tests will refresh the page in order to deal with intermittent app errors
let retry = parseInt(command.retry);
// If onSauce is true a default userName and userKey will be used
let onSauce = command.sauce;
// Capabilities of the config file. such as max browsers, browser type, ect
let capabilities;
// Define if you will need to access shadow dom elements
let shadowProject = true;
// Hot fix env must have a second URL that is pasted into the splash page.
// This URL must be inputed on the command line. 
let hotfixUrl = command.hotfixUrl;
// Get max browsers and set value to an integer
maxBrowsers = command.max || maxBrowsers;
maxBrowsers = parseInt(maxBrowsers);

//ie name conversion. Command line doesn't like spaces
if (browserUsed === 'ie11') browserUsed = 'internet explorer';

//Selenium host defaults to local host
// if (!host) host = 'localhost';

// If the baseUrl is defined in the command line use it. 
// Otherwise use the default baseUrl for each environment. 
if (baseCommand) {
    baseUrlGcc = baseCommand;
    baseUrlMyBiz = baseCommand;
    baseUrlPortal = baseCommand;
}
else {
    if (env === 'test') {
        baseUrlGcc = 'https://acc-test.amwayglobal.com/';
        baseUrlMyBiz = 'https://mybiz-test.amwayglobal.com/';
        baseUrlPortal = 'https://coreplus-test.amwayglobal.com/';
    }
    else if (env === 'qa') {
        baseUrlGcc = 'https://acc-qa.amwayglobal.com/';
        baseUrlMyBiz = 'https://mybiz-qa.amwayglobal.com/';
        baseUrlPortal = 'https://coreplus-qa.amwayglobal.com/';
    }
    else if (env === 'stage') {
        baseUrlPortal = 'https://coreplus-stage.amwayglobal.com/';
    }
    else if (env === 'hotfix') {
        baseUrlGcc = 'https://acc-patch.amwayglobal.com/';
        if(!hotfixUrl) throw new Error('"hotfixUrl" must be defined on the command line for the hotfix env');
    }
    else if (env === 'prod') {
        baseUrlGcc = 'https://acc.amwayglobal.com/';
        baseUrlMyBiz = 'https://mybiz.amwayglobal.com/';
        baseUrlPortal = 'https://coreplus.amwayglobal.com/';
    }
    else throw new Error('Environment was not expected. Env given: ' + env);
}

//Get all feature files that include inputed tags. 
const expressionNode = tagParser.parse(allTags);
const filesWithTags = glob.sync('./application/gmb/features/**/*.feature').map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.length > 0) {
        const tagsInFile = content.match(/(@\w+)/g) || [];
        if (expressionNode.evaluate(tagsInFile)) return file;
    }
    return null;
}).filter(x => x != null);

// If on sauce set the capabilities
if (onSauce) {
    capabilities = [{
        maxInstances: maxBrowsers,
        browserName: browserUsed,
        platform: 'Windows 10',
        screenResolution: '1600x1200'
    }]
}
// Local capabilities
else {
    capabilities = [{
        maxInstances: maxBrowsers,
        browserName: browserUsed,
        'goog:chromeOptions': {
            prefs: {
                'download.default_directory': downloadDir
            }
        }
    }]
}

module.exports = {
    capabilities: capabilities,
    featuresWithTags: filesWithTags,
    shadowProject: shadowProject,
    maxBrowsers: maxBrowsers,
    hotfixUrl: hotfixUrl,

    sauceName: sauceName,
    sauceKey: sauceKey,
    onSauce: onSauce,

    baseUrlPortal: baseUrlPortal,
    baseUrlMyBiz: baseUrlMyBiz,
    baseUrlGcc: baseUrlGcc,

    timeOut: timeOut,
    allTags: allTags,
    retry: retry,
    site: site,
    env: env
}