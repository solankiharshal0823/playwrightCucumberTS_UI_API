import jp from "jsonpath";
import Log from "../../logger/Log";

export default class RESTResponse {
  public constructor(
    private headers: any,
    private body: string,
    private status: number,
    private description: string
  ) {}


  /**
   * Get response status code
   * @returns
   */
  public async getStatusCode(): Promise<number> {
    Log.info(`Getting status code of ${this.description}`);
    return this.status;
  }

  /**
   * Get response body
   * @returns
   */
  public async getBody(): Promise<string> {
    Log.info(`Getting response body of ${this.description}`);
    return this.body;
  }

  /**
   * Get response headers
   * @returns
   */
  public async getHeaders(): Promise<string> {
    Log.info(`Getting response Headers of ${this.description}`);
    return this.headers;
  }

  /**
   * Validates that response is a valid Json
   * @param responseBody
   */
  public async validateJsonResponse(responseBody: string) {
    try {
      JSON.parse(responseBody);
      console.log("Valid Json response received!!");
      return true;
    } catch (e) {
      throw new Error("Invalid Json Response!!");
    }
  }
}
