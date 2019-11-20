import * as bunyan from 'bunyan';
import { loggerConfig } from './constants/constant';
/**
 * Logger utility using JSON based 'bunyan' node module
 */
export class Logger {

  /**
   * Function to create a logger instance
   * @param moduleName
   */
  public static getLogger(moduleName?: string) {

    // Create logger instance if null
    if (Logger.logger == null) {

      Logger.logger = bunyan.createLogger({
        name: loggerConfig.appName || 'customer-finder',
        streams: [{
          level: <any>loggerConfig.level || 'info',
          path: loggerConfig.logFile || 'customer-finder.log'
        }]
      });
    }

    // if moduleName is passed, return child logger with that moduleName
    if (moduleName == null || moduleName.length === 0) {
      return Logger.logger;
    } else {
      return Logger.logger.child({ module: moduleName });
    }
  }

  private static logger: bunyan;

  /**
   * Logger constructor
   */
  private constructor() {
  }
}

