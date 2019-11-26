import * as chai from 'chai';
import * as path from 'path';
import { CustomerFinder } from '../../src/customer-finder';
import { Error } from '../../src/error-handler';
import { ICustomer } from '../../src/models/Customer';

let expect = chai.expect;
let assert = chai.assert;

let cf = new CustomerFinder();

describe('Customer Finder Unit Test Cases', () => {

    describe('Load and Validate configuration Unit Test Cases', () => {

        it('Should validate the config successfully and not return error', (done) => {
            console.log("Currnt DIR: " + __dirname);
            process.argv[2] = path.join(__dirname, '/test-data/sample-config.json');
            let res = cf.loadConfig();
            expect(res).is.undefined;
            done();
        });

        it('Should return error FileNotFound for sample-config.json', (done) => {
            console.log("Currnt DIR: " + __dirname);
            process.argv[2] = path.join(__dirname, '/test-data/sample-configx.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('01');
            expect(res.Error).to.equal('FileNotFound');
            done();
        });

        it('Should return error FileNotFound for customer.txt', (done) => {
            console.log("Currnt DIR: " + __dirname);
            process.argv[2] = path.join(__dirname, '/test-data/config-invalidCustFile.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('01');
            expect(res.Error).to.equal('FileNotFound');
            done();
        });

        it('Should return error MandatoryFieldMissing for missing customer file path', (done) => {
            console.log("Currnt DIR: " + __dirname);
            process.argv[2] = path.join(__dirname, '/test-data/config-missingPath.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('02');
            expect(res.Error).to.equal('MandatoryFieldMissing');
            done();
        });

        it('Should return error MandatoryFieldMissing for missing co-ordinates', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/config-missingCoords.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('02');
            expect(res.Error).to.equal('MandatoryFieldMissing');
            done();
        });

        it('Should return error InvalidValue for invalid co-ordinates', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/config-invalidCoords.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('03');
            expect(res.Error).to.equal('InvalidValue');
            done();
        });

        it('Should return error InvalidFileType for invalid customers.json file', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/sample-config-invalidType.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('05');
            expect(res.Error).to.equal('InvalidFileType');
            done();
        });

        it('Should return error MandatoryFieldMissing for missing main coordinates', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/config-missingMain.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('02');
            expect(res.Error).to.equal('MandatoryFieldMissing');
            done();
        });

        it('Should return error InvalidValue for invalid distanceThreshold', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/config-invalidDistance.json');
            let res: any = cf.loadConfig();
            expect(res).is.not.undefined;
            expect(res).is.not.null;
            assert(res instanceof Error, 'Failed: Error expected');
            expect(res.Code).to.equal('03');
            expect(res.Error).to.equal('InvalidValue');
            done();
        });

        it('Should use env value of distanceThreshold and not return error', (done) => {
            let threshold = '';
            before(()=> {
                threshold = process.env.DIST_THRESHOLD;
            });

            after(() => {
                process.env.DIST_THRESHOLD = threshold;
            });

            process.argv[2] = path.join(__dirname, '/test-data/config-missingDist-2.json');
            process.env.DIST_THRESHOLD = "100";
            let res: any = cf.loadConfig();
            console.log(res);
            expect(res).to.be.undefined;
            done();
        });

        it('Should use default value of distanceThreshold and not return error', (done) => {
            let threshold = '';
            before(()=> {
                threshold = process.env.DIST_THRESHOLD;
            });

            after(() => {
                process.env.DIST_THRESHOLD = threshold;
            });

            process.argv[2] = path.join(__dirname, '/test-data/config-missingDist-2.json');
            process.env.DIST_THRESHOLD = null;
            let res: any = cf.loadConfig();
            console.log(res);
            expect(res).to.be.undefined;
            done();
        });
    });

    describe('Find Customers Unit Test Cases', () => {
       // let configPath = '';
        before(() => {
           // configPath = process.argv[2];
            process.argv[2] = path.join(__dirname, '/test-data/sample-config.json');
            cf.loadConfig();
        });

        after(() => {
         //   process.argv[2] = configPath;
        });

        it('Should return result successfully with customer list', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/sample-config.json');
            cf.loadConfig();
            let res = cf.findCustomers();
            res.then((customers: any) => {
                expect(customers).to.not.be.undefined;
                expect(Array.isArray(customers)).to.be.true;
                expect(customers.length).to.equal(16)
                done();
            }, (error) => {
                console.log(error);
                expect(error).to.be.null;
                done();
            }).catch((error) => {
                console.log(error);
                done();
            });
        });

        it('Should return result successfully by skipping the entry with invalid latitude/longitude', (done) => {
            process.argv[2] = path.join(__dirname, '/test-data/config-invalidCustEntry.json');
            cf.loadConfig();
            let res = cf.findCustomers();
            res.then((customers: any) => {
                expect(customers).to.not.be.undefined;
                expect(Array.isArray(customers)).to.be.true;
                expect(customers.length).to.equal(15);
                done();
            }, (error) => {
                console.log(error);
                expect(error).to.be.null;
                done();
            }).catch((error) => {
                console.log(error);
                done();
            });
        });
    });
});

