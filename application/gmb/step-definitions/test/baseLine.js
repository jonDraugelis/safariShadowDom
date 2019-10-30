
import * as brows from '../../../../framework/browser-action/browser';
import * as navs from '../../../../framework/browser-action/navigate';
const { Given, When, Then } = require('cucumber');
const And = Then;

// to run in safari
// ./node_modules/.bin/wdio wdio.gmb.conf.js --tags=@testShadow --browser=safari
// to run in chrome
// ./node_modules/.bin/wdio wdio.gmb.conf.js --tags=@testShadow

When("I navigate to the test page", () => { return _go_to_impersonation_page_GCC() });
function _go_to_impersonation_page_GCC() {
    brows.restartBrowserBetweenScenario();
    brows.windowSetSize();
    navs.navigate('https://acc-test.amwayglobal.com/acc-impersonation/develop/components/acc-impersonation/acc_index.html');
}

Then("I get an element count within the shadow dom", () => {
    let shadowEl = $('acc-corecomponent-impersonation').shadow$$('div');
    console.log('element Count: ' + shadowEl.length);
});

Then("I click an element within the shadow dom", () => {
    let shadowEl = $('acc-corecomponent-impersonation').shadow$('acc-impersonation-abo-autocomplete').shadow$('paper-autocomplete').shadow$('paper-input').shadow$('iron-input').$('input');
    shadowEl.click();
});

Then("I enter text in an element within the shadow dom", () => {
    let shadowEl = $('acc-corecomponent-impersonation').shadow$('acc-impersonation-abo-autocomplete').shadow$('paper-autocomplete').shadow$('paper-input').shadow$('iron-input').$('input');
    shadowEl.setValue('Test 12');
});
