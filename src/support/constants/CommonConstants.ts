export default class CommonConstants {
  static readonly ONE_THOUSAND = 1000;
  static readonly PARALLEL_MODE = "parallel";
  static readonly SERIAL_MODE = "serial";
  static readonly REPORT_TITLE = "Test Execution Report";
  static readonly RESULTS_PATH = "./test-results/results";
  static readonly SIXTY = 60;
  static readonly BLANK = '';
  static readonly WAIT = parseInt(process.env.WAIT_TIME, 10) * CommonConstants.ONE_THOUSAND * CommonConstants.SIXTY;
}
