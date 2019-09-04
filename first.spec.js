"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
describe('Protractor, Jasmine and Typescript Demo', function () {
    it('Verify page title', function () {
        protractor_1.browser.get('https://angularjs.org/');
        protractor_1.browser.getTitle().then(function (title) {
            console.log("The page title is: " + title);
            protractor_1.browser.sleep(5000);
        });
    });
});
