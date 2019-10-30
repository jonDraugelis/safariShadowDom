const commands = require('./utilities/getCommands');
var reporter = require('cucumber-html-reporter');
console.log(commands.appVersion);
console.log(commands.browserUsed);
console.log(commands.host);
 
var options = {
        theme: 'bootstrap',
        jsonFile: './all-reports/reports-cucumber-json/*.json',
        output: './all-reports/reports-cucumber/cucumber_report.html',
        reportSuiteAsScenarios: true,
        launchReport: true,
        metadata: {
            "App Version": commands.appVersion,
            "Test Environment": "STAGING",
            "Browser": commands.browserUsed,
            "Platform": "Windows 10",
            "Parallel": "Scenarios",
            "Executed": commands.host
        }
    };
 
    reporter.generate(options);