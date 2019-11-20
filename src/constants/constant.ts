// logging configuration
// use environment variables or default values
export let loggerConfig = {
    appName: process.env.APP_NAME || "customer-finder",
    level: process.env.LOG_LEVEL || "debug",
    logFile: process.env.LOG_FILE || "customer-finder.log"
}