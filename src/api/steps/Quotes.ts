import { Given, Then, When } from "@cucumber/cucumber";
import RequestHeader from "../../support/playwright/API/RequestHeader";
import RESTResponse from "../../support/playwright/API/RESTResponse";
import Assert from "../../support/playwright/asserts/Assert";
import Constants from "../constants/Constants";
import Log from '../../support/logger/Log';

// Helper function to construct request headers for quotation api
function getRequestHeader() {
  return new RequestHeader()
    .set(Constants.CONTENT_TYPE, Constants.APPLICATION_JSON)
    .set(Constants.ACCEPT, Constants.APPLICATION_JSON)
    .set(Constants.USER_AGENT, Constants.USER_AGENT_VALUE)
    .get();
}


// Utility function to replace placeholders in the endpoint as per required structure
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

// Step definition to take params from feature file and send dynamic request as per given combination of countrys and currencies
When(
  "user makes a request for quotation to send money from country code {string} in currency code {string} to country code {string} in currency code {string} with amount {float}",
  async function (
    fromCountryCode: string,
    fromCurrencyCode: string,
    toCountryCode: string,
    toCurrencyCode: string,
    amount: number
  ) {
    // Replace the placeholders in the API endpoint with actual values to create dynamic api
    const endPoint = replaceEndpointPlaceholders(
      process.env.API_BASE_URL + process.env.API_GetQuotation_Endpoint,
      fromCurrencyCode,
      toCurrencyCode,
      fromCountryCode,
      toCountryCode,
      amount
    );

    // Make the GET request
    const response: RESTResponse = await this.rest.get(
      this.attach,
      endPoint,
      getRequestHeader(),
      "Quotation API Transfer GO"
    );

    console.log("Received response from Transfer Go:" + (await response.getBody()));
    await response.validateJsonResponse(await response.getBody());

    this.response = response;
  }
);

// Step definition to validate the status code in response, status code passed from cucumber feature
Then(
  "user should get a status code {int} in response to the request",
  async function (status: number) {
    const response: RESTResponse = this.response;
    await Assert.assertEquals(
      await response.getStatusCode(),
      status,
      "Validating the response status code "
    );
  }
);

//Step definition to validate available delivery options in response match the expected passed from cucumber feature file
Then(
  "expected delivery options {string} are available in the response",
  async function (expectedDeliveryOptions: string) {
    const response: RESTResponse = this.response;

    // Parse the delivery options from the response
    const responseBody = await response.getBody();
    const parsedBody = JSON.parse(responseBody);

    // Extracting code options and ignoring  payInOptions
    const availableDeliveryOptions = parsedBody.options.map(
      (option: { code: string }) => option.code
    );

    // Convert the expectedDeliveryOptions string to an array for further validation
    const expectedOptionsArray = expectedDeliveryOptions
      .split(",")
      .map((opt) => opt.trim());

      // This attaches the message to cucumber report
      Log.attachText(this.attach,"Available delivery options from response received:"+ availableDeliveryOptions);

    // Check if all expected options are available in the response
    for (const option of expectedOptionsArray) {
      console.log(`Validating ${option} in available delivery option array ! !`);
      await Assert.assertTrue(
        availableDeliveryOptions.includes(option),
        `Expected delivery option of: "${option}" should be available in the response. Available options in response: ${availableDeliveryOptions}`
      );
    }
  }
);

//Step definition that fetches receiving amount and calculates same on basis of fees and sending amount for each delivery option (not payInoption)
Then(
  "user validates that receiving amount is calculated correctly as per fees and sending amount for each delivery option",
  async function () {
    const response: RESTResponse = this.response;
    const responseBody = await response.getBody();
    const responseJson = JSON.parse(responseBody);
    const deliveryOptions  = responseJson.options;
    deliveryOptions.forEach(option => {

      // Extracting the values from the option
      const fee = parseFloat(option.fee.value);
      const rate = parseFloat(option.rate.value);
      const sendingAmount = parseFloat(option.sendingAmount.value);
      const receivingAmount = parseFloat(option.receivingAmount.value);

       // Calculate receiving amount such as (sendingAmount - fee) * rate
    const calculatedReceivingAmount = (sendingAmount - fee) * rate;

      console.log(`Option: ${option.code}`);
      console.log(`Sending Amount: ${sendingAmount}`);
      console.log(`Fee: ${fee}`);
      console.log(`Rate: ${rate}`);
      console.log(`Calculated Receiving Amount: ${calculatedReceivingAmount}`);
      console.log(`Expected Receiving Amount: ${receivingAmount}`);

     // Convert to larger number for comparision has floating points have 0.01 precision issue in TypeScript
    const calculatedCents = Math.floor(calculatedReceivingAmount * 100);
    const expectedCents = Math.floor(receivingAmount * 100);

     // Validate the maxAmount matches the one passed by the user from feature file
     if (calculatedCents !== expectedCents) {
      throw new Error(
        `Expected receiving amount: "${expectedCents/100}" but got "${calculatedCents/100} for delivery option: ${option.code}".`
      );
    }
    Log.attachText(this.attach,"Sucessfully verified the receiveing amount against caclculated amount as per send and fee amount for option "+ option.code + " in response!");

    });

 

  }
);

//Step definition to send quotation api requests with required parameters and  amount which is execeeding the configured maxAmount value for a given delivery option
When(
  "user makes a request for quotation to send money from country code {string} in currency code {string} to country code {string} in currency code {string} with amount exceeding from configured maxAmount of {float} for selected DeliveryOption {string}",
  async function (
    fromCountryCode: string,
    fromCurrencyCode: string,
    toCountryCode: string,
    toCurrencyCode: string,
    maxAmount: number,
    deliveryOption: string
  ) {
    // Replace the placeholders in the API endpoint with actual values
    const endPoint = replaceEndpointPlaceholders(
      process.env.API_BASE_URL + process.env.API_GetQuotation_Endpoint,
      fromCurrencyCode,
      toCurrencyCode,
      fromCountryCode,
      toCountryCode,
      maxAmount + 0.01 // exceed the maxAmount
    );

    // Make the GET request
    const response: RESTResponse = await this.rest.get(
      this.attach,
      endPoint,
      getRequestHeader(),
      "Request Quote"
    );
    const responseBody = await response.getBody();
    await response.validateJsonResponse(responseBody);
  
    // Attach the response to the current scenario context
    this.response = response;

    let responseJson;
    responseJson = JSON.parse(responseBody);

    if (responseJson.error && responseJson.error === "RECEIVE_AMOUNT_IS_TOO_LARGE" || responseJson.error && responseJson.error === "SEND_AMOUNT_IS_TOO_LARGE" ) {
      // as in some cases, configured maxAmount for an option can be 1000000.00 which is also the max amount allowed for a request, we need to handle this case for some country/curreny  pairs
      this.deliveryOptionError = {
        message: responseJson.message,
        maxAmount: responseJson.maxAmount,
        currency: responseJson.currency,
      };
      console.log("Error response detected:", this.deliveryOptionError);
    } else {
    
      const options = responseJson.options;

      // Map to create option and associated values for verification (isAvailable, reason, maxAmount)
      this.deliveryOptionMap = new Map<string, { isAvailable: boolean; reason: string; maxAmount: number }>();

      options.forEach((option: any) => {
        if (option.code === deliveryOption) {
          const isAvailable = option.availability.isAvailable;
          const reason = option.availability.reason;

          const maxAmountFromResponse = option.configuration.maxAmount?.value;

          this.deliveryOptionMap.set(option.code, {
            isAvailable,
            reason,
            maxAmount: maxAmountFromResponse,
          });
        }
      });
      Log.attachText(this.attach,"Created deliveryOptionMap:"+ this.deliveryOptionMap)
    }
  }
);



//Setp deifinition where we validte the response for a given send amount and error message and availability
When(
  "user validates that exceeding maxAmount of {float} for selected delivery option {string} makes it unavailable with reason as {string}",
  async function (
    maxAmount: number,
    deliveryOption: string,
    expectedReason: string
  ) {
    // Validated if the  maxAmount 1000000 and the response we got
    if (this.deliveryOptionError) {
      const { message } = this.deliveryOptionError;

      // Validate the message in the error response for  maxAmount >= 1000000
      if (message !== expectedReason) {
        throw new Error(`Expected message "${expectedReason}" but instead got "${message}".`);
      }
      Log.attachText(this.attach,"Validation successful for exceeding maxAmount error case as maxAmount is 1000000.00 and we dont support transactions beyond 1000000.00");

    } else {

      // for maxAmount < 1000000.00
      const optionDetails = this.deliveryOptionMap.get(deliveryOption);
      if (!optionDetails) {
        throw new Error(`No data found for delivery option: ${deliveryOption}`);
      }
      const { isAvailable, reason, maxAmount: maxAmountFromResponse } = optionDetails;

      // Validate that the delivery option is unavailable as maxAmount condition breached for it
      if (isAvailable) {
        throw new Error(`Expected delivery option "${deliveryOption}" to be unavailable, but it was available.`);
      }

      // Validate the reason
      if (reason !== expectedReason) {
        throw new Error(`Expected reason "${expectedReason}" but got "${reason}".`);
      }

      const formattedMaxAmount = maxAmount.toFixed(2);

      // Validate the maxAmount matches the one passed by the user
      if (maxAmountFromResponse !== formattedMaxAmount) {
        throw new Error(
          `Expected maxAmount to be "${formattedMaxAmount}" but got "${maxAmountFromResponse}".`
        );
      }
      Log.attachText(this.attach,`Delivery option: ${deliveryOption}, is unavailable due to using amount exceeding configured maxAmount`);
    }
  }
);

//Step defintion to verify the error response on basis of send amount
When(
  'verify that response contains error as {string} and message as {string} as per the sent amount',
  async function (expectedError: string, expectedMessage: string) {

    if (!this.response) {
      throw new Error("No response found to verify.");
    }

    const responseBody = await this.response.getBody();
    let responseJson;

    try {
      responseJson = JSON.parse(responseBody);
    } catch (e) {
      throw new Error("Failed to parse response body as JSON.");
    }

    // Extracting error' and message attributes from the response
    const actualError = responseJson.error;
    const actualMessage = responseJson.message;


    await Assert.assertEqualsIgnoreCase(
      actualError,
      expectedError,
      `Validate the actual error and expected error received from response`
    );

    await Assert.assertEqualsIgnoreCase(
      actualMessage,
      expectedMessage,
      `Validate the actual message and expected message received from response`
    );
    Log.attachText(this.attach,`Verified that response contains error as "${expectedError}" and message as "${expectedMessage}"`);

  }
);

