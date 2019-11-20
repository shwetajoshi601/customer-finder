import * as readline from 'readline';
import * as fs from 'fs';
import { ICustomer } from './models/Customer';
import { IConfig } from './models/Config';
import { IResult, ICoordinate } from './models/HelperTypes';
import { Logger } from './logger';
import { Error, ErrorHandler } from './error-handler';

// get the logger instance
const logger = Logger.getLogger();

/**
 * Class consisting of methods to find a customer list within the given radius
 */
export class CustomerFinder {
    // holds the variable parameters in config
    private static config: IConfig;
    // holds shortlisted customers
    customerList: Array<ICustomer> = [];

    /**
     * Function to validate the config.json file and parse the required fields
     */
    private validateAndParseConfig() {
        logger.debug("validateAndParse() method entry");
        let config = CustomerFinder.config;
        // if customer data file path not given
        if (!config.customerDataSrc)
            return ErrorHandler.createErrorObject('02', 'customerDataSrc');

        let res = this.validateDataFile(config.customerDataSrc);
        // if data file is invalid
        if (res) return (res);

        logger.info("Found a valid data file");
        // validate the main co-ordinates from which distance needs to be calculated
        if (config.mainCoordinates) {
            if (!(config.mainCoordinates.latitude && config.mainCoordinates.longitude))
                return ErrorHandler.createErrorObject('02', 'mainCoordinates.latitude or mainCoordinates.longitude');
            // parse to number and convert to radians
            let result: IResult = this.parseLatLng(config.mainCoordinates);
            if (result.isValid) {
                logger.info("Found valid main Co-ordinates");
                CustomerFinder.config.mainCoordinates = this.convertDegreeToRadians(CustomerFinder.config.mainCoordinates);
            } else return ErrorHandler.createErrorObject('03', 'latitude/longitude');
        } else return ErrorHandler.createErrorObject('02', 'mainCoordinates')

        // for the radius, use default value of 100 is not given
        CustomerFinder.config.distanceThreshold = !config.distanceThreshold ? Number.parseFloat(process.env.DIST_THRESHOLD) || 100 : Number.parseFloat(<any>config.distanceThreshold);

        // if given radius is not a valid number
        if (Number.isNaN(CustomerFinder.config.distanceThreshold))
            return ErrorHandler.createErrorObject('03', 'config.distanceThreshold or Env: DIST_THRESHOLD');

        logger.info("Found valid radius value");
        logger.debug("validateAndParseConfig() method exit");
    }

    /**
     * Function to sort the customer by user_id list
     */
    private sortCustomerList() {
        logger.debug("sortCustomerList() method entry");
        logger.info("Sorting the lost of shortlisted customers");
        this.customerList.sort((c1: ICustomer, c2: ICustomer) => {
            if (c1.user_id < c2.user_id) return -1;
            else if (c1.user_id == c2.user_id) return 0;
            else return 1;
        });
        logger.debug("sortCustomerList() method exit");
    }

    /**
     * Function to convert a set of co-ordinates from degree to radians
     * @param coordinates - an object containing latitude and longitude in degrees
     */
    private convertDegreeToRadians(coordinates: ICoordinate): ICoordinate {
        logger.debug("convertDegreeToRadians() method entry");
        const pi = Math.PI;
        let radians: ICoordinate;
        radians = {
            // round the result to 4 decimal places
            latitude: Number.parseFloat((coordinates.latitude * (pi / 180)).toFixed(4)),
            longitude: Number.parseFloat((coordinates.longitude * (pi / 180)).toFixed(4))
        };
        logger.debug("convertDegreeToRadians() method exit");
        return radians;
    }

    /**
     * Function to validate and parse latiude and longitude 
     * @param obj - an object containing latitude and longitude
     */
    private parseLatLng(obj): IResult {
        logger.debug("parseLatLng() method entry");
        let result: IResult = {
            isValid: false,
            coordinate: { latitude: 0, longitude: 0 }
        };

        if (obj.latitude && obj.longitude) {
            let lat = Number(obj.latitude);
            let long = Number(obj.longitude);
            // if latitude and longitude is a valid number
            if (!(Number.isNaN(lat) || Number.isNaN(long))) {
                logger.info("Found valid latitude and longitude");
                result.coordinate.latitude = lat;
                result.coordinate.longitude = long;
                result.isValid = true;
            }
            // latitude or longitude missing
        } else result.isValid = false;
        logger.debug("parseLatLng() method exit");
        return result;
    }

    /**
     * Function to calculate the great circle distance
     * @param coords1 - first set of latitude and longitude
     * @param coords2 - second set of latitude and longitude
     */
    private calculateDistance(coords1: ICoordinate, coords2: ICoordinate): number {
        logger.debug("calculateDistance() method entry.");
        // consider radius of the earth as 6371
        let r = 6371;

        logger.info("Calculating th distance with earth's radius=" + r + " km");
        // apply the great circle distance formula
        let distance = r * Math.acos(Math.sin(coords1.latitude) * Math.sin(coords2.latitude) +
            Math.cos(coords1.latitude) * Math.cos(coords2.latitude) *
            Math.cos(Math.abs(coords1.longitude - coords2.longitude)));

        logger.debug("calculateDistance() method exit.");
        return distance;
    }

    /**
     * Function to validate the data file containing customer records
     * @param filePath - string containing the path of the data file
     */
    private validateDataFile(filePath: string): Error | void {
        logger.debug("validateDataFile() method entry");

        // the file must exist at the path specified
        if (!fs.existsSync(filePath)) return ErrorHandler.createErrorObject('01', filePath);

        // extract the file name
        let fileName = filePath.split('\\').pop().split('/').pop();

        // the file must be a .txt file
        if (!fileName.endsWith('.txt')) return ErrorHandler.createErrorObject('05', fileName)
    }

    /**
    * Function to display the list of customers
    * @param customerList 
    */
    displayCustomerList(customerList: Array<ICustomer>): void {
        logger.debug("displayCustomerList() method entry");
        console.log("------------------------------------------");
        console.log("Customers within " + CustomerFinder.config.distanceThreshold + " km");
        console.log("------------------------------------------");

        // display name and user_id of each matched customer
        customerList.forEach((customer) => {
            console.log("User ID: " + customer.user_id + ", Name: " + customer.name);
        });

        console.log("------------------------------------------");
        console.log("Total no. of Customers found: " + this.customerList.length);
        console.log("------------------------------------------");
        logger.debug("displayCustomerList() method exit");
    }

    /**
     * Function to load the configuration to begin processing
     */
    loadConfig(): Error | void {
        logger.debug("loadConfig() method entry");
        let configFilePath: string = '';
        try {
            logger.info("Loading the configuration file.");
            configFilePath = process.argv[2];
            logger.info("Found configuration file path: " + configFilePath);
            console.log("Loading configuration from the file: " + configFilePath);
            CustomerFinder.config = require(configFilePath);
            logger.debug("loadConfig() method exit");
            logger.info("Validating the configuration file");
            return this.validateAndParseConfig();
        } catch (e) {
            logger.debug("loadConfig() method exit");
            return ErrorHandler.createErrorObject('01', configFilePath);
        }
    }

    /**
     * Function to find customers within the desired radius
     */
    findCustomers(): Promise<Array<ICustomer> | Error> {
        logger.debug("findCustomers() method entry");

        let dataFilePath: string = CustomerFinder.config.customerDataSrc;
        logger.info("Found the data file path: " + dataFilePath);
        console.log("Found the data file path: " + dataFilePath);
        return new Promise((resolve, reject) => {
            try {
                // create the stream to the file to read records line by line
                const read = readline.createInterface({
                    input: fs.createReadStream(dataFilePath)
                });

                // for errors
                read.on('error', (error) => {
                    logger.debug("findCustomers() method entry");
                    return reject(ErrorHandler.createErrorObject('04', error));
                })
                    // on reading a record sucessfully
                    .on('line', (record: string) => {
                        let customer: ICustomer;
                        try {
                            // parse the string record to JSON
                            customer = typeof record == 'string' ? JSON.parse(record) : record;
                            logger.info("Parsed record for customer ID: " + customer.user_id);
                        } catch (e) {
                            logger.debug("findCustomers() method exit");
                            // if th record is an invalid JSON
                            return reject(ErrorHandler.createErrorObject('06', dataFilePath));
                        }
                        // check if lat long is available and valid
                        let res: IResult = this.parseLatLng(customer);
                        if (res.isValid) {
                            // convert degree to radians
                            res.coordinate = this.convertDegreeToRadians(res.coordinate);
                            // calculate the great circle distance
                            let distance = this.calculateDistance(res.coordinate, CustomerFinder.config.mainCoordinates);
                            // if distance less than threshold radius, add to the list
                            if (distance <= CustomerFinder.config.distanceThreshold) {
                                this.customerList.push(customer);
                            }
                        } else {
                            // invalid latiude longitude for the record
                            // here we do not reject the promise since the record can be skipped and the flow can move to the next record
                            logger.error("Error: Invalid latitude/longitude");
                            let error = ErrorHandler.createErrorObject('03', 'latitude/longitude');
                            logger.error("Error Details : " + JSON.stringify(error));
                            console.log(error);
                        }
                    })
                    // after reading all records
                    .on('close', () => {
                        logger.info("Completed reading customer records.");
                        console.log("Completed reading customer records");
                        // sort the customers by user_id
                        this.sortCustomerList();
                        logger.debug("findCustomers() method exit");
                        // return
                        return resolve(this.customerList);
                    });
            } catch (e) {
                // unexpected errors
                logger.error("Unexpected error occurred.");
                logger.debug("findCustomers() method exit");
                return reject(ErrorHandler.createErrorObject('04', e));
            }
        });
    }
}