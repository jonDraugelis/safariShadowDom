
import { waitTabCountEqual, pause } from '../browser-wait/wait';
import * as brows from '../browser-action/browser';
import { takeScreenshot } from '../browser-action/take-screenshot';

Error.prepareStackTrace = require('../short-stack-trace');

const { Given, When, Then } = require('cucumber');
const And = Then;

Given("I wait {int} second(s)", (seconds) => { pause(seconds * 1000); });

Given("I wait {int} milli-seconds", (milli) => { pause(milli); });

Then("there are/is {int} tab(s)", (tabs) => { waitTabCountEqual(tabs, 3000) });

When("I switch to tab {int}", (tab) => { brows.tabFocus(tab) });

When("I close the current tab", () => { brows.tabClose() });

When("I refresh the page", () => { brows.refresh(); });

Given("comment - {string} -", (comment) => { /*Do nothing with the 'comment' string*/ });

When("I take a screenshot", () => { takeScreenshot(); });




