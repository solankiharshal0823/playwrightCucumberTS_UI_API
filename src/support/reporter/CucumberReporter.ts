import DateUtil from "../utils/DateUtil";
import EnvUtil from "../utils/EnvUtil";

let reporter = require('cucumber-html-reporter');

export default class CucumberReporter {    
    public static generate() {
        EnvUtil.setEnv();
        const options = {
            brandTitle: "Acceptance Test Report",
            theme: 'bootstrap',
            jsonFile: 'test-results/reports/cucumber.json',
            output: 'test-results/reports/cucumber.html',
            reportSuiteAsScenarios: true,
            scenarioTimestamp: true,
            launchReport: false,
            columnLayout: 1,
            metadata: {
                "Execution Date": DateUtil.dateGenerator("DD/MM/YYYY", 0, 0, 0),                
                "Base URL": process.env.BASE_URL,
                "Environment": process.env.ENVIRONMENT,       
                "Browser": process.env.BROWSER,                
                "REST Endpoint": process.env.API_GetQuotation_Endpoint,
            }
        };
        reporter.generate(options);
    }
}
CucumberReporter.generate();