@Quotation_FT_API
Feature: Transfer go Quotation Feature Functional API Tests

    @Functional_API
    Scenario Outline: Verify Available Delivery Options for given set of Country and Currency pairs
        When user makes a request for quotation to send money from country code "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount <amount>
        Then user should get a status code 200 in response to the request
        And expected delivery options "<DeliveryOptions>" are available in the response

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | amount  | DeliveryOptions        |
            | LT              | EUR              | BS            | BSD            | 1000.00 | standard, now          |
            | LT              | EUR              | AZ            | AZN            | 1500.00 | now, standard          |
            | LT              | EUR              | TM            | TMT            | 6000.00 | standard, now          |
            | TR              | TRY              | LT            | EUR            | 2500.00 | standard               |
            | LT              | EUR              | BD            | BDT            | 3000.00 | standard               |
            | DE              | EUR              | NG            | NGN            | 3500.00 | card-ngLocalAccountNgn |
            | DK              | DKK              | KZ            | KZT            | 4500.00 | card-vgsCard           |
            | GB              | GBP              | LT            | EUR            | 5500.00 | card-iban              |



    @Functional_API
    Scenario Outline: Validate that receiving amount is calculated correctly as per fees and sending amount for each delivery option for given Country and Currency pairs
        When user makes a request for quotation to send money from country code "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount <amount>
        Then user should get a status code 200 in response to the request
        And  user validates that receiving amount is calculated correctly as per fees and sending amount for each delivery option

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | amount |
            | LT              | EUR              | BS            | BSD            | 550.55 |
            | LT              | EUR              | AZ            | AZN            | 725.00 |
            | TR              | TRY              | LT            | EUR            | 800    |


    @Functional_API
    Scenario Outline: Validate that exceeding configured maxAmount for selected delivery option makes it unavailable
        When user makes a request for quotation to send money from country code "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount exceeding from configured maxAmount of <maxAmount> for selected DeliveryOption "<selectedDeliveryOption>"
        Then user should get a status code 200 in response to the request
        And  user validates that exceeding maxAmount of <maxAmount> for selected delivery option "<selectedDeliveryOption>" makes it unavailable with reason as "<message>"

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | maxAmount  | selectedDeliveryOption | message                    |
            | LT              | EUR              | BS            | BSD            | 2000.00    | now                    | AMOUNT_LIMIT_EXCEEDED      |
            | LT              | EUR              | TM            | TMT            | 2000.00    | now                    | AMOUNT_LIMIT_EXCEEDED      |
            | LT              | EUR              | BS            | BSD            | 2000.00    | now                    | AMOUNT_LIMIT_EXCEEDED      |
            | LT              | EUR              | BS            | BSD            | 2000.00    | now                    | TestingWrongMessageFailure |
            | LT              | EUR              | BS            | BSD            | 1000000.00 | standard               | sendAmountTooLarge         |
            | LT              | EUR              | AZ            | AZN            | 1000000.00 | standard               | receiveAmountTooLarge      |
            | LT              | EUR              | AZ            | AZN            | 1000000.00 | standard               | TestingWrongMessageFailure |



    @Functional_API
    Scenario Outline: Verify that for a given request verify it is not possible to send less than 1EUR and more than 1000000EUR
        When user makes a request for quotation to send money from country code "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount <amount>
        Then user should get a status code 422 in response to the request
        And verify that response contains error as "<expectedError>" and message as "<expectedMessage>" as per the sent amount

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | amount     | expectedError            | expectedMessage    |
            | DE              | EUR              | CA            | CAD            | 1000000.01 | SEND_AMOUNT_IS_TOO_LARGE | sendAmountTooLarge |
            | DE              | EUR              | CA            | CAD            | 0.99       | AMOUNT_IS_TOO_SMALL      | tooSmallAmount     |

