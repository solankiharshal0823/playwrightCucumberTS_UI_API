@Quotation_NFT_API
Feature: Non Functional Tests for Quotation API of Transfer Go

    @NFT_API
    Scenario Outline: Verify the response times of Quotation API is less than 200 milliseconds
        When user sends money from country code "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount <amount> using QuotationAPI and measures response time
        Then the API response status code should be 200
        And  verify the response time is less than 200 ms

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | amount  |
            | DE              | EUR              | CA            | CAD            | 5000.00 |
            | LT              | EUR              | BS            | BSD            | 1000.00 |
            | LT              | EUR              | AZ            | AZN            | 1500.00 |
            | TR              | TRY              | LT            | EUR            | 2500.00 |
            | LT              | EUR              | BD            | BDT            | 3000.00 |
            | DE              | EUR              | NG            | NGN            | 3500.00 |


    @NFT_API
    Scenario Outline: Verify sending 100 requests in parallel to perform load testing on Quotation API and validate success for each request
        When I initiate 100 requests to send money from country "<fromCountryCode>" in currency code "<fromCurrencyCode>" to country code "<toCountryCode>" in currency code "<toCurrencyCode>" with amount <amount> using QuotationAPI and record all responses
        And  verify the responses for all requests is 200

        Examples:
            | fromCountryCode | fromCurrencyCode | toCountryCode | toCurrencyCode | amount  |
            | DE              | EUR              | CA            | CAD            | 5000.00 |
            | LT              | EUR              | BS            | BSD            | 1000.00 |
