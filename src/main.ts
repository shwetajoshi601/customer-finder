import {CustomerFinder} from './customer-finder';
import {Logger} from './logger';
import {ICustomer} from './models/Customer';
import {Error} from './error-handler';

let logger = Logger.getLogger();

let cf: CustomerFinder = new CustomerFinder();
let result = cf.loadConfig();
// error in configuration
if (result instanceof Error) {
    logger.error("An error occurred in loading the configuration.");
    logger.error(result);
    console.log(JSON.stringify(result));
} else {
    console.log("Loaded the configuration successfully.");
    logger.info("Loaded the configuration successfully.");

    // find the list of customers
    let promiseObj: Promise<Array<ICustomer> | Error> = cf.findCustomers();
    promiseObj.then((customerList: any) => {
        // success
        logger.info("Succesfully found the list of customers");
        console.log("Successfully found the list of customers");
        cf.displayCustomerList(customerList);
    }, (error) => {
        // error
        logger.error("An eror occurred: " + JSON.stringify(error));
        console.log(error);
    });
}