const express = require('express');
const app = express();
const port = 3000;

app.get('/api/booking/quotes', (req, res) => {
  const mockResponse = 
{
    "corridorType": "international",
    "deliveryType": "deliveryTimeBased",
    "options": [
        {
            "code": "now",
            "label": "delivery_description_now",
            "isDefault": true,
            "availability": {
                "isAvailable": true,
                "reason": null
            },
            "configuration": {
                "maxAmount": {
                    "value": "2000.00",
                    "currency": "EUR"
                },
                "startTime": "07:30",
                "endTime": "19:45"
            },
            "promotion": {
                "isApplied": true,
                "isFxDiscountApplied": true,
                "notAppliedReason": null
            },
            "visibility": {
                "tag": null,
                "estimateLabel": null
            },
            "deliveryEstimate": "2024-09-29T15:41:15+00:00",
            "fee": {
                "value": "0.00",
                "valueBeforeDiscount": "1.99",
                "currency": "EUR"
            },
            "rate": {
                "value": "1.84905",
                "fromCurrency": "EUR",
                "toCurrency": "AZN"
            },
            "receivingAmount": {
                "value": "1340.56",
                "currency": "AZN"
            },
            "sendingAmount": {
                "value": "725.00",
                "currency": "EUR"
            },
            "isIdvRequired": false,
            "payInOptions": [
                {
                    "code": "bank",
                    "isDefault": false,
                    "availability": {
                        "maxAmount": null,
                        "isAvailable": false,
                        "reason": "OPTION_DISABLED"
                    },
                    "visibility": {
                        "tag": null,
                        "estimateLabel": null
                    },
                    "bookingToken": null
                },
                {
                    "code": "card",
                    "isDefault": true,
                    "availability": {
                        "maxAmount": {
                            "value": "11968.90",
                            "currency": "EUR"
                        },
                        "isAvailable": true,
                        "reason": null
                    },
                    "visibility": {
                        "tag": null,
                        "estimateLabel": null
                    },
                    "bookingToken": "mock"
                }
            ]
        },
        {
            "code": "standard",
            "label": "delivery_description_standard",
            "isDefault": false,
            "availability": {
                "isAvailable": true,
                "reason": null
            },
            "configuration": {
                "maxAmount": {
                    "value": "1000000.00",
                    "currency": "EUR"
                },
                "startTime": "00:00",
                "endTime": "23:59"
            },
            "promotion": {
                "isApplied": true,
                "isFxDiscountApplied": true,
                "notAppliedReason": null
            },
            "visibility": {
                "tag": null,
                "estimateLabel": null
            },
            "deliveryEstimate": "2024-10-01T17:30:00+00:00",
            "fee": {
                "value": "0.00",
                "valueBeforeDiscount": "0.99",
                "currency": "EUR"
            },
            "rate": {
                "value": "1.84905",
                "fromCurrency": "EUR",
                "toCurrency": "AZN"
            },
            "receivingAmount": {
                "value": "1340.56",
                "currency": "AZN"
            },
            "sendingAmount": {
                "value": "725.00",
                "currency": "EUR"
            },
            "isIdvRequired": false,
            "payInOptions": [
                {
                    "code": "bank",
                    "isDefault": false,
                    "availability": {
                        "maxAmount": null,
                        "isAvailable": true,
                        "reason": null
                    },
                    "visibility": {
                        "tag": null,
                        "estimateLabel": null
                    },
                    "bookingToken": "mock"
                },
                {
                    "code": "card",
                    "isDefault": true,
                    "availability": {
                        "maxAmount": {
                            "value": "11968.90",
                            "currency": "EUR"
                        },
                        "isAvailable": true,
                        "reason": null
                    },
                    "visibility": {
                        "tag": null,
                        "estimateLabel": null
                    },
                    "bookingToken": "Mock"
                }
            ]
        }
    ],
    "accountTypes": [
        {
            "type": "vgsCard",
            "availability": {
                "isAvailable": true,
                "reason": null
            },
            "visibility": {
                "tag": null
            }
        }
    ]
}
;

  res.json(mockResponse);
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});
