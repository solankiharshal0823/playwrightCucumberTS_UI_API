**This is Playwright-Cucumber-Typescript (node js) based Automation framework that can be used for API Testing and UI Testing
Currently this framework supports API tests only but can be easily extened to UI Tests support.**

Test Scenarios for given Assignment from TransferGo can be found under :

**Functional API Tests : features/api**

**Non Functional API Tests: features/nfr**

**####### Installation ########**

Pre-Requiste: Playwright requires Node.js v14+ , kindly install

Install dependencies using command : 
npm ci

**####### Environement variables  ########**

Environement Variables are set in .env file

**####### Running Tests ########**

All feature files and tests have tags to run.

To run functional api tests use following command: 
npm run test:tags -- --tags "@Functional_API"

To run Non functional api tests use following command: 
npm run test:tags -- --tags "@NFT_API"


**####### Running Mock API server on Localhost for mock api tests as Transfer Go API requests are blocked by Cloudflare after multiple requests ########**

cd .\mock-api\
npm run runMockServer

This runs a mocker server on http://localhost:3000 and responds with content in server.js file

**####### Reports ########**

We use Cucumber html reports, after all tests are executed run following command to generate reports, reports can be found at test-results\reports\cucumber.html , open in desired browser to view

npm run report

**####### Re Run failed tests ########**

This will rerun the failed tests only

npm run failed:test

**####### Execution Log ########**

Test logs/ Console log output for tests can be found here

test-results/logs/execution.log



************************************************************************************************************
Comments:

All delivery options are available: standard, now. Please keep in mind that not all delivery options are available for a given set of country and currency pairs. For example in the request above “now” and “standard” delivery options should be available. If we change fromCountryCode to TR (Turkey) and fromCurrencyCode to TRY (Turkish lira) then we should be able to see “standard” delivery option. -- Done

Each delivery option has a set of payment options available (e.g. bank, card). Verify that the receiving amount is calculated correctly ( sendingAmount - fee ) for each payment option. -- Done (payInOptions such as card, bank does not have fee attribute in json response, the api only has fee option as per available delivery options, written tests to validate this requirement)

Each delivery option has a maxAmount configured. Verify that exceeding maxAmount for selected delivery option makes it unavailable. --Done

For a given request verify that it is not possible to send less than 1EUR and more than 1000000EUR --Done

Verify that endpoint responds in <200ms --Done
