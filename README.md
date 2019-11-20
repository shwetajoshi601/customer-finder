# Customer Finder

## Table of Contents
- [Introduction](#introduction)
- [How Customer Finder works](#how-customer-finder-works)
- [Pre-requisites](#pre-requisites)
- [Application Setup and Configuration](#application-setup-and-configuration)
- [Executing the application](#executing-the-application)
  * [Output](#output)
  * [Error Handling](#error-handling)
- [Running Test Cases](#running-test-cases)

## Introduction

A commandline application that finds a list of customers within a specified radius from the main location. This application uses the great circle distance to filter the customers and gives a list of customers sorted by User ID.

The application has been built using TypeScript and Node.js.

## How Customer Finder works

1. The application first reads the config file specified via a commandline argument. This config file contains certain parameters such as the path to the customer data file, etc. main.ts is the starting point of the application.
2. The CustomerFinder class methods are invoked from main.ts. The configuration is validated and loaded. Any missing or invalid fields are reported through an error.
3. Once the config is validated, findCustomers() method of the CustomerFinder class is invoked. This method reads the customers.txt file present in the /data folder in the root directory. (Note: You may place the file at another location and specify the path in the config.json file)
4. The application reads the file line by line and performs the following steps:
    * Parse the JSON record. Any errors in the JSON record are reported.
    * Validate and Parse the latitude and longitude for the customer record. If the values for latitude/longitude are invalid an error is reported.
    * Convert the latitude and longitude to radians.
    * Calculate the Great Circle Distance from the main location co-ordinates.
    * If the distance is less than or equal to the desired radius, then the customer record is added to a list.
5. Once all the records have been read, the customer list is sorted by User ID.
6. The User ID and Names of the customers are displayed on the console.


## Pre-requisites

In order to run the application, Make sure you have the following installed:

**1. Node.js version 12.x.x and npm version 6.x.x**

Node.js can be downloaded and installed from [Node.js Official Website](https://nodejs.org/en/)

To check your Node.js and npm version do:

    node -v
    npm -v

**2. Python version 2.7.x or above**

Node.js needs Python for installing source modules. You can download python from [Python Downloads](https://www.python.org/downloads/)

**3. Typescript**

To check if typescript is installed, type the command:

    tsc

It should print the typescript help.
If you see an error, you probably need to install typescript.

To install do:

    npm install -g typescript

You should see the version of TypeScript installed.

## Application Setup and Configuration

1. Clone the folder into your local file system:

    ````
    git clone https://github.com/shwetajoshi601/customer-finder.git
    cd ./customer-finder
    ````

2. From the command prompt, install the node modules using command:
    ````
    npm install
    ````

3. You may specify the following environment variables:


    |Variable Name| Description|
    |-------------|---|
    |APP_NAME|Name of the application to be used for logging. Default: 'customer-finder'|
    |LOG_LEVEL|Log level - debug, info, error. Default: 'info'|
    |LOG_FILE|Location and name of the log file to be generated. Default: 'customer-finder.log'|
    |DIST_THRESHOLD|Maximum radius from the main location in km. Default: 100|

    ````
    On windows command prompt:

    set APP_NAME=<value>
    set LOG_LEVEL=<value>
    set LOG_FILE=<value>
    set DIST_THRESHOLD=<value>
    ````

**4. Configuration**

The application expects the path of a config file as a commandline argument during execution. The root directory consists of a **config.json** file. The contents are as follows:
```
{
    "customerDataSrc": "./data/customers.txt",
    "mainCoordinates": {
        "latitude": "53.339428",
        "longitude": "-6.257664"
    },
    "distanceThreshold" : 100
}
```

Following is the description of the fields:

| Field | Description |
|---|---|
|customerDataSrc| Path of the .txt file that contains the customer records. Ensure that you escape the '\\' character while entering the path. The file must contain one valid JSON record on each line. The root directory contains a folder data with a customers.txt file|
|mainCoordinates| GPS Co-ordinates (latitude and longitude) in degrees of the main location from where the distance needs to be measured.
|distanceThreshold|Maximum radius from the main location in kilometers.|

Here, "customerDataSrc" and "mainCoordinates" are mandatory fields. The application will throw an error if any of these are missing. distanceThreshold is an optional field, if you do not provide a value in the config.json file, the application will use the value from the environment variable or a default value of 100.

Following is a snippet from the data/customers.txt file. Ensure that you have the records in the following format:

```
{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}
{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}
{"latitude": "51.8856167", "user_id": 2, "name": "Ian McArdle", "longitude": "-10.4240951"}
{"latitude": "52.3191841", "user_id": 3, "name": "Jack Enright", "longitude": "-8.5072391"}
```

## Executing the application

Once you have completed all the setup and configuration mentioned above, you can build and run the application.

Follow the below steps:

**1. Build**

Make sure you are at the root directory of the application.
On the command prompt, enter the following command:
```
npm run build
```
This will compile the application and generate a build folder in the root directory.

**2. Execute**

On the command prompt, enter the following command:
```
npm run find ../config.json
```
Here '../config.json' is a commandline argument that specifies the path of the config file. If you are using the default config.json, you may use the same path.

### Output

If you have done all the configurations and setup correctly, you will see a list of customers with their User ID and Name sorted by User ID.

A sample output using the customers.txt file is available in the output.txt in the data folder file in the root directory.

### Error Handling

If there are any errors, they will be displayed in the format:
```
{
    "Code": String,
    "Error": String,
    "Message": String
}
```
Following are some of the errors given by the application in various scenarios:

Code | Error | Message |
|---|---|---|
| 01 | FileNotFound | The file 'fileName' not found. Please check if you have specified the correct file name and path. Please make sure the file exists at the specified path.
| 02 | MandatoryFieldMissing | The field 'fieldName' is missing. |
| 03 | InvalidValue | The value for 'fieldName' is invalid. This field must be a valid number. Please check if the field is not empty in the config or any of the records in the data file. |
| 04 | Error | An error has occurred. Details: 'error' |
| 05 | InvalidFileType | The data file 'fileName' must be a .txt file with JSON entries for the data. |
| 06 | InvalidJSONRecord | The data file 'fileName' contains invalid JSON record(s). Please check if all the entries form a valid JSON object. |

## Running Test Cases

Unit test cases for this application have been written using the Mocha framework. Before running the test cases, ensure you update the path of the customerDataSrc field in the JSON files present in test/unit/test-data. Each of these files are supplied as input to different test cases for different scenarios.

Follow the below steps to run the test cases:

**1. Build**
Build the test file using the following command:
```
npm run build-test
```

**2. Run**
Run the test cases using the following command:
```
npm run unit-test
```

The test coverage report will be generated in the "coverage" folder in the root directory. You can view the reports by opening the coverage/index.html file in your browser.

Following coverage details are displayed on the browser:

![Coverage](https://user-images.githubusercontent.com/16982762/69279339-0bfc0d80-0bdc-11ea-88d6-e1c93f625d2d.PNG)
