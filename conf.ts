import { browser } from "protractor";
var jasmineReporters = require('jasmine-reporters');
       
var fs = require('fs-extra');
var htmlReporter = require('./node_modules/protractor-html-reporter-2/lib/protractor-xml2html-reporter');
	// Require protractor-beautiful-reporter to generate reports.


exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: ['--disable-gpu']
        }
    },

    // If you have one app to test then you can mention the base url here.
    baseUrl: 'https://juliemr.github.io/protractor-demo',

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine2',

    specs: ['./specs/login/login.spec.js'],

    onPrepare: function () {
        // Default window size
        browser.driver.manage().window().maximize();
        // Default implicit wait
        browser.manage().timeouts().implicitlyWait(60000);
        // Angular sync for non angular apps
        browser.ignoreSynchronization = true;
       
        fs.emptyDir('./reports/xml/', function (err:String) {
            console.log(err);
        });

        fs.emptyDir('./reports/screenshots/', function (err:String) {
            console.log(err);
        });

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './reports/xml/',
            filePrefix: 'xmlresults'
        }));

        jasmine.getEnv().addReporter({
            specDone: function (result) {
                //if (result.status == 'failed') {
					browser.getCapabilities().then(function (caps) {
						var browserName = caps.get('browserName');

						browser.takeScreenshot().then(function (png) {
							var stream = fs.createWriteStream('./reports/screenshots/' + browserName + '-' + result.fullName + '.png');
							stream.write(new Buffer(png, 'base64'));
							stream.end();
						});
					});
                //}
            }
        });
    },

    onComplete: function () {
       
        var browserName, browserVersion,platform,testConfig;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');
            platform = caps.get('platform');

            testConfig = {
                reportTitle: 'Protractor Test Execution Report',
                outputPath: './reports/',
                outputFilename: 'ProtractorTestReport',
                screenshotPath: './screenshots',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: false,
                testPlatform: platform
            };
            new htmlReporter().from('./reports/xml/xmlresults.xml', testConfig);
        });
    },

    allScriptsTimeout: 120000,
    getPageTimeout: 120000,
    maxSessions: 1,

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        onComplete: null,
        // If true, display spec names.
        isVerbose: false,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 120000
    }
}