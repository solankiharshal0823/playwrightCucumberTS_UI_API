import { ICreateAttachment } from '@cucumber/cucumber/lib/runtime/attachment_manager';
import winston from 'winston';

// Utility function to strip ANSI escape codes
const stripAnsiCodes = (str: string): string => {
    return str.replace(/[\u001b\u009b][[\\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

// Custom formatter to remove ANSI codes
const removeAnsiFormat = winston.format((info) => {
    info.message = stripAnsiCodes(info.message);
    return info;
});

const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                removeAnsiFormat(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
            ),
        }),
        new winston.transports.File({
            filename: 'test-results/logs/execution.log',
            format: winston.format.combine(
                removeAnsiFormat(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
            ),
        }),
    ],
});

const TEST_SEPARATOR = "##############################################################################";

export default class Log {
    public static testBegin(scenario: string): void {
        this.printLogs(`Scenario: ${scenario} - Started`, TEST_SEPARATOR);
    }

    public static testEnd(scenario: string, status: string): void {
        this.printLogs(`Scenario: ${scenario} - ${status}`, TEST_SEPARATOR);
    }

    private static printLogs(msg: string, separator: string) {
        Logger.info(separator);
        Logger.info(`${msg.toUpperCase()}`);
        Logger.info(separator);
    }

    public static info(message: string): void {
        Logger.info(message);
    }

    public static error(error: string): void {
        Logger.error(error);
    }

    public static attachText(attach: ICreateAttachment, message: string): void {
        Logger.info(message);
        attach(message);
    }
}