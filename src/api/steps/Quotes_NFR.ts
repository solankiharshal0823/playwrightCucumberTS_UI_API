import { Given, Then, When } from "@cucumber/cucumber";
import RequestHeader from "../../support/playwright/API/RequestHeader";
import Constants from "../constants/Constants";
import { APIRequestContext, APIResponse, request } from "@playwright/test";
import Log from "../../support/logger/Log";

let responseTime: number;
let statusCode: number;
let loadResponses;

// Helper function to construct request headers for quotation api
function getRequestHeader() {
  return new RequestHeader()
    .set(Constants.CONTENT_TYPE, Constants.APPLICATION_JSON)
    .set(Constants.ACCEPT, Constants.APPLICATION_JSON)
    .set(Constants.USER_AGENT, Constants.USER_AGENT_VALUE)
    .get();
}

// Utility function to replace placeholders in the endpoint as per structure
function replaceEndpointPlaceholders(
  endpoint: string,
  fromCurrencyCode: string,
  toCurrencyCode: string,
  fromCountryCode: string,
  toCountryCode: string,
  amount: number
) {
  return endpoint
    .replace("{fromCurrencyCode}", fromCurrencyCode)
    .replace("{toCurrencyCode}", toCurrencyCode)
    .replace("{fromCountryCode}", fromCountryCode)
    .replace("{toCountryCode}", toCountryCode)
    .replace("{amount}", amount.toString());
}

// Step to make the API request and calculate response time
When(
  "user sends money from country code {string} in currency code {string} to country code {string} in currency code {string} with amount {float} using QuotationAPI and measures response time",
  async function (
    fromCountryCode: string,
    fromCurrencyCode: string,
    toCountryCode: string,
    toCurrencyCode: string,
    amount: number
  ) {
    // Replace the placeholders in the API endpoint with actual values
    const endPoint = replaceEndpointPlaceholders(
      process.env.API_BASE_URL + process.env.API_GetQuotation_Endpoint,
      fromCurrencyCode,
      toCurrencyCode,
      fromCountryCode,
      toCountryCode,
      amount
    );

    // Capture request and response timings using Playwright's requestContext
    const requestContext: APIRequestContext = await request.newContext();
    const start = Date.now();
    
    const response: APIResponse = await requestContext.get(endPoint, {
      headers: getRequestHeader(),
    });
    const end = Date.now();
    
    // Calculate the response time
    responseTime = end - start;
    console.log(`API response time: ${responseTime}ms`);

    statusCode = response.status();
    console.log(`API response status code: ${statusCode}`);
  }
);

// Step to verify the status code is 200
Then("the API response status code should be {int}", async function (expectedStatusCode: number) {
  if (statusCode !== expectedStatusCode) {
    throw new Error(`Expected status code ${expectedStatusCode}, but got ${statusCode}`);
  }
  console.log(`Status code validation passed: ${statusCode}`);
});

// Step to verify the response time is less than value passed in feature file
Then("verify the response time is less than {int} ms", async function (allowedResponseTime: number) {
  if (responseTime > allowedResponseTime) {
    throw new Error(`Response time exceeded ${allowedResponseTime}ms, current value : ${responseTime}ms`);
  }
  Log.attachText(this.attach,`Response time validation passed, actual response time: ${responseTime}ms`);
});

// Step to make the API request for given number of times in parallel to achieve load testing
When(
  "I initiate {int} requests to send money from country {string} in currency code {string} to country code {string} in currency code {string} with amount {float} using QuotationAPI and record all responses",
  async function (
    requestCount : number,
    fromCountryCode: string,
    fromCurrencyCode: string,
    toCountryCode: string,
    toCurrencyCode: string,
    amount: number
  ) {
    // Replace the placeholders in the API endpoint with actual values
    const endPoint = replaceEndpointPlaceholders(
      process.env.API_BASE_URL + process.env.API_GetQuotation_Endpoint,
      fromCurrencyCode,
      toCurrencyCode,
      fromCountryCode,
      toCountryCode,
      amount
    );

    // Capture request and response timings using Playwright's requestContext
    const requestContext: APIRequestContext = await request.newContext();
    const start = Date.now();

    // Create an array of promises to send required requests in parallel
    const promises: Promise<APIResponse>[] = [];
    for (let i = 0; i < requestCount; i++) {
      promises.push(requestContext.get(endPoint, {
        headers: getRequestHeader(),
      }));
    }

    // Wait for all requests to complete
    loadResponses = await Promise.all(promises);
    const end = Date.now();

    // Calculate the response time for all requeests to be completed
    const responseTime = end - start;
    console.log(`API response time for 100 requests: ${responseTime}ms`);


  }
);

// Step to verify the status code is 200 for all responses received as part of load tests
Then("verify the responses for all requests is {int}", async function (expectedStatusCode: number) {
      loadResponses.forEach((response, index) => {
        console.log(`API response status code for request ${index + 1}: ${response.status()}`);
        if (response.status() !== expectedStatusCode) {
          throw new Error(`Expected status code ${expectedStatusCode}, but got ${response.status()}`);
        }
      });
  console.log(`Status code validation passed: ${expectedStatusCode}`);
  Log.attachText(this.attach,`All parallel(loaded) requests passed with success, status code: ${expectedStatusCode}`);
});
