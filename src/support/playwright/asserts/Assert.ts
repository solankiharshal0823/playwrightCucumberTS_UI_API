import { expect } from "@playwright/test";
import Log from "../../logger/Log";

export default class Assert {
    /**
     * To verify that condition passed as input is true
     * @param condition - boolean condition
     * @param description - description of element that is being validated
     * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertTrue(condition: boolean, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is true`);
        try {
            expect(condition).toBeTruthy();
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed & Received '${condition}'`);
            }
        }
    }
    /**
     * To verify that value1 contains value2
     * @param value1 - string input
     * @param value2 - should be present in value1
     * @param description - description of element that is being validated
     * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertContains(value1: string, value2: string, description: string, softAssert = false) {
        Log.info(`Verifying that ${description}: '${value1}' contains text '${value2}'`);
        try {
            expect(value1).toContain(value2);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, ${value1} does not contain ${value2}`);
            }
        }
    }

    /**
    * To verify that value1 contains value2 ignoring case
    * @param value1 - string input
    * @param value2 - should be present in value1
    * @param description - description of element that is being validated
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertContainsIgnoreCase(value1: string, value2: string, description: string,
        softAssert = false) {
        Log.info(`Verifying that ${description}: '${value1}' contains text '${value2}'`);
        try {
            expect(value1.toLowerCase()).toContain(value2.toLowerCase());
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, ${value1} does not contain ${value2}`);
            }
        }
    }

    /**
   * To verify that actual contains expected ignoring case
   * @param actual - string input
   * @param expected - string input
   * @param description - description of element that is being validated
   * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
   */
    public static async assertEqualsIgnoreCase(actual: string, expected: string, description: string,
        softAssert = false) {
        Log.info(`Verifying that ${description} has text ${expected}`);
        try {
            expect(actual.toLowerCase())
                .toEqual(expected.toLowerCase());
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, ${expected} does not equal ${actual}`);
            }
        }
    }

    /**
     * To verify actual equals expected
     * @param value1 any object
     * @param value2 any object to compare
     * @param description object description
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertEquals(actual: any, expected: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} has text '${expected}'`);
        try {
            expect(actual).toEqual(expected);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, ${expected} does not equal ${actual}`);
            }
        }
    }

    /**
     * To verify that actual passed as input is false
     * @param condition boolean
     * @param description description of element that is being validated
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertFalse(condition: boolean, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is false`);
        try {
            expect(condition).toBeFalsy();
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion Failed, Expected is 'false' & Acutal is '${condition}'`);
            }
        }
    }

    /**
    * To verify that element not contains expected
    * @param actual any value 
    * @param expected any value
    * @param description description of element that is being validated
    * @param softAssert for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertNotContains(actual: any, expected: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} does not contain '${expected}'`);
        try {
            expect(actual).not.toContain(expected);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion Failed, '${actual}' should NOT CONTAIN '${expected}'`);
            }
        }
    }

    /**
     * To verify actual not equals to expected
     * @param actual any object
     * @param expected any object to compare
     * @param description object description
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNotEquals(actual: any, expected: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is not equals to ${expected}`);
        try {
            expect(actual).not.toEqual(expected);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, Expected '${expected}' should NOT be EQUAL to Actual '${actual}'`);
            }
        }
    }

    /**
     * To verify value not equals to null
     * @param value any value
     * @param description description of the value
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNotNull(value: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is not null`);
        try {
            expect(value).not.toEqual(null);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, Expected is 'NOT null' & Actual is '${value}'`);
            }
        }
    }

    /**
     * To validate that value is not null
     * @param value any value
     * @param description description of the element
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertNull(value: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is equals to null`);
        try {
            expect(value).toEqual(null);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, Expected is 'null' & Actual is '${value}'`);
            }
        }
    }

    /**
    * To validate that value is Undefined
    * @param value any value
    * @param description description of the element
    * @param softAssert for soft asserts this has to be set to true, else this can be ignored
    */
    public static async assertUndefined(value: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is undefined`);
        try {
            expect(value).toEqual(typeof undefined);
        } catch (error) {
            if (!softAssert) {
                throw new Error(`Assertion failed, Expected is 'Undefined' & Actual is '${value}'`);
            }
        }
    }

    /**
     * To validate that element is empty
     * @param value any element
     * @param description description of the element
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */
    public static async assertToBeEmpty(value: any, description: string, softAssert = false) {
        Log.info(`Verifying that ${description} is empty`);
        try {
            await expect(value).toBeEmpty();
        } catch (error) {
            if (!softAssert) {
                throw new Error( `Assertion failed, Expected is 'Empty' & Actual is '${value}'`);
            }
        }
    }
}
