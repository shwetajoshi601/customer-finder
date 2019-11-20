import { Logger } from './logger';

const logger = Logger.getLogger();

// class defining an error object
export class Error {
    Code: string;
    Error: string;
    Message: string;

    constructor(code: string, err: string, message: string) {
        this.Code = code;
        this.Error = err;
        this.Message = message;
    }
}

export class ErrorHandler {

    // error codes and messages
    static errorMessages = {
        '01': {
            'Err': 'FileNotFound',
            'Message': 'The file \'<placeholder>\' not found. Please check if you have specified the correct file name and path. Please make sure the file exists at the specified path.'
        },
        '02': {
            'Err': 'MandatoryFieldMissing',
            'Message': 'The field \'<placeholder>\' is missing. '
        },
        '03': {
            'Err': 'InvalidValue',
            'Message': 'The value for \'<placeholder>\' is invalid. This field must be a valid number. Please check if the field is not empty in any of the records.'
        },
        '04': {
            'Err': 'Error',
            'Message': 'An error has occurred. Details: <placeholder>'
        },
        '05': {
            'Err': 'InvalidFileType',
            'Message': 'The data file <placeholder> must be a .txt file with JSON entries for the data'
        },
        '06': {
            'Err': 'InvalidJSONRecord',
            'Message': 'The data file <placeholder> contains invalid JSON record(s). Please check if all the entries form a valid JSON object.'
        }
    };

    /**
     * Function to create an Error object
     * @param code - the error code to be used
     * @param placeholder - string to be inserted in the error message, e.g: a field name 
     */
    static createErrorObject(code: string, placeholder: string): Error {
        logger.debug("createErrorObject() method entry");
        let errorDetail = ErrorHandler.errorMessages.hasOwnProperty(code) ? ErrorHandler.errorMessages[code] : ErrorHandler.errorMessages['04'];

        errorDetail.Message = errorDetail.Message.replace('<placeholder>', placeholder);
        logger.debug("createErrorObject() method exit");
        return new Error(code, errorDetail.Err, errorDetail.Message);
    }
}